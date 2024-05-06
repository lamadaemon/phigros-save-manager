#!/usr/bin/env node

import { program } from "commander";
import { PhigrosSaveManager } from ".";
import fs from 'fs'
import AdmZip from "adm-zip";
import { PhigrosCloudServiceAPI } from "./src/cloud/api";

program
    .name("Phigros save manager CLI")
    .description("Manage your cloud game save through command line")
    .version("1.0")

program.command("re8")
    .argument("<SessionToken>", "Your session token")
    .description("Reset chapter 8")
    .action(async (token) => {
        console.log("The script is now Loading cloud save and trying to reset chapter 8...")
        const service = await new PhigrosCloudServiceAPI(token).selectProfile(() => true)
        const newSave = (await service.getPlayerSave()).re8().createSave()
        
        await service.uploadSave(newSave)

        console.log("OK, chapter 8 is now reset")
    })  

program.command("pr8")
    .argument("<SessionToken>", "Your session token")
    .description("Reset half of chapter 8")
    .action(async (token) => {
        console.log("The script is now Loading cloud save and trying to reset half of chapter 8...")

        const service = await new PhigrosCloudServiceAPI(token).selectProfile(() => true)
        const newSave = (await service.getPlayerSave()).partialRe8().createSave()
        
        await service.uploadSave(newSave)

        console.log("OK, half of chapter 8 is now unlocked")
    })

program.command("rere8")
    .argument("<SessionToken>", "Your session token")
    .description("Unlock all songs in chapter 8")
    .action(async (token) => {
        console.log("The script is now loading cloud save and trying to unlock chapter 8...")

        const service = await new PhigrosCloudServiceAPI(token).selectProfile(() => true)
        const newSave = (await service.getPlayerSave()).rere8().createSave()
        
        await service.uploadSave(newSave)

        console.log("OK, chapter 8 is now unlocked")
    })

program.command("backup")
    .argument("<SessionToken>", "Your session token")
    .description("Backup your save file")
    .action(async (token) => {
        console.log("The script is now creating a backup...")
        const service = await new PhigrosCloudServiceAPI(token).selectProfile(() => true)
        const save = (await service.getPlayerSave())

        fs.writeFileSync(`${service.profile!.name}-${Date.now()}.save`, save.createSave())

        console.log(`OK, a backup is created and saved to ${service.profile!.name}-${Date.now()}.save`)
    })

program.command("restore")
    .argument("<SessionToken>", "Your session token")
    .argument("<SaveFile>", "The save file to restore")
    .description("Restore your save file")
    .action(async (token, file) => {
        console.log("The script is now restoring a backup...")

        const save = await PhigrosSaveManager.loadLocalSave(fs.readFileSync(file))
        const service = await new PhigrosCloudServiceAPI(token).selectProfile(() => true)

        await service.uploadSave(save.createSave())

        console.log(`OK, the backup is restored`)
    })    

program.command("refresh")
    .argument("<SessionToken>", "Your session token")
    .description("Refresh your session token. The old token takes a week to expire.")
    .action(async (token) => {
        console.log("Refreshing session token...")

        const newToken = await PhigrosSaveManager.refreshToken(token)

        console.log(`OK, the token ${token} is now no longer valid. Your new token is: ${newToken}`)
    })


program.command("get")
    .argument("<SessionToken|File>", "Your session token or file name if with -f option")
    .option("-f, --file <file>", "Use save file instead of fetching from cloud.")
    .description("Get your personal information")
    .action(async (token, option) => {
        let update: string = 'N/A'
        let id: string = 'N/A'
        let rks: string = 'N/A'

        if (option.file) {
            if (fs.existsSync(option.file)) {
                console.error("File not found!")
                process.exit(1)
            }

            const local = PhigrosSaveManager.loadLocalSave(fs.readFileSync(option.file))

            rks = '' + local.rks()
            update = fs.fstatSync(option.file).mtime.toISOString()
        } else {
            const service = await new PhigrosCloudServiceAPI(token).selectProfile(() => true)
            const save = (await service.getPlayerSave())

            rks = '' + save.rks()
            update = service.profile!.updatedAt
            id = service.profile!.objectId
        }
         
        console.log(`Last update at: ${update}`)
        console.log(`Your ID is    : ${id}`)
        console.log(`RKS           : ${rks}`)
        
    })

program.command("decrypt")
    .argument("<SessionToken>", "Your session token")
    .argument("[SaveFile]", "Save destination file")
    .option("-o, --output <file>", "Output file")
    .option("-q, --quiet", "Quiet mode")
    .description("Decrypt a encrypted save file")
    .action(async (token, file, option) => {
        if (option.quiet) {
            console['log'] = () => void 0
        }

        console.log("Now trying to decrypt save...")

        const save = file ? fs.readFileSync(file) : await PhigrosSaveManager.downloadSave(token)
        const zip = new AdmZip(save)
        const decryptedZip = new AdmZip()

        for (const entry of zip.getEntries()) {
            const buff = entry.getData()
            const decrypted = await PhigrosSaveManager.decrypt(buff)
            
            decryptedZip.addFile(entry.entryName, decrypted)
        }

        fs.writeFileSync(option.output ?? "decrypted.zip", decryptedZip.toBuffer())

    })

program.command("allphi")
    .argument("<SessionToken>", "Your session token")
    .action(async (token) => {
        const service = await new PhigrosCloudServiceAPI(token).selectProfile(() => true)
        const save = (await service.getPlayerSave())
        
        for (const i of save.gameRecord.records) {
            for (const j of i.records.levelRecords) {
                if (!j) {
                    continue
                }
                j.accuracy = 100
                j.score = 1000000
            }
        }

        await service.uploadSave(save.createSave())
    })


program.parse()