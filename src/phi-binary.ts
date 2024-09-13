import { PhigrosSaveManager } from ".."

export type PhigrosBinaryPrimitives = string | boolean | number | number[] | string[]
export type PhigrosBinaryRaw = 'string' | 'byte' | 'short' | 'varshort' | 'int' | 'float' | 'boolean'

export type PhigrosBinaryStructure = PhigrosBinaryRegularEntryStructure | PhigrosBinaryObjectStructure | PhigrosBinaryArrayStructure

export type NamedField = {
    field: string
}

export interface PhigrosBinaryRegularEntryStructure {
    type: PhigrosBinaryRaw
    field?: string,
}

export interface ConditionalLength {
    expectedLen: number | 'varshort' | 'short'

    skip(f: PhigrosBinaryFile, ctx: { op: 'r' | 'w', ctx: any, curr: any, prev?: any }): boolean 
}

export interface PhigrosBinaryArrayStructure {
    type: 'arr',
    field?: string,
    len: number | 'varshort' | 'short' | ConditionalLength,
    definition: PhigrosBinaryStructure
}

export interface PhigrosBinaryObjectStructure  {
    type: 'object',
    field?: string,
    base?: any,
    length?: number | 'byte',
    definition: (PhigrosBinaryStructure & NamedField)[], // TODO: Add conditional field
}

export class FieldEntry {
    public readonly structure: PhigrosBinaryStructure
    public value: any
    public position: number

    constructor(structure: PhigrosBinaryStructure, position: number, value: any) {
        this.structure = structure
        this.position = position
        this.value = value
    }
}

export type BinaryLoadConfig = Partial<{
    /**
     * If encryption is undefined or true, it will treat as encrypted file and will try to decrypt.
     */
    encryption: boolean,
    /**
     * If version is provided, it will check the version of the file if encryption is undefined or true
     */
    version: number
}>

export class PhigrosBinaryFile {
    private static typeSize: { [key in PhigrosBinaryRaw]: number } = {
        string: 128,
        byte: 1,
        short: 2,
        varshort: 2,
        int: 4,
        float: 4,
        boolean: 1
    }

    private config: BinaryLoadConfig
    private buff: Buffer
    private fieldDefinitions: PhigrosBinaryStructure[]

    private fields: FieldEntry[] = []
    private cursor: number = 0

    private bitPos: number = 0
    private boolReg: number = 0

    readonly fileVersion: number

    constructor(fielDefinitions: PhigrosBinaryStructure[], buff?: Buffer, config?: BinaryLoadConfig) {
        this.config = config ?? { encryption: true }
        this.fieldDefinitions = fielDefinitions

        if (config?.encryption !== undefined && !config.encryption) {
            this.buff = buff ?? Buffer.alloc(this.calculateSize())
        } else {
            if (!buff) {
                throw new Error("Buffer is required for decrypting!")
            }
            this.buff = PhigrosSaveManager.decrypt(buff)
        }
        
        this.fileVersion = buff?.at(0) ?? config?.version ?? 0

        for (const definition of this.fieldDefinitions) {
            this.fields.push(new FieldEntry(definition, this.fields.length, this.readFromDefinition(definition)))
        }
    }

    public loadBuffer(buff: Buffer) {
        this.buff = buff ?? this.buff
    }

    public readFromDefinition(definition: PhigrosBinaryStructure, ctx?: any): any {
        switch(definition.type) {
            case 'byte':
                return this.readByte()
            case 'short':
                return this.readShort()

            case 'varshort':
                return this.readVariableShort()

            case 'arr':
                let len = 0
                let condition: ((f: PhigrosBinaryFile, ctx: { op: "r" | "w"; ctx: any; curr: any; prev?: any; }) => boolean) = () => false

                if (typeof definition.len === 'number') {
                    len = definition.len
                } else {
                    if (definition.len === 'varshort') {
                        len = this.readVariableShort()
                    } else if (definition.len === 'short') {
                        len = this.readShort()
                    } else if ('skip' in definition.len) {
                        if (typeof definition.len.expectedLen === 'string') {
                            if (definition.len.expectedLen === 'varshort') {
                                len = this.readVariableShort()
                            } else if (definition.len.expectedLen === 'short') {
                                len = this.readShort()
                            }
                        } else {
                            len = definition.len.expectedLen
                        }
                        condition = definition.len.skip
                    } else {
                        throw new PhigrosBinaryParseError("The type for dynamic length dosen't supported!")
                    }
                }

                const arr: any[] = [];
                for (let i = 0; i < len; i++) {
                    if (condition(this,  { op: 'r', ctx: arr, curr: i, prev: ctx})) {
                        arr.push(null)
                    } else {
                        arr.push(this.readFromDefinition(definition.definition, { op: 'r', ctx: arr, curr: i, prev: ctx}))
                    }
                }

                return arr

            case 'int':
                return this.readInt()    
            
            case 'string':
                return this.readString()
        
            case 'float':
                return this.readFloat()

            case 'boolean':
                return this.readBoolean()
            case 'object':
                const obj: any = { ...definition.base }
                const start = this.cursor

                let expectedLen: number | null = null
                if (definition.length) {
                    if (typeof definition.length === 'number') {
                        expectedLen = definition.length
                    } else if (definition.length === 'byte') {
                        expectedLen = this.readByte()
                    } else {
                        throw new PhigrosBinaryParseError("The type for dynamic length dosen't supported!")
                    }
                }

                for (const i of definition.definition) {
                    obj[i.field] = this.readFromDefinition(i, { op: 'r', ctx: obj, curr: i, prev: ctx})
                }

                const usedSpace = this.cursor - start - 1
                if (expectedLen && usedSpace !== definition.length) {
                    this.shiftCursor(expectedLen - usedSpace)
                }

                return obj
            default:
                throw new Error("Impossible Code Reached!")
        }
    }

    public clearBuffer() {
        this.buff = Buffer.alloc(this.calculateSize())
        this.cursor = 0
        this.boolReg = 0
        this.bitPos = 0
    } 

    public get(key: string): any | undefined {
        return this.getEntry(key)?.value  
    }

    public getSequencied(index: number): any | undefined {
        return this.fields[index]?.value
    }

    public getEntry(key: string): FieldEntry | undefined {
        return this.fields.filter(({ structure }) => structure.field === key)[0]   
    }

    public getSequenciedEntry(index: number): FieldEntry | undefined {
        return this.fields[index]
    }

    public set(key: string, newValue: any) {
        const val = this.getEntry(key)
        if (!val) {
            throw new Error("No such field!")
        }

        val.value = newValue   
    }

    public setEntry(entry: FieldEntry) {
        this.fields[entry.position] = entry
    }

    public getAll() {
        return this.fields
    }
    
    public saveBuffer(): Buffer {
        this.clearBuffer()
        for (const e of this.fields) {
            this.writeFromEntry(e)
        }

        this.resetBitCursor()
        if (this.config.encryption !== undefined && !this.config.encryption) {
            console.log("Not encrypting!")
            return this.buff.subarray(0, this.cursor)
        }

        return PhigrosSaveManager.encrypt(this.buff.subarray(0, this.cursor), this.fileVersion)
    }

    public writeFromEntry(definition: FieldEntry) {
        this.writeFromDefinition(definition.structure, definition.value)
    }

    public writeFromDefinition(definition: PhigrosBinaryStructure, value: any) {
        switch(definition.type) { // Types validated so cast to any
            case 'byte':
                this.writeByte(<number>value)
                break;

            case 'short':
                this.writeShort(<number>value)
                break;

            case 'varshort':
                this.writeVaribleShort(<number>value)
                break;

            case 'arr':
                const len = (<any[]>value).length
                if (typeof definition.len === 'string') {
                    if (definition.len === 'short') {
                        this.writeShort(len)
                    } else if (definition.len === 'varshort') {
                        this.writeVaribleShort(len)
                    } else {
                        throw new PhigrosBinaryParseError("Unreachble code reached!")
                    }
                } else if (typeof definition.len === 'object') {
                    if (definition.len.expectedLen === 'short') {
                        this.writeShort(len)
                    } else if (definition.len.expectedLen === 'varshort') {
                        this.writeVaribleShort(len)
                    } // else -> Fixed Length no need write length of array
                } // else -> Fixed Length no need write length of array

                for (let i = 0; i < len; i ++) {
                    if (!value[i]) {
                        continue
                    }

                    this.writeFromDefinition(definition.definition, (<any[]>value)[i])
                }
                break;

            case 'int':
                this.writeInt(<number>value)
                break;      

            case 'string':
                this.writeString(<string>value)
                break;
        
            case 'float':
                this.writeFloat(<number>value)
                break;
            
            case 'boolean':
                this.writeBoolean(<boolean>value)
                break;

            case 'object':
                const lengthLocation = this.cursor
                if (definition.length) {
                    this.writeByte(0) // Placeholder
                }
            
                for (const i of definition.definition) {
                    this.writeFromDefinition(i, value[i.field])
                }

                const endLocation = this.cursor
                if (definition.length) {
                    this.shiftCursorTo(lengthLocation)
                    this.writeByte(endLocation - lengthLocation - 1)
                    this.shiftCursorTo(endLocation)
                }

                break;
            default:
                throw new Error("Impossible Code Reached!")
        }
    }

    public readBoolean(): boolean {
        if (this.bitPos === 8) {
            this.resetBitCursor()

            return this.readBoolean()
        }
        return (this.buff.at(this.cursor)! & 0b0000_0001 << this.bitPos ++) != 0
    }

    public writeBoolean(bool: boolean) {
        if (this.bitPos === 0) {
            this.boolReg = bool ? 1 : 0
            this.bitPos ++
        } else if (this.bitPos >= 8) {
            this.resetBitCursor()
            this.writeBoolean(bool)
        } else {
            this.boolReg += (bool ? 1 : 0) * (2 ** this.bitPos ++)
        }
    }

    public readByte() {
        if (!this.checkLen(1)) {
            throw new PhigrosBinaryParseError("Index exceeds!")
        }

        this.resetBitCursor()

        return this.buff.at(this.cursor ++)!
    }

    public writeByte(byte: number) {
        if (!this.checkSize(byte, 1)) {
            throw new PhigrosBinaryParseError("Data type mismatch")
        }

        this.resetBitCursor()

        this.buff.writeUint8(byte, this.cursor ++)
    }

    public readShort() {
        if (!this.checkLen(2)) {
            throw new PhigrosBinaryParseError("Index exceeds!")
        }

        this.resetBitCursor()

        return this.buff.at(this.cursor ++)! + (this.buff.at(this.cursor ++)! << 8)
    }

    public writeShort(short: number) {
        if (!this.checkSize(short, 2)) {
            throw new PhigrosBinaryParseError("Data type mismatch")
        }

        this.resetBitCursor()

        this.buff.writeInt16LE(short, this.cursor)
        this.cursor += 2
    }

    public readInt() {
        if (!this.checkLen(4)) {
            throw new PhigrosBinaryParseError("Index exceeds!")
        }

        this.resetBitCursor()

        return (this.buff.at(this.cursor ++)!       ) + 
               (this.buff.at(this.cursor ++)! << 8  ) + 
               (this.buff.at(this.cursor ++)! << 16 ) + 
               (this.buff.at(this.cursor ++)! << 24 )
    }

    public writeInt(int: number) {
        if (!this.checkSize(int, 4)) {
            throw new PhigrosBinaryParseError("Data type mismatch")
        }

        this.resetBitCursor()

        this.buff.writeInt32LE(int, this.cursor)
        this.cursor += 4
    }

    public readFloat() {
        this.resetBitCursor()
        
        return this.buff.subarray(this.cursor, this.cursor += 4).readFloatLE()
    }

    public writeFloat(float: number) {        
        if (!this.checkSize(float, 3)) {
            throw new PhigrosBinaryParseError("Data type mismatch")
        }
        this.resetBitCursor()
        
        this.buff.writeFloatLE(float, this.cursor)
        this.cursor += 4
    }

    public readVariableShort() {
        this.resetBitCursor()

        if (this.checkLen(2)) {
            if ((this.buff.at(this.cursor)! & 0b1000_0000)) {
                // Basically this is just appending the 2nd byte to the begainning of the first byte.
                // Original source of this algroithm uses XOR instead of PLUS.
                // They works the same way since XOR 0 doesn't change the original value.
                // To make it more clear I change XOR to PLUS.
                // To be noticed that in java all bitwise operations are done in int not the original type!
                //
                //                             NOTE: ↓ This sign bit is removed with: AND 0b0111_1111
                //   0b0000_0000_0000_0000_0000_0000_0AAA_AAAA
                // + 0b0000_0000_0000_0000_0BBB_BBBB_B000_0000
                // -------------------------------------------
                //   0b0000_0000_0000_0000_0BBB_BBBB_BAAA_AAAA
                return (this.buff.at(this.cursor ++)! & 0b0111_1111) + (this.buff.at(this.cursor ++)! << 7)
            } else {
                return this.buff.at(this.cursor ++)!
            }
        } else if (this.checkLen(1)) {
            return this.buff.at(this.cursor ++)!
        } else {
            throw new PhigrosBinaryParseError("Index exceeds!")
        }
    }

    public writeVaribleShort(vs: number) {
        if (!this.checkSize(vs, 2)) {
            throw new PhigrosBinaryParseError("Data type mismatch")
        }
        this.resetBitCursor()

        if (vs < 128) {
            this.writeByte(vs)
        } else {
            this.writeByte((vs & 0b0111_1111) | 0b1000_0000)
            this.writeByte(vs >> 7)
        }
    }

    public readString() {
        this.resetBitCursor()

        const len = this.readVariableShort()
        if (len === 0) {
            return ''
        }

        const result = this.buff.subarray(this.cursor, this.cursor + len).toString("utf8") // [cursor, cursor + len + 1)
        this.cursor += len
        return result
    }

    public writeString(str: string) {
        this.resetBitCursor()

        const byteLen = Buffer.from(str, 'utf8').length
        this.writeVaribleShort(byteLen)
        this.buff.write(str, this.cursor, 'utf8')

        this.cursor += byteLen
    }

    public shiftCursor(amount: number) {
        this.cursor += amount
    }

    public shiftCursorTo(location: number) {
        if (location < 0) {
            throw new PhigrosBinaryParseError("Index exceeds!")
        }

        this.cursor = location
    }

    private checkLen(len: number): boolean {
        return this.buff.length - this.cursor >= len
    }

    private checkSize(input: number, size: number): boolean {
        return input < 2 ** (size * 8)
    }

    private calculateSize(def?: PhigrosBinaryStructure[]) {
        let size = 0
        for (const i of def ?? this.fieldDefinitions) {
            if (i.type === 'object') {
                size += this.calculateSize(i.definition)
            } else if (i.type === 'arr') {
                if (typeof i.len === 'number') {
                    size += i.len * this.calculateSize([i.definition])
                } else {
                    size += 2 ** 8 * this.calculateSize([i.definition]) // Varshort is the biggest possible length. Which is 15bits in binary.
                                                                        // However Phigros will never reach that
                }
            } else {
                size += PhigrosBinaryFile.typeSize[i.type]
            }
        }

        return size
    }

    private resetBitCursor() {
        if (this.bitPos !== 0) {
            if (this.boolReg !== 0) {
                this.buff.writeUInt8(this.boolReg, this.cursor)
                this.boolReg = 0
            }

            this.bitPos = 0
            this.cursor ++
        }
    }
}

export class PhigrosBinaryParseError extends Error {}