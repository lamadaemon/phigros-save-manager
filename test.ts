import { PhigrosSaveManager } from ".";
import fs from 'fs'

;(async () => {
    const save = await PhigrosSaveManager.loadLocalSave("70wbtzglz3iwzacm7punekfux", fs.readFileSync("save-1699337500638.save"))
    const newSaveBin = await save.createSave()
    const newSave = await PhigrosSaveManager.loadLocalSave("70wbtzglz3iwzacm7punekfux", newSaveBin)

    if (newSave.rks() == save.rks()) {
        console.log("ok")
    } else {
        console.log("not ok, new: " + newSave.rks() + ", old: " + save.rks())
    }
})()


