import test from 'ava'
import fs from 'fs'
import path from 'path'
import { PhigrosSave } from '..'

function buildValidationString(obj: any): string {
    let validation = ''

    for (const i in obj) {
        if (!i.startsWith('_')) continue

        let value = (obj as any)[i].value
        if (typeof value === 'object') {
            value = JSON.stringify(value)
        }

        validation += i + "," + value + ";"
    }

    return validation
}

const testSave = fs.readFileSync(path.join(__dirname, 'data/TestSaveEncryptedZIP'))
const moneyEditedExpected = "_isFirstRun,true;_legacyChapterFinished,true;_alreadyShowCollectionTip,true;_alreadyShowAutoUnlockINTip,true;_completed,3.0;_songUpdateInfo,4;_challengeModeRank,0;_money,[0,981,191,514,114];_unlockFlagOfSpasmodic,0;_unlockFlagOfIgallta,0;_unlockFlagOfRrharil,7;_flagOfSongRecordKey,63;_randomVersionUnlocked,0;_chapter8UnlockBegin,true;_chapter8UnlockSecondPhase,false;_chapter8Passed,false;_chapter8SongUnlocked,0;"

test("Money editing by Expression", async (t) => {
    const save = new PhigrosSave(testSave)

    save.gameProgress.editMoney("114PB514TB191GB981MB0KB")

    t.deepEqual(save.gameProgress.money, [0, 981, 191, 514, 114])
    t.deepEqual(buildValidationString(save.gameProgress), moneyEditedExpected)
})

test("RKS Calculation", async (t) => {
    const save = new PhigrosSave(testSave)
    
    t.deepEqual(save.rks(), 12.645)
})