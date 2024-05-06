import { PhigrosCloudServiceAPI } from "./src/cloud/api"
import { PhigrosSave } from "./src/save"

export * from './src/cloud/summary'
export * from './src/cloud/profile'
export * from './src/cloud/requests'
export * from './src/cloud/api'

export * from './src/types/key'
export * from './src/types/progress'
export * from './src/types/record'
export * from './src/types/settings'
export * from './src/types/user'
export * from './src/phi-binary'
export * from "./src/save"

export namespace PhigrosSaveManager {
    export async function loadCloudSave(token: string) {
        const service = await new PhigrosCloudServiceAPI(token).selectProfile(() => true)
        
        return await service.getPlayerSave()
    }

    export function loadLocalSave(save: Buffer): PhigrosSave {
        return new PhigrosSave(save)
    }

    export async function downloadSave(token: string): Promise<Buffer> {
        const service = await new PhigrosCloudServiceAPI(token)
        .selectProfile(() => true)

        return await service.getPlayerSaveBytes()
    }

    export async function refreshToken(token: string) {
        const service = await new PhigrosCloudServiceAPI(token).selectProfile(() => true)

        return await service.refreshToken()
    }

    export async function decrypt(buff: Buffer, type?: string) {
        return PhigrosSave.decryptProfile(buff, type)
    }

    export async function encrypt(buff: Buffer, type: string) {
        return PhigrosSave.encryptProfile(buff, type)
    }
}
