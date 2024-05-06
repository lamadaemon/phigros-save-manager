import AdmZip from 'adm-zip';
import { createCipheriv, createDecipheriv } from 'crypto'
import { PlayerGameKey } from "./types/key";
import { PlayerGameProgress } from "./types/progress";
import { PlayerSettings } from "./types/settings";
import { PlayerInformation } from "./types/user";
import { LevelRecord, PlayerGameRecord } from "./types/record";
import { PhigrosBinaryParseError } from "./phi-binary";
import { getDifficulty } from "./difficulties";

const supportedVersion: { [key: string]: number } = {
    'user': 1,
    'settings': 1,
    'gameRecord': 1,
    'gameKey': 2,
    'gameProgress': 3
}

export class PhigrosSave {

    private static readonly DECRYPT_KEY = Buffer.from('6Jaa0qVAJZuXkZCLiOa/Ax5tIZVu+taKUN1V1nqwkks=', 'base64')
    private static readonly DECRYPT_IV = Buffer.from('Kk/wisgNYwcAV8WVGMgyUw==', 'base64')

    private _gameKey?: PlayerGameKey
    private _gameProgress?: PlayerGameProgress
    private _settings?: PlayerSettings
    private _user?: PlayerInformation
    private _gameRecord?: PlayerGameRecord

    constructor(buffer: Buffer) {
        const saveLocal = new AdmZip(buffer)
        const entries = saveLocal.getEntries()
        for (const i of entries) {
            if (!(i.name in supportedVersion)) {
                throw new Error(`Failed to parse game profile! This library is outdated! There is no support of file: ${i.name} `)
            }

            const data = PhigrosSave.decryptProfile(saveLocal.readFile(i)!, i.entryName);
            switch(i.name) {
                case 'gameKey':
                    this._gameKey = new PlayerGameKey(data)
                    break;
                case 'gameProgress':
                    this._gameProgress = new PlayerGameProgress(data)
                    break;
                case 'gameRecord':
                    this._gameRecord = new PlayerGameRecord(data)
                    break;
                case 'settings':
                    this._settings = new PlayerSettings(data)
                    break;
                case 'user':
                    this._user = new PlayerInformation(data)
                    break;
                default:
                    throw new PhigrosBinaryParseError("Unreachable code!")
            }
        }
    }

    get gameKey() {
        return this._gameKey!
    }

    get gameProgress() {
        return this._gameProgress!
    }

    get settings() {
        return this._settings!
    }

    get user() {
        return this._user!
    }

    get gameRecord() {
        return this._gameRecord!
    }

    /**
     * Calculate player's ranking score
     * 
     * The Player RKS is given by: (Best 19 RKS + Best RKS that have a 100% accuracy) / 20
     * Song RKS is given by: (((100 * acc - 55) / 45) ** 2) * diff, acc >= 0.7
     *                       0                                    , acc <  0.7
     */
    public rks(): number {        
        let phiRks = 0
        const allRks = []
        for(const i of this.gameRecord.records) {
            for (let j = 0; j < i.records.levelRecords.length; j++) {
                const record = i.records.levelRecords[j]

                if (!record) {
                    continue
                }

                const songRks = record.rks(getDifficulty(i.songName, j))
                allRks.push(songRks)

                if (record.accuracy === 100 && songRks > phiRks) {
                    phiRks = songRks
                }
            }
        }
        return (phiRks + allRks.sort((a, b) => b - a).slice(0, 19).reduce((prev, curr) => prev + curr)) / 20
    }

    public b19(): ((Omit<LevelRecord, 'rks'>) & { name: string, diff: number, rks: number })[] {
        const allRks = []
        for(const i of this.gameRecord.records) {
            for (let j = 0; j < i.records.levelRecords.length; j++) {
                const record = i.records.levelRecords[j]
                if (record == null) {
                    continue    
                }

                const diff = getDifficulty(i.songName, j)
                const songRks = record.rks(diff)

                allRks.push({...record, name: i.songName, diff: j, rks: songRks})
            }
        }

        return allRks.sort((a, b) => b.rks - a.rks).slice(0, 19)
    }

    /**
     * Fully unlock chapter 8
     */
    public rere8() {
        this.gameProgress.chapter8Passed = true
        this.gameProgress.chapter8SongUnlocked = 63
        this.gameProgress.chapter8UnlockBegin = true
        this.gameProgress.chapter8UnlockSecondPhase = true
        return this
    }

    /**
     * Clear unlock state of chapter 8
     */
    public re8() {
        this.gameProgress.chapter8Passed = false
        this.gameProgress.chapter8SongUnlocked = 0
        this.gameProgress.chapter8UnlockBegin = false
        this.gameProgress.chapter8UnlockSecondPhase = false
        return this
    }

    /**
     * Clear half unlock state of chapter 8
     * Unlock Crave Wave, The Chariot ~REVIIVAL~, Retribution, and DESTRUCTION 3,2,1
     */
    public partialRe8() {
        this.gameProgress.chapter8Passed = false
        this.gameProgress.chapter8SongUnlocked = 27 // Unlock Crave Wave, The Chariot ~REVIIVAL~, Retribution, and DESTRUCTION 3,2,1
        this.gameProgress.chapter8UnlockBegin = true
        this.gameProgress.chapter8UnlockSecondPhase = true
        return this
    }


    static decryptProfile(buff: Buffer, type?: string): Buffer {
        if (type && buff.at(0) !== supportedVersion[type]) {
            throw new Error("Failed to parse game profile! This library is outdated!")
        }
        
        const cipher = createDecipheriv("aes-256-cbc", PhigrosSave.DECRYPT_KEY, PhigrosSave.DECRYPT_IV).setAutoPadding(true)
        return Buffer.concat([cipher.update(buff.subarray(1)), cipher.final()])
    }

    static encryptProfile(buff: Buffer, type: string): Buffer {
        const cipher = createCipheriv("aes-256-cbc", PhigrosSave.DECRYPT_KEY, PhigrosSave.DECRYPT_IV).setAutoPadding(true)
        return Buffer.concat([
            new Uint8Array([supportedVersion[type]]),
            cipher.update(buff),
            cipher.final()
        ])      
    }
    
    public createSave(): Buffer {
        const zip = new AdmZip()
        zip.addFile('gameKey', PhigrosSave.encryptProfile(this._gameKey!.save(), 'gameKey'))
        zip.addFile('gameProgress', PhigrosSave.encryptProfile(this._gameProgress!.save(), 'gameProgress'))
        zip.addFile('settings', PhigrosSave.encryptProfile(this._settings!.save(), 'settings'))
        zip.addFile('user', PhigrosSave.encryptProfile(this._user!.save(), 'user'))
        zip.addFile('gameRecord', PhigrosSave.encryptProfile(this._gameRecord!.save(), 'gameRecord'))
        
        return zip.toBuffer()
    }

}
