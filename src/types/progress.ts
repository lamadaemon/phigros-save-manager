import { FieldEntry, PhigrosBinaryFile } from "../phi-binary"

export class PlayerGameProgress {
    static readonly VERSION = 3
    private binary: PhigrosBinaryFile

    _isFirstRun: FieldEntry
    _legacyChapterFinished: FieldEntry
    _alreadyShowCollectionTip: FieldEntry
    _alreadyShowAutoUnlockINTip: FieldEntry
    _completed: FieldEntry
    _songUpdateInfo: FieldEntry
    _challengeModeRank: FieldEntry
    _money: FieldEntry
    _unlockFlagOfSpasmodic: FieldEntry
    _unlockFlagOfIgallta: FieldEntry
    _unlockFlagOfRrharil: FieldEntry
    _flagOfSongRecordKey: FieldEntry
    _randomVersionUnlocked: FieldEntry
    _chapter8UnlockBegin: FieldEntry
    _chapter8UnlockSecondPhase: FieldEntry
    _chapter8Passed: FieldEntry

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
    _chapter8SongUnlocked: FieldEntry
    

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
        ], buff)

        if (this.binary.fileVersion !== PlayerGameProgress.VERSION) {
            throw new Error(`Unsupported version of gameProgress! Expected: ${PlayerGameProgress.VERSION}, got: ${this.binary.fileVersion}`)
        }

        this._isFirstRun = this.binary.getEntry('isFirstRun')!
        this._legacyChapterFinished = this.binary.getEntry('legacyChapterFinished')!
        this._alreadyShowCollectionTip = this.binary.getEntry('alreadyShowCollectionTip')!
        this._alreadyShowAutoUnlockINTip = this.binary.getEntry('alreadyShowAutoUnlockINTip')!
        this._completed = this.binary.getEntry('completed')!
        this._songUpdateInfo = this.binary.getEntry('songUpdateInfo')!
        this._challengeModeRank = this.binary.getEntry('challengeModeRank')!
        this._money = this.binary.getEntry('money')!
        this._unlockFlagOfSpasmodic = this.binary.getEntry('unlockFlagOfSpasmodic')!
        this._unlockFlagOfIgallta = this.binary.getEntry('unlockFlagOfIgallta')!
        this._unlockFlagOfRrharil = this.binary.getEntry('unlockFlagOfRrharil')!
        this._flagOfSongRecordKey = this.binary.getEntry('flagOfSongRecordKey')!
        this._randomVersionUnlocked = this.binary.getEntry('randomVersionUnlocked')!
        this._chapter8UnlockBegin = this.binary.getEntry('chapter8UnlockBegin')!
        this._chapter8UnlockSecondPhase = this.binary.getEntry('chapter8UnlockSecondPhase')!
        this._chapter8Passed = this.binary.getEntry('chapter8Passed')!
        this._chapter8SongUnlocked = this.binary.getEntry('chapter8SongUnlocked')!

    }

    save(): Buffer {
        this.binary.clearBuffer()

        this.binary.setEntry(this._isFirstRun)
        this.binary.setEntry(this._legacyChapterFinished)
        this.binary.setEntry(this._alreadyShowCollectionTip)
        this.binary.setEntry(this._alreadyShowAutoUnlockINTip)
        this.binary.setEntry(this._completed)
        this.binary.setEntry(this._songUpdateInfo)
        this.binary.setEntry(this._challengeModeRank)
        this.binary.setEntry(this._money)
        this.binary.setEntry(this._unlockFlagOfSpasmodic)
        this.binary.setEntry(this._unlockFlagOfIgallta)
        this.binary.setEntry(this._unlockFlagOfRrharil)
        this.binary.setEntry(this._flagOfSongRecordKey)
        this.binary.setEntry(this._randomVersionUnlocked)
        this.binary.setEntry(this._chapter8UnlockBegin)
        this.binary.setEntry(this._chapter8UnlockSecondPhase)
        this.binary.setEntry(this._chapter8Passed)
        this.binary.setEntry(this._chapter8SongUnlocked)
        
        return this.binary.saveBuffer()
    }

    get isFirstRun(): boolean {
        return this._isFirstRun.value
    }

    set isFirstRun(newVal: boolean) {
        this._isFirstRun.value = newVal
    }

    get legacyChapterFinished(): boolean {
        return this._legacyChapterFinished.value
    }

    set legacyChapterFinished(newVal: boolean) {
        this._legacyChapterFinished.value = newVal
    }

    get alreadyShowCollectionTip(): boolean {
        return this._alreadyShowCollectionTip.value
    }

    set alreadyShowCollectionTip(newVal: boolean) {
        this._alreadyShowCollectionTip.value = newVal
    }

    get alreadyShowAutoUnlockINTip(): boolean {
        return this._alreadyShowAutoUnlockINTip.value
    }

    set alreadyShowAutoUnlockINTip(newVal: boolean) {
        this._alreadyShowAutoUnlockINTip.value = newVal
    }

    get completed(): string {
        return this._completed.value
    }

    set completed(newVal: string) {
        this._completed.value = newVal
    }

    get songUpdateInfo(): number {
        return this._songUpdateInfo.value
    }

    set songUpdateInfo(newVal: number) {
        this._songUpdateInfo.value = newVal
    }

    get challengeModeRank(): number {
        return this._challengeModeRank.value
    }

    set challengeModeRank(newVal: number) {
        this._challengeModeRank.value = newVal
    }

    get money(): number[] {
        return this._money.value
    }

    set money(newVal: number[]) {
        this._money.value = newVal
    }

    get unlockFlagOfSpasmodic(): number {
        return this._unlockFlagOfSpasmodic.value
    }

    set unlockFlagOfSpasmodic(newVal: number) {
        this._unlockFlagOfSpasmodic.value = newVal
    }

    get unlockFlagOfIgallta(): number {
        return this._unlockFlagOfIgallta.value
    }

    set unlockFlagOfIgallta(newVal: number) {
        this._unlockFlagOfIgallta.value = newVal
    }

    get unlockFlagOfRrharil(): number {
        return this._unlockFlagOfRrharil.value
    }

    set unlockFlagOfRrharil(newVal: number) {
        this._unlockFlagOfRrharil.value = newVal
    }

    get flagOfSongRecordKey(): number {
        return this._flagOfSongRecordKey.value
    }

    set flagOfSongRecordKey(newVal: number) {
        this._flagOfSongRecordKey.value = newVal
    }

    get randomVersionUnlocked(): number {
        return this._randomVersionUnlocked.value
    }

    set randomVersionUnlocked(newVal: number) {
        this._randomVersionUnlocked.value = newVal
    }

    get chapter8UnlockBegin(): boolean {
        return this._chapter8UnlockBegin.value
    }

    set chapter8UnlockBegin(newVal: boolean) {
        this._chapter8UnlockBegin.value = newVal
    }

    get chapter8UnlockSecondPhase(): boolean {
        return this._chapter8UnlockSecondPhase.value
    }

    set chapter8UnlockSecondPhase(newVal: boolean) {
        this._chapter8UnlockSecondPhase.value = newVal
    }

    get chapter8Passed(): boolean {
        return this._chapter8Passed.value
    }

    set chapter8Passed(newVal: boolean) {
        this._chapter8Passed.value = newVal
    }

    get chapter8SongUnlocked(): number {
        return this._chapter8SongUnlocked.value
    }

    set chapter8SongUnlocked(newVal: number) {
        this._chapter8SongUnlocked.value = newVal
    }

    public isChapter8SongUnlocked(songIndex: Chapter8Song): boolean {
        return (this.chapter8SongUnlocked & (1 << songIndex)) > 0
    }

    public setMoney(amount: number, at: number) {
        this.money[at] = amount
    }

    // TODO test code
    public editMoney(expr: string) {
        let amount = 0
        for (let i = 0; i < this.money.length; i++) {
            let curr = parseInt(expr[i])
            if (isNaN(curr)) {
                switch (expr[i]) {
                    case 'k':
                    case 'K':
                        this.setMoney(amount, 0)
                        break
                    case 'm':
                    case 'M':
                        this.setMoney(amount, 1)
                        break
                    case 'g':
                    case 'G':
                        this.setMoney(amount, 2)
                        break
                    case 't':
                    case 'T':
                        this.setMoney(amount, 3)
                        break
                    case 'p':
                    case 'P':
                        this.setMoney(amount, 4)
                        break
                }

                if (expr[i + 1] === 'B' || expr[i + 1] === 'b') {
                    i ++
                }
            } else {
                amount *= 10
                amount += curr
            }
        }
    }
}

export enum Chapter8Song {
    CraveWave,
    TheChariotRevival,
    Retribution,
    Luminescence,
    DistortedFate,
    Destruction321
}