// Make sure to change import path to "phigros-save-manager"
import { PhigrosCloudServiceAPI } from "../src/cloud/api";


export async function re8(token: string): Promise<Buffer> {
    const service = await new PhigrosCloudServiceAPI(token)
        .selectFirstProfile()

    const newSave = (await service.getPlayerSave()).re8().createSave()
            
    await service.uploadSave(newSave)
    return await service.getPlayerSaveBytes()
}

