import test from 'ava'
import fs from 'fs'
import path from 'path'
import { PhigrosSave } from '..'

const testSave = fs.readFileSync(path.join(__dirname, 'data/TestSaveEncryptedZIP'))

const settingsValidationExpected = "_chordSupport,true;_fcAPIndicator,true;_enableHitSound,false;_lowResolutionMode,false;_deviceName,<unknown>;_brightness,0.47580039501190186;_musicVolume,1;_effectVolume,1;_hitsoundVolume,1;_soundOffset,0;_noteScale,1.2999999523162842;"
const gameProgressValidationExpected = "_isFirstRun,true;_legacyChapterFinished,true;_alreadyShowCollectionTip,true;_alreadyShowAutoUnlockINTip,true;_completed,3.0;_songUpdateInfo,4;_challengeModeRank,0;_money,[452,51,2,2,2];_unlockFlagOfSpasmodic,0;_unlockFlagOfIgallta,0;_unlockFlagOfRrharil,7;_flagOfSongRecordKey,63;_randomVersionUnlocked,0;_chapter8UnlockBegin,true;_chapter8UnlockSecondPhase,false;_chapter8Passed,false;_chapter8SongUnlocked,0;"
const gameRecordValidationExpected = '_records,[{"songName":"Glaciaxion.SunsetRay.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"EradicationCatastrophe.NceS.0","records":{"levelExsistanceFlag":6,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},{"score":100000000,"accuracy":100},null]}},{"songName":"Dlyrotz.Likey.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"光.姜米條.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"Wintercube.CtymaxfeatNceS.0","records":{"levelExsistanceFlag":1,"fcFlag":0,"levelRecords":[{"score":100000000,"accuracy":100},null,null,null]}},{"songName":"Cipher20.TetrajectoryfeatCtymax.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"FULiAUTOSHOOTER.MYUKKE.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"HumaN.SOTUI.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"PRAW.Bluewind.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"PixelRebelz.Normal1zer.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"Cereris.SunsetRayNceS.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"NonMelodicRagezMUGEdit.Normal1zer.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"SultanRage.MonstDeath.0","records":{"levelExsistanceFlag":6,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},{"score":100000000,"accuracy":100},null]}},{"songName":"ClassMemories.AntistarfeatCtymax.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"SURREALISM.Itsuki.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"BonusTime.MegaloPaleWhite.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"ENERGYSYNERGYMATRIX.Tanchiky.0","records":{"levelExsistanceFlag":3,"fcFlag":0,"levelRecords":[{"score":100000000,"accuracy":100},{"score":100000000,"accuracy":100},null,null]}},{"songName":"NYA.FLuoRiTe姜米條.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"JunXionBetweenLifeAndDeathVIPMix.1N6Fs.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"cryout.JuE.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"Reimei.影虎.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"尊師TheGuru.rider.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"Spasmodic.姜米條颶風元力上人.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"LeaveAllBehind.rider.0","records":{"levelExsistanceFlag":2,"fcFlag":2,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"ColorfulDays.P4koofeatつゆり花鈴.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"microwav.dandeless.0","records":{"levelExsistanceFlag":2,"fcFlag":2,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"重生.姜米條.0","records":{"levelExsistanceFlag":6,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},{"score":100000000,"accuracy":100},null]}},{"songName":"NOONEYESMAN.MYUKKE.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"望影の方舟Six.SeURa.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"Igallta.SeURa.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"ClockParadox.WyvernP.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"Chronologika.Hundotte.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"NickofTime.P4koo.0","records":{"levelExsistanceFlag":2,"fcFlag":2,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"Chronomia.Lime.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"ChronosCollapseLaCampanella.SunsetRay.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"Rrharil.TeamGrimoire.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"CraveWave.LandRoot.0","records":{"levelExsistanceFlag":2,"fcFlag":2,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"TheChariotREVIIVAL.Attoclef.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"Luminescence.米虾Fomiki初云CLoudie.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"Retribution.nmyKryexe.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"DESTRUCTION321.Normal1zervsBrokenNerdz.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"DistortedFate.Sakuzyo.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"もぺもぺ.LeaF.0","records":{"levelExsistanceFlag":2,"fcFlag":2,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}},{"songName":"狂喜蘭舞.LeaF.0","records":{"levelExsistanceFlag":3,"fcFlag":0,"levelRecords":[{"score":100000000,"accuracy":100},{"score":100000000,"accuracy":100},null,null]}},{"songName":"SpeedUp.DarTokki.0","records":{"levelExsistanceFlag":6,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},{"score":100000000,"accuracy":100},null]}},{"songName":"SATELLITE.かめりあ.0","records":{"levelExsistanceFlag":2,"fcFlag":0,"levelRecords":[null,{"score":100000000,"accuracy":100},null,null]}}];'
const gameKeyValidationExpected = '_keys,[{"songName":"ぱぴぷぴぷぴぱ","valueFlags":2,"values":[2,1,null,null]},{"songName":"The Mountain Eater","valueFlags":2,"values":[2,1,null,null]},{"songName":"Speed Up!","valueFlags":3,"values":[10,1,1,null]},{"songName":"狂喜蘭舞","valueFlags":2,"values":[2,1,null,null]},{"songName":"dB doll","valueFlags":2,"values":[2,1,null,null]},{"songName":"もぺもぺ","valueFlags":2,"values":[2,1,null,null]},{"songName":"shijian0","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijian1","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijian2","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijian3","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijian4","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijian5","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijian6","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijian7","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijian8","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijian9","valueFlags":3,"values":[5,1,1,null]},{"songName":"alpa","valueFlags":3,"values":[5,1,1,null]},{"songName":"Yshanfeng","valueFlags":3,"values":[5,1,1,null]},{"songName":"trophon","valueFlags":3,"values":[5,1,1,null]},{"songName":"Yhuangying","valueFlags":3,"values":[5,1,1,null]},{"songName":"electicgun","valueFlags":3,"values":[5,1,1,null]},{"songName":"hairtheo","valueFlags":3,"values":[5,1,1,null]},{"songName":"mope3","valueFlags":3,"values":[5,1,1,null]},{"songName":"bulletboom","valueFlags":2,"values":[4,1,null,null]},{"songName":"shijian10","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijian11","valueFlags":3,"values":[5,1,1,null]},{"songName":"chongsheng","valueFlags":3,"values":[5,1,1,null]},{"songName":"poyiARK","valueFlags":3,"values":[5,1,1,null]},{"songName":"poyiIG","valueFlags":3,"values":[5,1,1,null]},{"songName":"clockparadox","valueFlags":3,"values":[5,1,1,null]},{"songName":"93Align","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijian12","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijian13","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijian14","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijian15","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijian16","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijian17","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijian18","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijian19","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijian20","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijian21","valueFlags":3,"values":[5,1,1,null]},{"songName":"uraometeStage","valueFlags":3,"values":[5,1,1,null]},{"songName":"mimao","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijian22","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijian23","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijian24","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijian25","valueFlags":3,"values":[5,1,1,null]},{"songName":"Spasmodic","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijian26","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijian27","valueFlags":3,"values":[5,1,1,null]},{"songName":"yaoxiang","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijianbaima","valueFlags":3,"values":[5,1,1,null]},{"songName":"shijianjueze","valueFlags":3,"values":[5,1,1,null]},{"songName":"lvchuanbaomu","valueFlags":3,"values":[5,6,6,null]},{"songName":"cronosgugu","valueFlags":3,"values":[5,1,1,null]},{"songName":"[PRAW]","valueFlags":2,"values":[8,1,null,null]},{"songName":"Eradication Catastrophe","valueFlags":2,"values":[16,1,null,null]},{"songName":"Introduction","valueFlags":2,"values":[16,1,null,null]}];_lanotaReadKeys,0;_camelliaReadKey,false;'
const userValidationExpected = '_showPlayerID,true;_description,Who the f**k I am?;_avatar,;_background,Introduction;'

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

test("Read settings", async (t) => {
    const save = new PhigrosSave(testSave)
    t.deepEqual(buildValidationString(save.settings), settingsValidationExpected)
})

test("Read gameProgress", async (t) => {
    const save = new PhigrosSave(testSave)
    t.deepEqual(buildValidationString(save.gameProgress), gameProgressValidationExpected)
})

test("Read gameRecord", async (t) => {
    const save = new PhigrosSave(testSave)
    t.deepEqual(buildValidationString(save.gameRecord), gameRecordValidationExpected)
})


test("Read gameKey", async (t) => {
    const save = new PhigrosSave(testSave)
    t.deepEqual(buildValidationString(save.gameKey), gameKeyValidationExpected)
})

test("Read user", async (t) => {
    const save = new PhigrosSave(testSave)
    t.deepEqual(buildValidationString(save.user), userValidationExpected)
})


test("Re-create save file", async (t) => {
    const oldSave = new PhigrosSave(testSave)
    const save = new PhigrosSave(oldSave.createSave())

    t.deepEqual(buildValidationString(save.settings), settingsValidationExpected)
    t.deepEqual(buildValidationString(save.gameProgress), gameProgressValidationExpected)
    t.deepEqual(buildValidationString(save.gameRecord), gameRecordValidationExpected)
    t.deepEqual(buildValidationString(save.gameKey), gameKeyValidationExpected)
    t.deepEqual(buildValidationString(save.user), userValidationExpected)
})