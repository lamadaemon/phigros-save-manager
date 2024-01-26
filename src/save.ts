import axios, { Axios } from "axios";
import { APIEndpoints } from "./endpoints";
import { PlayerProfile, S2CRequestSave } from "./types/profile";
import fs = require('fs')
import AdmZip = require('adm-zip');
import { createCipheriv, createDecipheriv, createHash } from 'crypto'
import { PlayerGameKey } from "./types/key";
import { PlayerGameProgress } from "./types/progress";
import { PlayerSettings } from "./types/settings";
import { PlayerInformation } from "./types/user";
import { LevelRecord, PlayerGameRecord } from "./types/record";
import { PhigrosBinaryParseError } from "./phi-binary";
import { GameSaveSummary } from "./types/summary";
import { FilePartInfo, S2CRequestCreateFileToken, S2CRequestCreateUpload, S2CRequestUploadPart } from "./types/requests";
import { getDifficaulty } from "./difficaulties";

const supportedVersion: { [key: string]: number } = {
    'user': 1,
    'settings': 1,
    'gameRecord': 1,
    'gameKey': 2,
    'gameProgress': 3
}

export class PhigrosSave {
    private static readonly UPLOAD_BASE_URL = "https://upload.qiniup.com/buckets/rAK3Ffdi/objects"
    private static readonly PHIGROS_SERVICE_BASE_URL = "https://rak3ffdi.cloud.tds1.tapapis.cn/1.1"

    private static readonly DECRYPT_KEY = Buffer.from('6Jaa0qVAJZuXkZCLiOa/Ax5tIZVu+taKUN1V1nqwkks=', 'base64')
    private static readonly DECRYPT_IV = Buffer.from('Kk/wisgNYwcAV8WVGMgyUw==', 'base64')

    private httpClient: Axios
    private save?: PlayerProfile

    private _gameKey?: PlayerGameKey
    private _gameProgress?: PlayerGameProgress
    private _settings?: PlayerSettings
    private _user?: PlayerInformation
    private _gameRecord?: PlayerGameRecord
    private _summary?: GameSaveSummary

    constructor(sessionToken: string) {
        this.httpClient = new Axios({
            baseURL: PhigrosSave.PHIGROS_SERVICE_BASE_URL,

            headers: {
                "X-LC-Id": "rAK3FfdieFob2Nn8Am",
                "X-LC-Key": "Qr9AEqtuoSVS3zeD6iVbM4ZC0AtkJcQ89tywVyi0",
                "User-Agent": "LeanCloud-CSharp-SDK/1.0.3",
                "Accept": "application/json",
                "X-LC-Session": sessionToken
            },

            responseType: 'text'
        })

    }

    async init() {
        this.save = (await this.readRemoteSaves()).results[0]
        this._summary = new GameSaveSummary(Buffer.from(this.save!.summary, 'base64'))

        await this.loadSave(await this.downloadSave())
    }

    async loadSave(buffer: Buffer) {
        this.save = (await this.readRemoteSaves()).results[0]
        this._summary = new GameSaveSummary(Buffer.from(this.save!.summary, 'base64'))

        const saveLocal = new AdmZip(buffer)
        const entries = await saveLocal.getEntries()
        for (const i of entries) {
            if (!(i.name in supportedVersion)) {
                throw new Error(`Failed to parse game profile! This library is outdated! There is no support of file: ${i.name} `)
            }

            const data = await PhigrosSave.decryptProfile(await saveLocal.readFile(i)!, i.entryName);
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
                    throw new PhigrosBinaryParseError("Unknown save data type!")
            }
        }
    }

    async backup(location: string) {
        fs.writeFileSync(location, await this.downloadSave())
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

    get summary() {
        return this._summary!
    }

    get profile() {
        return this.save!
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
            for (let j = 0; j < i.levelRecords.length; j++) {
                const record = i.levelRecords[j]

                if (!record) {
                    continue
                }

                const songRks = record.rks(getDifficaulty(i.songName.substring(0, i.songName.length - 2), j))
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
            for (let j = 0; j < i.levelRecords.length; j++) {
                const record = i.levelRecords[j]
                const diff = getDifficaulty(i.songName, j)
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

    async readRemoteSaves(): Promise<S2CRequestSave> {
        const response = await this.httpClient.get(APIEndpoints.save)
        const deser = <S2CRequestSave> JSON.parse(response.data)

        if (deser.results.length == 0) {
            throw new APIError("No profiles was found!")
        }

        return deser
    }

    async downloadSave(): Promise<Buffer> {
        if (!this.save) {
            this.save = (await this.readRemoteSaves()).results[0]
            this._summary = new GameSaveSummary(Buffer.from(this.save!.summary, 'base64'))
        }

        const { data, status } = await axios.get(this.save!.gameFile.url, {
            responseType: 'arraybuffer'
        })
        
        if (status == 404) {
            throw new APIError("No profile was found! Server returned 404!")
        }

        return Buffer.from(data)
    }

    static async decryptProfile(buff: Buffer, type?: string): Promise<Buffer> {
        if (type && buff.at(0) !== supportedVersion[type]) {
            throw new Error("Failed to parse game profile! This library is outdated!")
        }
        
        return new Promise((resolve, reject) => {
            const cipher = createDecipheriv("aes-256-cbc", PhigrosSave.DECRYPT_KEY, PhigrosSave.DECRYPT_IV).setAutoPadding(true)
            resolve(Buffer.concat([cipher.update(buff.subarray(1)), cipher.final()]))

        })
    }

    static async encryptProfile(buff: Buffer, type: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const cipher = createCipheriv("aes-256-cbc", PhigrosSave.DECRYPT_KEY, PhigrosSave.DECRYPT_IV)
            resolve(Buffer.concat([
                new Uint8Array([supportedVersion[type]]),
                cipher.update(buff),
                cipher.final()
            ]))
        })        
    }
    
    async createSave(): Promise<Buffer> {
        const zip = new AdmZip()
        zip.addFile('gameKey', await PhigrosSave.encryptProfile(this._gameKey!.save(), 'gameKey'))
        zip.addFile('gameProgress', await PhigrosSave.encryptProfile(this._gameProgress!.save(), 'gameProgress'))
        zip.addFile('settings', await PhigrosSave.encryptProfile(this._settings!.save(), 'settings'))
        zip.addFile('user', await PhigrosSave.encryptProfile(this._user!.save(), 'user'))
        zip.addFile('gameRecord', await PhigrosSave.encryptProfile(this._gameRecord!.save(), 'gameRecord'))
        
        return await zip.toBufferPromise()
    }

    /**
     * Upload the save content to remote
     * 
     * **Since the save has been updated! You should re-initialize this class to do further actions!**
     * **Call init function or drop all reference to this instance after you called this function!**
     * @param save The save buffer
     */
    async uploadSave(save?: Buffer) {
        const saveBuffer = save ?? await this.createSave()
        const token = await this.createFileToken(saveBuffer)
        const uploadInfo = await this.createUpload(token)

        const parts: FilePartInfo[] = [ await this.uploadPart(1, saveBuffer, token, uploadInfo) ]
        await this.completeUpload(token, uploadInfo, parts)
        await this.updateSummary(token)
    }

    private async createFileToken(save: Buffer): Promise<S2CRequestCreateFileToken> {
        const fileTokenRequest = {
            "name": ".save",
            "__type": "File",
            "ACL": <any> {
            },
            "prefix": "gamesaves",
            "metaData": {
                "size": save.length,
                "_checksum": createHash('md5').update(save).digest().toString('hex'),
                "prefix": "gamesaves"
            }
        }

        fileTokenRequest.ACL[this.save!.user.objectId] =  {
            "read": true,
            "write": true
        }
        
        const response = await this.httpClient.request({
            url: APIEndpoints.fileTokens,
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            data: JSON.stringify(fileTokenRequest)
        })

        if (response.status !== 201){
            throw new APIError(`API Request failed! This library may outdated! Expected Status Code: 201, but Recived: ${response.status}, Server Reply: ${response.data}`)
        }

        return <S2CRequestCreateFileToken> JSON.parse(response.data)
    }

    private async createUpload(fileToken: S2CRequestCreateFileToken): Promise<S2CRequestCreateUpload> {
        const response = await axios.request({
            baseURL: PhigrosSave.UPLOAD_BASE_URL,
            url: `/${Buffer.from(fileToken.key).toString('base64')}/uploads`,
            method: "POST",
            headers: {
                "Authorization": `UpToken ${fileToken.token}`
            },
            responseType: 'text'
        })

        if (response.status !== 200) {
            throw new APIError(`API Request failed! This library may outdated! Expected Status Code: 200, but Recived: ${response.status}, Server Reply: ${response.data}`)
        }

        return <S2CRequestCreateUpload> JSON.parse(response.data)
    }

    private async uploadPart(part: number, data: Buffer, token: S2CRequestCreateFileToken, begin: S2CRequestCreateUpload): Promise<FilePartInfo> {
        const response = await axios.request({
            baseURL: PhigrosSave.UPLOAD_BASE_URL,
            url: `/${Buffer.from(token.key).toString('base64')}/uploads/${begin.uploadId}/${part}`,
            method: "PUT",

            headers: {
                "Content-Type": "application/octet-stream",
                "Authorization": `UpToken ${token.token}`
            },
            data: data,
            responseType: 'text'

        })

        if (response.status !== 200) {
            throw new APIError(`API Request failed! This library may outdated! Expected Status Code: 200, but Recived: ${response.status}, Server Reply: ${response.data}`)
        }

        const body = <S2CRequestUploadPart> JSON.parse(response.data)
        const buffHash = createHash('md5').update(data).digest().toString('hex').toLowerCase()
        if (buffHash !== body.md5.toLowerCase()) {
            throw new APIError(`API Request failed! MD5 mismatch! Expected: ${buffHash}, but Recived: ${body.md5.toLowerCase()}`)
        }

        return { partNumber: part, etag: body.etag }
    }
    
    private async completeUpload(token: S2CRequestCreateFileToken, begin: S2CRequestCreateUpload, parts: FilePartInfo[]) {
        let response = await axios.request({
            baseURL: PhigrosSave.UPLOAD_BASE_URL,
            url: `/${Buffer.from(token.key).toString('base64')}/uploads/${begin.uploadId}`,
            method: "POST",

            headers: {
                "Authorization": `UpToken ${token.token}`,
                "Content-Type": "application/json"
            },

            data: JSON.stringify({
                parts
            })
        })

        if (response.status !== 200) {
            throw new APIError(`API Request failed! This library may outdated! Expected Status Code: 200, but Recived: ${response.status}, Server Reply: ${response.data}`)
        }

        response = await this.httpClient.request({
            url: APIEndpoints.fileCallback,
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            data: JSON.stringify({
                result: true,
                token: Buffer.from(token.key).toString('base64')
            })
        })

        if (response.status !== 200) {
            throw new APIError(`API Request failed! This library may outdated! Expected Status Code: 200, but Recived: ${response.status}, Server Reply: ${response.data}`)
        }
    }

    private async updateSummary(token: S2CRequestCreateFileToken) {
        const requestData = {
            "summary": this._summary?.save().toString('base64'),
            "modifiedAt": {
                "__type": "Date",
                "iso": (new Date()).toISOString()
            },
            "gameFile": {
                "__type": "Pointer",
                "className": "_File",
                "objectId": token.objectId
            },
            "ACL": <any> { },
            "user": {
                "__type": "Pointer",
                "className": "_User",
                "objectId": this.save!.user.objectId
            }
        }

        requestData.ACL[this.save!.user.objectId] = {
            "read": true,
            "write": true
        }

        const response = await this.httpClient.request({
            url: APIEndpoints.save + "/" + this.save?.objectId,
            method: 'PUT',

            headers: {
                "Content-Type": "application/json"
            },

            data: JSON.stringify(requestData)
        })

        if (response.status !== 200) {
            throw new APIError(`API Request failed! This library may outdated! Expected Status Code: 200, but Recived: ${response.status}, Server Reply: ${response.data}`)
        }

        await this.deleteOld()
    }

    private async deleteOld() {
        const response = await this.httpClient.request({
            url: APIEndpoints.files + "/" + this.save?.objectId,
            method: 'DELETE',
        })

        if (response.status !== 200) {
            throw new APIError(`API Request failed! This library may outdated! Expected Status Code: 200, but Recived: ${response.status}, Server Reply: ${response.data}`)
        }
    }

    public async refreshToken() {
        const { data } = await this.httpClient.request({
            url: APIEndpoints.logout(this.save!.user.objectId),
            method: 'PUT'
        })

        const response = JSON.parse(data)

        if (!response.sessionToken) {
            throw new APIError(`Server request rejected! Server Reply: code${response.code}, error=${response.error}`)
        }

        return response.sessionToken
    }
}

export class APIError extends Error { }