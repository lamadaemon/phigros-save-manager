import { PhigrosSave } from "./src/save"

export * from './src/types/key'
export * from './src/types/progress'
export * from './src/types/record'
export * from './src/types/settings'
export * from './src/types/summary'
export * from './src/types/user'
export * from './src/phi-binary'

export namespace PhigrosSaveManager {
    export async function loadCloudSave(token: string) {
        const saveManager = new PhigrosSave(token)
        await saveManager.init()
        
        return saveManager
    }

    export async function loadLocalSave(token: string, save: Buffer) {
        const saveManager = new PhigrosSave(token)
        await saveManager.loadSave(save)

        return saveManager
    }

    export async function decrypt(buff: Buffer) {
        return PhigrosSave.decryptProfile(buff)
    }

    export async function encrypt(buff: Buffer, type: string) {
        return PhigrosSave.encryptProfile(buff, type)
    }
}
