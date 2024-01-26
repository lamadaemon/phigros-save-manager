import { FieldEntry, PhigrosBinaryFile } from "../phi-binary"

export class PlayerGameProgress {
    private binary: PhigrosBinaryFile

    isFirstRun: FieldEntry
    legacyChapterFinished: FieldEntry
    alreadyShowCollectionTip: FieldEntry
    alreadyShowAutoUnlockINTip: FieldEntry
    completed: FieldEntry
    songUpdateInfo: FieldEntry
    challengeModeRank: FieldEntry
    money: FieldEntry
    unlockFlagOfSpasmodic: FieldEntry
    unlockFlagOfIgallta: FieldEntry
    unlockFlagOfRrharil: FieldEntry
    flagOfSongRecordKey: FieldEntry
    randomVersionUnlocked: FieldEntry
    chapter8UnlockBegin: FieldEntry
    chapter8UnlockSecondPhase: FieldEntry
    chapter8Passed: FieldEntry

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
    chapter8SongUnlocked: FieldEntry
    

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
        this.isFirstRun = this.binary.getEntry('isFirstRun')!
        this.legacyChapterFinished = this.binary.getEntry('legacyChapterFinished')!
        this.alreadyShowCollectionTip = this.binary.getEntry('alreadyShowCollectionTip')!
        this.alreadyShowAutoUnlockINTip = this.binary.getEntry('alreadyShowAutoUnlockINTip')!
        this.completed = this.binary.getEntry('completed')!
        this.songUpdateInfo = this.binary.getEntry('songUpdateInfo')!
        this.challengeModeRank = this.binary.getEntry('challengeModeRank')!
        this.money = this.binary.getEntry('money')!
        this.unlockFlagOfSpasmodic = this.binary.getEntry('unlockFlagOfSpasmodic')!
        this.unlockFlagOfIgallta = this.binary.getEntry('unlockFlagOfIgallta')!
        this.unlockFlagOfRrharil = this.binary.getEntry('unlockFlagOfRrharil')!
        this.flagOfSongRecordKey = this.binary.getEntry('flagOfSongRecordKey')!
        this.randomVersionUnlocked = this.binary.getEntry('randomVersionUnlocked')!
        this.chapter8UnlockBegin = this.binary.getEntry('chapter8UnlockBegin')!
        this.chapter8UnlockSecondPhase = this.binary.getEntry('chapter8UnlockSecondPhase')!
        this.chapter8Passed = this.binary.getEntry('chapter8Passed')!
        this.chapter8SongUnlocked = this.binary.getEntry('chapter8SongUnlocked')!

    }

    

    save(): Buffer {
        this.binary.clearBuffer()

        this.binary.setEntry(this.isFirstRun)
        this.binary.setEntry(this.legacyChapterFinished)
        this.binary.setEntry(this.alreadyShowCollectionTip)
        this.binary.setEntry(this.alreadyShowAutoUnlockINTip)
        this.binary.setEntry(this.completed)
        this.binary.setEntry(this.songUpdateInfo)
        this.binary.setEntry(this.challengeModeRank)
        this.binary.setEntry(this.money)
        this.binary.setEntry(this.unlockFlagOfSpasmodic)
        this.binary.setEntry(this.unlockFlagOfIgallta)
        this.binary.setEntry(this.unlockFlagOfRrharil)
        this.binary.setEntry(this.flagOfSongRecordKey)
        this.binary.setEntry(this.randomVersionUnlocked)
        this.binary.setEntry(this.chapter8UnlockBegin)
        this.binary.setEntry(this.chapter8UnlockSecondPhase)
        this.binary.setEntry(this.chapter8Passed)
        this.binary.setEntry(this.chapter8SongUnlocked)
        
        return this.binary.saveBuffer()
    }

    get chapter8SongUnlockedValue(): number {
        return this.chapter8SongUnlocked.value
    }

    set chapter8SongUnlockedValue(value: number) {
        this.chapter8SongUnlocked.value = value
    }

    get isFirstRunValue(): boolean {
        return this.isFirstRun.value
    }

    set isFirstRunValue(value: boolean) {
        this.isFirstRun.value = value
    }

    get legacyChapterFinishedValue(): boolean {
        return this.legacyChapterFinished.value
    }

    set legacyChapterFinishedValue(value: boolean) {
        this.legacyChapterFinished.value = value
    }

    get alreadyShowCollectionTipValue(): boolean {
        return this.alreadyShowCollectionTip.value
    }

    set alreadyShowCollectionTipValue(value: boolean) {
        this.alreadyShowCollectionTip.value = value
    }

    get alreadyShowAutoUnlockINTipValue(): boolean {
        return this.alreadyShowAutoUnlockINTip.value
    }

    set alreadyShowAutoUnlockINTipValue(value: boolean) {
        this.alreadyShowAutoUnlockINTip.value = value
    }

    get completedValue(): string {
        return this.completed.value
    }

    set completedValue(value: string) {
        this.completed.value = value
    }

    get songUpdateInfoValue(): number {
        return this.songUpdateInfo.value
    }

    set songUpdateInfoValue(value: number) {
        this.songUpdateInfo.value = value
    }

    get challengeModeRankValue(): number {
        return this.challengeModeRank.value
    }

    set challengeModeRankValue(value: number) {
        this.challengeModeRank.value = value
    }

    get moneyValue(): number[] {
        return this.money.value
    }

    set moneyValue(value: number[]) {
        this.money.value = value
    }

    get unlockFlagOfSpasmodicValue(): number {
        return this.unlockFlagOfSpasmodic.value
    }

    set unlockFlagOfSpasmodicValue(value: number) {
        this.unlockFlagOfSpasmodic.value = value
    }

    get unlockFlagOfIgalltaValue(): number {
        return this.unlockFlagOfIgallta.value
    }

    set unlockFlagOfIgalltaValue(value: number) {
        this.unlockFlagOfIgallta.value = value
    }

    get unlockFlagOfRrharilValue(): number {
        return this.unlockFlagOfRrharil.value
    }

    set unlockFlagOfRrharilValue(value: number) {
        this.unlockFlagOfRrharil.value = value
    }

    get flagOfSongRecordKeyValue(): number {
        return this.flagOfSongRecordKey.value
    }

    set flagOfSongRecordKeyValue(value: number) {
        this.flagOfSongRecordKey.value = value
    }

    get randomVersionUnlockedValue(): number {
        return this.randomVersionUnlocked.value
    }

    set randomVersionUnlockedValue(value: number) {
        this.randomVersionUnlocked.value = value
    }

    get chapter8UnlockBeginValue(): boolean {
        return this.chapter8UnlockBegin.value
    }

    set chapter8UnlockBeginValue(value: boolean) {
        this.chapter8UnlockBegin.value = value
    }

    get chapter8UnlockSecondPhaseValue(): boolean {
        return this.chapter8UnlockSecondPhase.value
    }

    set chapter8UnlockSecondPhaseValue(value: boolean) {
        this.chapter8UnlockSecondPhase.value = value
    }

    get chapter8PassedValue(): boolean {
        return this.chapter8Passed.value
    }

    set chapter8PassedValue(value: boolean) {
        this.chapter8Passed.value = value
    }
}