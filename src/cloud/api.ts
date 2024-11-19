import axios, { Axios } from 'axios'
import { FilePartInfo, S2CRequestCreateFileToken, S2CRequestCreateUpload, S2CRequestUploadPart } from "./requests";
import { createHash } from 'crypto';
import { PlayerProfile, S2CRequestSave } from './profile';
import { GameSaveSummary } from './summary';
import { PhigrosSave } from '../save';


export class PhigrosCloudServiceAPI {
    static readonly URL_UPLOAD = "https://upload.qiniup.com/buckets/rAK3Ffdi/objects"
    static readonly URL_PHIGROS_SERVICE = "https://rak3ffdi.cloud.tds1.tapapis.cn/1.1"
    static readonly ENDPOINT_FILE_TOKENS = "/fileTokens"
    static readonly ENDPOINT_FILE_CALLBACK = "/fileCallback"
    static readonly ENDPOINT_SAVE = "/classes/_GameSave"
    static readonly ENDPOINT_USER_INFO = "/users/me"
    static readonly ENDPOINT_FILES = "/files"

    private httpClient: Axios
    public profile?: PlayerProfile
    private _summary?: GameSaveSummary
    
    constructor(sessionToken: string) {
        this.httpClient = new Axios({
            baseURL: PhigrosCloudServiceAPI.URL_PHIGROS_SERVICE,

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

    get summary() {
        return this._summary
    }

    /**
     * As designed, there may be multiple profiles in the cloud.
     * This function will select the first profile that matches the condition.
     * 
     * You must select one profile before you can do further actions.
     * 
     * @param confition filter function
     * @returns this
     */
    public async selectProfile(confition: (profile: PlayerProfile) => boolean) {
        const saves = await this.readRemoteSaves()
        this.profile = saves.results.find(confition)

        if (!this.profile) {
            throw new APIError("No profile was found!")
        }

        this._summary = new GameSaveSummary(Buffer.from(this.profile.summary, 'base64'))

        return this
    }

    /**
     * As designed, there may be multiple profiles in the cloud.
     * This function will select the first profile.
     * 
     * You must select one profile before you can do further actions.
     * 
     * @returns this
     */
    public async selectFirstProfile() {
        return this.selectProfile(it => true)
    }
    
    /**
     * Upload the save content to remote
     * 
     * **Since the save has been updated! You should re-initialize this class to do further actions!**
     * **Call init function or drop all reference to this instance after you called this function!**
     * @param saveBuffer The save buffer
     */
    async uploadSave(saveBuffer: Buffer) {
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

        fileTokenRequest.ACL[this.profile!.user.objectId] =  {
            "read": true,
            "write": true
        }
        
        const response = await this.httpClient.request({
            url: PhigrosCloudServiceAPI.ENDPOINT_FILE_TOKENS,
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
            baseURL: PhigrosCloudServiceAPI.URL_UPLOAD,
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
            baseURL: PhigrosCloudServiceAPI.URL_UPLOAD,
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
            baseURL: PhigrosCloudServiceAPI.URL_UPLOAD,
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
            url: PhigrosCloudServiceAPI.ENDPOINT_FILE_CALLBACK,
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
                "objectId": this.profile!.user.objectId
            }
        }

        requestData.ACL[this.profile!.user.objectId] = {
            "read": true,
            "write": true
        }

        const response = await this.httpClient.request({
            url: PhigrosCloudServiceAPI.ENDPOINT_SAVE + "/" + this.profile?.objectId,
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
            url: PhigrosCloudServiceAPI.ENDPOINT_FILES + "/" + this.profile?.objectId,
            method: 'DELETE',
        })

        if (response.status !== 200) {
            throw new APIError(`API Request failed! This library may outdated! Expected Status Code: 200, but Recived: ${response.status}, Server Reply: ${response.data}`)
        }
    }

    public async refreshToken(): Promise<string> {
        const { data } = await this.httpClient.request({
            url: `/users/${this.profile!.user.objectId}/refreshSessionToken`,
            method: 'PUT'
        })

        const response = JSON.parse(data)

        if (!response.sessionToken) {
            throw new APIError(`Server request rejected! Server Reply: code${response.code}, error=${response.error}`)
        }

        this.httpClient = new Axios({
            baseURL: PhigrosCloudServiceAPI.URL_PHIGROS_SERVICE,

            headers: {
                "X-LC-Id": "rAK3FfdieFob2Nn8Am",
                "X-LC-Key": "Qr9AEqtuoSVS3zeD6iVbM4ZC0AtkJcQ89tywVyi0",
                "User-Agent": "LeanCloud-CSharp-SDK/1.0.3",
                "Accept": "application/json",
                "X-LC-Session": response.sessionToken
            },

            responseType: 'text'
        })

        return response.sessionToken
    }


    private async readRemoteSaves(): Promise<S2CRequestSave> {
        const response = await this.httpClient.get(PhigrosCloudServiceAPI.ENDPOINT_SAVE)
        const deser = <S2CRequestSave> JSON.parse(response.data)

        if (deser.results.length == 0) {
            throw new APIError("No profiles was found!")
        }

        return deser
    }

    async getPlayerSave(): Promise<PhigrosSave> {
        return new PhigrosSave(await this.getPlayerSaveBytes())
    }

    async getPlayerSaveBytes(): Promise<Buffer> {
        if (!this.profile) {
            throw new APIError("No profile was selected!")
        }

        const { data, status } = await axios.get(this.profile.gameFile.url, {
            responseType: 'arraybuffer'
        })
        
        if (status == 404) {
            throw new APIError("No profile was found! Server returned 404!")
        }

        return Buffer.from(data)
    }
}

export class APIError extends Error { }
