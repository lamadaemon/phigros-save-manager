import { program } from "commander";
import { PhigrosSaveManager } from ".";

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

program.parse()