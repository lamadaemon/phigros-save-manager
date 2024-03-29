#!/usr/bin/env node

import { program } from "commander";
import { PhigrosSaveManager } from ".";
import fs from 'fs'
import AdmZip from "adm-zip";

program
    .name("Phigros save manager CLI")
    .description("Manage your cloud game save through command line")
    .version("1.0")

program.command("re8")
    .argument("<SessionToken>", "Your session token")
    .description("Reset chapter 8")
    .action(async (token) => {
        console.log("The script is now Loading cloud save and trying to reset chapter 8...")

        await (await PhigrosSaveManager.loadCloudSave(token)).re8().uploadSave()

        console.log("OK, chapter 8 is now reset")
    })  

program.command("pr8")
    .argument("<SessionToken>", "Your session token")
    .description("Reset half of chapter 8")
    .action(async (token) => {
        console.log("The script is now Loading cloud save and trying to reset half of chapter 8...")

        await (await PhigrosSaveManager.loadCloudSave(token)).partialRe8().uploadSave()

        console.log("OK, half of chapter 8 is now unlocked")
    })

program.command("rere8")
    .argument("<SessionToken>", "Your session token")
    .description("Unlock all songs in chapter 8")
    .action(async (token) => {
        console.log("The script is now loading cloud save and trying to unlock chapter 8...")

        await (await PhigrosSaveManager.loadCloudSave(token)).partialRe8().uploadSave()

        console.log("OK, chapter 8 is now unlocked")
    })

program.command("backup")
    .argument("<SessionToken>", "Your session token")
    .description("Backup your save file")
    .action(async (token) => {
        console.log("The script is now creating a backup...")

        const save = await PhigrosSaveManager.loadCloudSave(token)
        await save.backup(`${save.profile.name}-${Date.now()}.save`)

        console.log(`OK, a backup is created and saved to ${save.profile.name}-${Date.now()}.save`)
    })

program.command("restore")
    .argument("<SessionToken>", "Your session token")
    .argument("<SaveFile>", "The save file to restore")
    .description("Restore your save file")
    .action(async (token, file) => {
        console.log("The script is now restoring a backup...")

        const save = await PhigrosSaveManager.loadLocalSave(token, fs.readFileSync(file))
        await save.uploadSave()

        console.log(`OK, the backup is restored`)
    })    

program.command("refresh")
    .argument("<SessionToken>", "Your session token")
    .description("Refresh your session token. The old token takes a week to expire.")
    .action(async (token) => {
        console.log("Refreshing session token...")

        const save = await PhigrosSaveManager.refreshToken(token)

        console.log(`OK, the token ${token} is now no longer valid. Your new token is: ${save}`)
    })


program.command("get")
    .argument("<SessionToken>", "Your session token")
    .description("Get your personal information")
    .action(async (token) => {
        console.log("Fetching profile")

        const save = await PhigrosSaveManager.loadCloudSave(token)
        console.log(`Last update at: ${save.profile.updatedAt}`)
        console.log(`Your ID is    : ${save.profile.user.objectId}`)
        console.log(`RKS           : ${save.rks()}`)
        
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
        const save = await PhigrosSaveManager.loadCloudSave(token)
        for (const i of save.gameRecord.records) {
            for (const j of i.levelRecords) {
                if (!j) {
                    continue
                }
                j.accuracy = 100
                j.score = 100000000
            }
        }

        await save.uploadSave()

    })


program.parse()