// Make sure to change import path to "phigros-save-manager"
import { PhigrosCloudServiceAPI } from "../src/cloud/api";


export async function downloadSave(token: string): Promise<Buffer> {
    const service = await new PhigrosCloudServiceAPI(token)
        .selectFirstProfile()

    return await service.getPlayerSaveBytes()
}

