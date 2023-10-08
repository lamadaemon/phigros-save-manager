import { FieldEntry, PhigrosBinaryFile } from "../phi-binary"

export class PlayerGameRecord {
    private binary: PhigrosBinaryFile
    
    private _records: FieldEntry

    /**
     * 
     * @param buff Decrypted buffer
     */
    constructor(buff: Buffer) {
        this.binary = new PhigrosBinaryFile([
            {
                type: 'arr',
                len: 'varshort',
                field: 'records',
                definition: {
                    type: 'object',
                    definition: [
                        { // Key
                            type: 'string',
                            field: 'songName'
                        },
                        { // Begin Value
                            type: 'byte',
                            field: '_unknownValue1'
                        },
                        {
                            type: 'byte',
                            field: 'levelExsistanceFlag'
                        },
                        {
                            type: 'byte',
                            field: 'fcFlag'
                        }, 
                        {
                            type: 'arr',
                            field: 'levelRecords',
                            len: {
                                expectedLen: 4,
                                skip: (_f, ctx) => {
                                    return (ctx.prev.ctx.levelExsistanceFlag & (1 << ctx.curr)) === 0
                                }
                            },
                            definition: {
                                type: 'object',
                                definition: [
                                    {
                                        type: 'int',
                                        field: 'score'
                                    },
                                    {
                                        type: 'float',
                                        field: 'accuracy'
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ])

        this.binary.loadBuffer(buff)
        this._records = this.binary.getEntry('records')!
    }

    get records(): PlayerRecord[] {
        return this._records.value
    }
    
    set records(records: PlayerRecord[]) {
        this._records.value = records
    }

    save(): Buffer {
        this.binary.clearBuffer()
        this.binary.setEntry(this._records)

        return this.binary.saveBuffer()
    }
}

export type LevelRecord = {
    score: number,
    accuracy: number
}

export type PlayerRecord = {
    songName: string,
    _unknownValue1: number, 
    levelExsistanceFlag: number,
    fcFlag: number,
    levelRecords: LevelRecord[]
}