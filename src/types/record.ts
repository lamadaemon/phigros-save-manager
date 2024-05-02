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
                        {
                            type: 'object',
                            field: 'records',
                            length: 'byte',
                            definition: [
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
                                        base: {
                                            rks(diff: number) {
                                                if (this.accuracy < 70) {
                                                    return 0
                                                }     
        
                                                return diff * (((this.accuracy - 55) / 45) ** 2)
                                            }
                                        },
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
                    ]
                }
            }
        ])

        this.binary.loadBuffer(buff)
        this._records = this.binary.getEntry('records')!
    }

    get records(): SongRecord[] {
        return this._records.value
    }
    
    set records(records: SongRecord[]) {
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
    accuracy: number,
    rks: (diff: number) => number
}

export type SongRecordBody = {
    levelExsistanceFlag: number,
    fcFlag: number,
    levelRecords: LevelRecord[]
}

export type SongRecord = {
    songName: string,
    records: SongRecordBody
}