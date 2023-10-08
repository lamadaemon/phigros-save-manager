import { PhigrosBinaryFile } from "../phi-binary"

export class PlayerGameProgress {
    private binary: PhigrosBinaryFile

    isFirstRun: boolean
    legacyChapterFinished: boolean
    alreadyShowCollectionTip: boolean
    alreadyShowAutoUnlockINTip: boolean
    completed: string
    songUpdateInfo: number
    challengeModeRank: number
    money: number[]
    unlockFlagOfSpasmodic: number
    unlockFlagOfIgallta: number
    unlockFlagOfRrharil: number
    flagOfSongRecordKey: number
    randomVersionUnlocked: number
    chapter8UnlockBegin: boolean
    chapter8UnlockSecondPhase: boolean
    chapter8Passed: boolean

    /**
     * Bits representations:
     * 
     * 0: Crave Wave
     * 1: The Chariot ~REVIIVAL~
     * 2: Retribution
     * 3: Luminescence
     * 4: Distorted Fate
     * 5: DESTRUCTION 3,2,1
     */
    chapter8SongUnlocked: number
    

    /**
     * 
     * @param buff Decrypted buffer
     */
    constructor(buff: Buffer) {
        this.binary = new PhigrosBinaryFile([
            {
                type: 'boolean',
                field: 'isFirstRun'
            },
            {
                type: 'boolean',
                field: 'legacyChapterFinished'
            },
            {
                type: 'boolean',
                field: 'alreadyShowCollectionTip'
            },
            {
                type: 'boolean',
                field: 'alreadyShowAutoUnlockINTip'
            },
            {
                type: 'string',
                field: 'completed'
            },
            {
                type: 'byte',
                field: 'songUpdateInfo'
            },
            {
                type: 'short',
                field: 'challengeModeRank'
            },
            {
                type: 'arr',
                definition: {
                    type: 'varshort'
                },
                field: 'money',
                len: 5
            },
            {
                type: 'byte',
                field: 'unlockFlagOfSpasmodic'
            },
            {
                type: 'byte',
                field: 'unlockFlagOfIgallta'
            },
            {
                type: 'byte',
                field: 'unlockFlagOfRrharil'
            },
            {
                type: 'byte',
                field: 'flagOfSongRecordKey'
            },
            {
                type: 'byte',
                field: 'randomVersionUnlocked'
            },
            {
                type: 'boolean',
                field: 'chapter8UnlockBegin'
            },
            {
                type: 'boolean',
                field: 'chapter8UnlockSecondPhase'
            },
            {
                type: 'boolean',
                field: 'chapter8Passed'
            },
            {
                type: 'byte',
                field: 'chapter8SongUnlocked'
            },
        ])

        this.binary.loadBuffer(buff)
        
        /*
            Since I changed the structure of PhigrosBinaryFile so these need to ported to new version
            Old version still working but move to new version can improve performance a little bit

            TODO: Migrate to new version (Checkout GameKey)
        */
        this.isFirstRun = <boolean>this.binary.get('isFirstRun')
        this.legacyChapterFinished = <boolean>this.binary.get('legacyChapterFinished')
        this.alreadyShowCollectionTip = <boolean>this.binary.get('alreadyShowCollectionTip')
        this.alreadyShowAutoUnlockINTip = <boolean>this.binary.get('alreadyShowAutoUnlockINTip')
        this.completed = <string>this.binary.get('completed')
        this.songUpdateInfo = <number>this.binary.get('songUpdateInfo')
        this.challengeModeRank = <number>this.binary.get('challengeModeRank')
        this.money = <number[]>this.binary.get('money')
        this.unlockFlagOfSpasmodic = <number>this.binary.get('unlockFlagOfSpasmodic')
        this.unlockFlagOfIgallta = <number>this.binary.get('unlockFlagOfIgallta')
        this.unlockFlagOfRrharil = <number>this.binary.get('unlockFlagOfRrharil')
        this.flagOfSongRecordKey = <number>this.binary.get('flagOfSongRecordKey')
        this.randomVersionUnlocked = <number>this.binary.get('randomVersionUnlocked')
        this.chapter8UnlockBegin = <boolean>this.binary.get('chapter8UnlockBegin')
        this.chapter8UnlockSecondPhase = <boolean>this.binary.get('chapter8UnlockSecondPhase')
        this.chapter8Passed = <boolean>this.binary.get('chapter8Passed')
        this.chapter8SongUnlocked = <number>this.binary.get('chapter8SongUnlocked')

    }

    

    save(): Buffer {
        this.binary.clearBuffer()

        this.binary.set('isFirstRun', this.isFirstRun )
        this.binary.set('legacyChapterFinished', this.legacyChapterFinished )
        this.binary.set('alreadyShowCollectionTip', this.alreadyShowCollectionTip )
        this.binary.set('alreadyShowAutoUnlockINTip', this.alreadyShowAutoUnlockINTip )
        this.binary.set('completed', this.completed )
        this.binary.set('songUpdateInfo', this.songUpdateInfo )
        this.binary.set('challengeModeRank', this.challengeModeRank )
        this.binary.set('money', this.money )
        this.binary.set('unlockFlagOfSpasmodic', this.unlockFlagOfSpasmodic )
        this.binary.set('unlockFlagOfIgallta', this.unlockFlagOfIgallta )
        this.binary.set('unlockFlagOfRrharil', this.unlockFlagOfRrharil )
        this.binary.set('flagOfSongRecordKey', this.flagOfSongRecordKey )
        this.binary.set('randomVersionUnlocked', this.randomVersionUnlocked )
        this.binary.set('chapter8UnlockBegin', this.chapter8UnlockBegin )
        this.binary.set('chapter8UnlockSecondPhase', this.chapter8UnlockSecondPhase )
        this.binary.set('chapter8Passed', this.chapter8Passed )
        this.binary.set('chapter8SongUnlocked', this.chapter8SongUnlocked )
        
        return this.binary.saveBuffer()
    }
}