#!/usr/bin/env node

import { program } from "commander";
import { PhigrosSaveManager } from ".";
import fs from 'fs'

program
    .name("Phigros save manager CLI")
    .description("Manage your cloud game save through command line")
    .version("1.0")

program.command("re8")
    .argument("<SessionToken>", "Your session token")
    .action(async (token) => {
        console.log("The script is now Loading cloud save and trying to reset chapter 8...")

        await (await PhigrosSaveManager.loadCloudSave(token)).re8().uploadSave()

        console.log("OK, chapter 8 is now reset")
    })  

program.command("pr8")
    .argument("<SessionToken>", "Your session token")
    .action(async (token) => {
        console.log("The script is now Loading cloud save and trying to reset half of chapter 8...")

        await (await PhigrosSaveManager.loadCloudSave(token)).partialRe8().uploadSave()

        console.log("OK, half of chapter 8 is now unlocked")
    })

program.command("rere8")
    .argument("<SessionToken>", "Your session token")
    .action(async (token) => {
        console.log("The script is now loading cloud save and trying to unlock chapter 8...")

        await (await PhigrosSaveManager.loadCloudSave(token)).partialRe8().uploadSave()

        console.log("OK, chapter 8 is now unlocked")
    })

program.command("backup")
    .argument("<SessionToken>", "Your session token")
    .action(async (token) => {
        console.log("The script is now creating a backup...")

        const save = await PhigrosSaveManager.loadCloudSave(token)
        await save.backup(`${save.profile.name}-${Date.now()}.save`)

        console.log(`OK, a backup is created and saved to ${save.profile.name}-${Date.now()}.save`)
    })

program.command("restore")
    .argument("<SessionToken>", "Your session token")
    .argument("<SaveFile>", "The save file to restore")
    .action(async (token, file) => {
        console.log("The script is now restoring a backup...")

        const save = await PhigrosSaveManager.loadLocalSave(token, fs.readFileSync(file))
        await save.uploadSave()

        console.log(`OK, the backup is restored`)
    })    

program.command("refresh")
    .argument("<SessionToken>", "Your session token")
    .action(async (token) => {
        console.log("Refreshing session token...")

        const save = await PhigrosSaveManager.refreshToken(token)

        console.log(`OK, the token ${token} is now no longer valid. Your new token is: ${save}`)
    })

program.parse()