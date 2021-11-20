const DISCORD = require("discord.js");
const config = require("../../private/config.json");
const dbFunctions = require("../database/dbFunctions");

const configDb = "botConfig";

function findCmd(bot, tergetCmd) {
    let flag = false;
    let result;

    if (bot.commandList.has(tergetCmd)) {
        flag = true;
        result = bot.commandList.get(tergetCmd);
    } else if (bot.aliasList.has(tergetCmd)) {
        // const rootCmd = bot.commandList.get(bot.aliasList.get(tergetCmd));
        flag = true;
        result = bot.commandList.get(bot.aliasList.get(tergetCmd));
        // console.log(rootCmd.execute());
    } else {
        result = "Command not found!";
    }
    return {
        flag,
        result,
    };
}
function isValidChannel(currentChannelId) {
    const isDev = dbFunctions.getDb(configDb, "dev") || config.dev;
    if (isDev) {
        return true;
    }
    const dbChannel = dbFunctions.getDb(configDb, "allowedchannel");
    const result = dbChannel || config.allowedchannel;
    // console.log(` result = ${result}`);
    if (result && result.includes(currentChannelId)) {
        return true;
    }
    return false;
}
function isBotOwner(id) {
    const onwerId = dbFunctions.getDb(configDb, "botOwner") || config.botOwner;
    return id === onwerId;
}
function isValidRoles(roleIds) {
    const dbRoles = dbFunctions.getDb(configDb, "botMaster");
    const isDev = dbFunctions.getDb(configDb, "dev") || config.dev;
    if (isDev) {
        return true;
    }
    const configRoles = config.botMaster;
    const sU = dbRoles || configRoles;
    if (sU) {
        for (let k = 0; k < sU.length; k += 1) {
            if (roleIds.has(sU[k])) {
                return true;
            }
        }
    }
    return false;
}
function shouldExecuteCommand(message) {
    if (isBotOwner(message.author.id)) {
        return true;
    }
    const memberRolesIds = message.member.roles.cache;
    const currentChannelId = message.channel.id;
    if (!isValidChannel(currentChannelId) && !isValidRoles(memberRolesIds)) {
        return false;
    }
    return true;
}
function errorEmbedTemplate(options) {
    const result = new DISCORD.MessageEmbed()
        .setTitle(options.title || "Error")
        .setDescription(options.description || "\u200b")
        .setColor("RED")
        .setTimestamp();
    if (options.fields) {
        options.fields.forEach((sf) => {
            result.addField(sf.title, sf.description);
        });
    }

    return result;
}
module.exports = {
    findCmd,
    isValidChannel,
    isValidRoles,
    shouldExecuteCommand,
    isBotOwner,
    errorEmbedTemplate,
};
