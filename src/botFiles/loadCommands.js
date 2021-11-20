/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable max-len */

// variable diclration 🙂
const path = require("path");
const fs = require("fs");

const commandFolderName = "../commands/";

const commandsPath = path.join(__dirname, commandFolderName);
const subFolderList = fs.readdirSync(commandsPath, {
    withFileTypes: true,
});

let subFolderPath;
let subFolderFiles;
let finalImport;
let cmd;
let alle;
// variable diclaration ended 🚉

module.exports = (bot) => {
    subFolderList.forEach((subFolder, idx) => {
        //
        if (subFolder.isDirectory()) {
            subFolderPath = path.join(commandsPath, subFolder.name);
            subFolderFiles = fs.readdirSync(subFolderPath, {
                withFileTypes: true,
            });

            subFolderFiles.forEach((file) => {
                finalImport = path.join(subFolderPath, file.name);
                // console.log(finalImport);
                if (finalImport.endsWith(".js")) {
                    cmd = require(`${finalImport}`);
                } else cmd = {};
                if (cmd.name) {
                    //
                    // console.log(cmd.name);
                    if (Array.isArray(cmd.name)) {
                        cmd.name.forEach((nm) => bot.commandList.set(nm, cmd));
                    } else {
                        bot.commandList.set(cmd.name, cmd);
                    }
                    if (Array.isArray(cmd.aliases)) {
                        cmd.aliases.forEach((alias) => bot.aliasList.set(alias, cmd.name));
                    }
                } else {
                    console.log(`something wrong in : ${finalImport}`);
                }
            });
        } else {
            console.log("🔴 Not a Sub Folder!");
        }
    });
};
