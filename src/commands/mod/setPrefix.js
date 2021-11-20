/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable comma-dangle */
const bt = "```";
const { MessageEmbed, Client, Message } = require("discord.js");
const db = require("../../database/dbFunctions");
const config = require("../../../private/config.json");

function randomError(title, dt1, dt2, color, descrtion, user) {
    // console.log(user.tag);
    return new MessageEmbed()
        .setTimestamp()
        .setFooter(`${user.tag}`, `${user.displayAvatarURL()}`)
        .setTitle(title || "\u200b")
        .setColor(color.toString().toUpperCase() || "RANDOM")
        .setDescription(descrtion || "\u200b")
        .addField(dt1.toString() || "\u200b", dt2.toString() || "\u200b");
}
module.exports = {
    name: "set-prefix",
    description: "set Bot's prefix.",
    usages: "set-prefix your_prefix\nsp *",
    type: 1,
    aliases: ["sp"],
    async execute(bot = new Client(), message = new Message(), options) {
        if (message.member.permissions.has("ADMINISTRATO")) {
            if (options.cmd === "sp") {
                const oldPrefix = db.getDb("botConfig", "prefix") || config.globalPrefix;
                if (options.args.length === 1 && options.args[0].length === 1) {
                    const res = db.setDb("botConfig", "prefix", options.args[0]);
                    if (res) {
                        // bot.config.sweep((i) => i === oldPrefix);
                        bot.config.set("prefix", options.args[0]);
                        message.reply({
                            embeds: [
                                randomError(
                                    "Success",
                                    `current Prefix :${bt} ${res}${bt}`,
                                    `Old Prefix : ${bt}${oldPrefix}${bt}`,
                                    "GREEN",
                                    "Bot Prefix has been changed!",
                                    message.author
                                ),
                            ],
                        });
                    } else {
                        message.reply({
                            embeds: [
                                randomError(
                                    "Failded",
                                    `current Prefix :${oldPrefix}`,
                                    "\u200b",
                                    "RED",
                                    `Failed to change prefix,use correct command format \n${bt}${oldPrefix}${options.cmd}<new prefix>${bt}`,
                                    message.author
                                ),
                            ],
                        });
                    }
                } else {
                    message.reply({
                        embeds: [
                            randomError(
                                "Failded",
                                `current Prefix :${oldPrefix}`,
                                "\u200b",
                                "RED",
                                `Failed to change prefix,use correct command format \n${bt}${oldPrefix}${options.cmd}<new prefix>${bt}`,
                                message.author
                            ),
                        ],
                    });
                }
            }
        }
    },
};
