import { FieldEntry, PhigrosBinaryFile } from "../phi-binary"

/**
 * Currently there is no document for this file.
 * I don't really know what is this.
 * 
 */
export class PlayerGameKey {
    private binary: PhigrosBinaryFile
    
    private _keys: FieldEntry
    private _lanotaReadKeys: FieldEntry
    private _camelliaReadKey: FieldEntry

    /**
     * 
     * @param buff Decrypted buffer
     */
    constructor(buff: Buffer) {
        this.binary = new PhigrosBinaryFile([
            {
                type: 'arr',
                len: 'varshort',
                field: 'keys',
                definition: {
                    type: 'object',
                    definition: [
                        { // Key
                            type: 'string',
                            field: 'songName'
                        },
                        { // Begin value // WTF This should be a dynamic length array why write like this??
                            type: 'byte',
                            field: 'valueFlags'
                        },
                        { 
                            type: 'arr',
                            field: 'values',
                            len: {
                                expectedLen: 4,
                                skip: (_f, ctx) => {
                                    return ctx.curr >= ctx.prev.ctx.valueFlags
                                }
                            },
                            definition: {
                                type: 'byte',
                            }
                        }
                    ]
                }
            },
            {
                type: 'byte',
                field: 'lanotaReadKeys'
            },
            {
                type: 'boolean',
                field: 'camelliaReadKey'
            }
        ])

        this.binary.loadBuffer(buff)

        this._keys = this.binary.getEntry('keys')!
        this._lanotaReadKeys = this.binary.getEntry('lanotaReadKeys')!
        this._camelliaReadKey = this.binary.getEntry('camelliaReadKey')!
    }

    get keys(): GameKeyEntry[] {
        return this._keys.value
    }

    set keys(keys: GameKeyEntry[]) {
        this._keys.value = keys
    }

    get lanotaReadKeys(): number {
        return this._lanotaReadKeys.value
    }

    set lanotaReadKeys(keys: number) {
        this._lanotaReadKeys.value = keys
    }

    get camelliaReadKey() {
        return this._camelliaReadKey.value
    }

    set camelliaReadKey(key: boolean) {
        this._camelliaReadKey.value = key
    }

    save(): Buffer {
        this.binary.clearBuffer()

        this.binary.setEntry(this._keys)
        this.binary.setEntry(this._lanotaReadKeys)
        this.binary.setEntry(this._camelliaReadKey)

        return this.binary.saveBuffer()
    }
}

export type GameKeyEntry = {
    name: string,
    valueFlags: number,
    values: number[]
}