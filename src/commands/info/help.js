/* eslint-disable comma-dangle */
const path = require("path");
const { MessageEmbed, MessageAttachment, Message } = require("discord.js");

const spc = "```";
module.exports = {
    name: "help",
    description: "To show this help menu",
    type: 0,
    aliases: [],
    async execute(bot, message = new Message(), options) {
        const go = bot.utilityFunctions.shouldExecuteCommand(message);
        if (!go) return message.react("❌");
        const data = bot.commandList;
        const final = [];
        data.forEach((dt) => {
            if (dt.type) {
                final.push({ name: dt.name, description: dt.description, use: dt.usages });
            }
        });
        if (final.length < 20) {
            const bl = false;
            const sendMessage = new MessageEmbed().setTitle("Help Menu").setTimestamp();
            final.forEach((singleCmd) => {
                // bl = singleCmd.description.length > 60;
                sendMessage.addField(
                    `${singleCmd.name}`,
                    `**Description:** ${singleCmd.description}\nUsages:${spc}${singleCmd.use}${spc}`,
                    bl
                );
            });
            message.channel.send({
                embeds: [sendMessage],
            });
        }
    },
};
