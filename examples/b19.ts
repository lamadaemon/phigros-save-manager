import { PhigrosCloudServiceAPI } from "../src/cloud/api";

async function getB19(token: string): Promise<{ bm: string, diff: number, rks: number }[]> {
    const service = await new PhigrosCloudServiceAPI(token)
        .selectFirstProfile()

    const save = await service.getPlayerSave()
    return save.b19().map(it => { 
        return {
            bm: it.name,
            diff: it.diff,
            rks: it.rks
        }
    })
}