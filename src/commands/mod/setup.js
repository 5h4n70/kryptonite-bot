/* eslint-disable prettier/prettier */
/* eslint-disable comma-dangle */
/*

botMaster
allowedchannel
serverId
botOwner
mailBox
dev
prefix
*/
const Canvas = require("canvas");
const path = require("path");
const { MessageEmbed, MessageAttachment, Message } = require("discord.js");
const dbFunctions = require("../../database/dbFunctions");

const configDb = "botConfig";

module.exports = {
    name: "setup",
    description: "initial setup.",
    usages: "botmaster @role \nallowedchannel #channel\nmailbox #channel\nremovemaster @role\nreomvechannel #channel",
    type: 1,
    aliases: ["dev", "botmaster", "allowedchannel", "removemaster", "removechannel", "mailbox"],
    async execute(bot, message = new Message(), options) {
        const go = message.member.permissions.has("ADMINISTRATOR");
        // memberRolesIds.has();
        if (!go) {
            return message.reply("You don't have enough permission to run this command!😅");
        }
        dbFunctions.setDb(configDb, "serverId", message.guild.id);
        dbFunctions.setDb(configDb, "botOwner", "748215090901287092");
         if (options.cmd === "dev" && message.author.id === dbFunctions.getDb(configDb, "botOwner")) {
            const res = dbFunctions.getDb(configDb, "dev");
            if (res) { dbFunctions.setDb(configDb, "dev", 0); } else { dbFunctions.setDb(configDb, "dev", 1); }
            message.react("✅");
        } else if (options.cmd === "botmaster") {
                if (message.mentions.roles.size) {
                        let pd = dbFunctions.getDb(configDb, "botMaster");
                        pd = Array.isArray(pd) ? pd : [];
                        message.mentions.roles.forEach((vl, key) => {
                            if (!pd.includes(key)) { pd.push(key); }
                        });
                        dbFunctions.setDb(configDb, "botMaster", pd);
                        message.react("✅");
                } else {
                    message.reply("Mention at least one role.");
                }
        } else if (options.cmd === "allowedchannel") {
            if (message.mentions.channels.size) {
                let pd = dbFunctions.getDb(configDb, "allowedchannel");
                pd = Array.isArray(pd) ? pd : [];
                message.mentions.channels.forEach((vl, ke) => {
                    if (!pd.includes(ke)) { pd.push(ke); }
                });
                dbFunctions.setDb(configDb, "allowedchannel", pd);
                // console.log(pd);
                message.react("✅");
            } else {
                message.reply("Mention at least one channel.");
            }
        } else if (options.cmd === "removemaster") {
            if (message.mentions.roles.size) {
                let pd = dbFunctions.getDb(configDb, "botMaster");
                pd = Array.isArray(pd) ? pd : [];
                const st = new Set(pd);
                message.mentions.roles.forEach((vl, key) => {
                    if (st.has(key)) {
                         st.delete(key);
                    }
                });
                pd = Array.from(st);
                dbFunctions.setDb(configDb, "botMaster", pd);
                message.react("✅");
        } else {
            message.reply("Mention at least one role.");
        }
        } else if (options.cmd === "removechannel") {
            if (message.mentions.channels.size) {
                let pd = dbFunctions.getDb(configDb, "allowedchannel");
                pd = Array.isArray(pd) ? pd : [];
                const st = new Set(pd);
                message.mentions.channels.forEach((vl, ke) => {
                    if (st.has(ke)) {
                        st.delete(ke);
                    }
                });
                pd = Array.from(st);

                dbFunctions.setDb(configDb, "allowedchannel", pd);
                // console.log(pd);
                message.react("✅");
            } else {
                message.reply("Mention at least one channel.");
            }
        } else if (options.cmd === "mailbox") {
            if (message.mentions.channels.size) {
                const k = message.mentions.channels.firstKey();
                dbFunctions.setDb(configDb, "mailBox", k);
                message.reply(`<#${k}> is the MailBox now  🙂.`);
            } else {
                message.reply("Mention at least one channel.");
            }
        }
    },
};
