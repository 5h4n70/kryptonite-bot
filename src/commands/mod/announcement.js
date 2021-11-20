/* eslint-disable comma-dangle */
const { MessageEmbed, Message } = require("discord.js");

function errorDm() {
    return new MessageEmbed()
        .setDescription("use the command in right way!")
        .addField("-post <mention a channel> <your message>", "\u200b")
        .setTitle("error!")
        .setColor("RED")
        .setTimestamp();
}
module.exports = {
    name: "announcment",
    description: "To post an announcement in  a specific channel.",
    usages: "announcement #channel your_message.\npost #channel your_message",
    type: 1,
    aliases: ["post"],
    async execute(bot, message = new Message(), options) {
        if (options.cmd === this.name || options.cmd === this.aliases[0]) {
            const go = bot.utilityFunctions.isValidRoles(message.member.roles.cache);
            // memberRolesIds.has();
            if (!go) {
                return message.reply("You don't have  enough  permission to run this command!😅");
            }
            let text = "\u200b";
            const { args } = options;
            let targetChannel = message.channel;
            if (args.length) {
                const channelId = args[0].slice(2, args[0].length - 1);
                if (channelId) {
                    targetChannel = message.guild.channels.cache.get(channelId);
                    if (!targetChannel) {
                        targetChannel = message.channel;
                        text = args.join(" ");
                    } else {
                        message.react("☑️");
                        text = args.slice(1, args.length).join(" ");
                    }
                    targetChannel.send({
                        content: text,
                    });
                } else {
                    targetChannel.send({
                        content: args.join(" "),
                    });
                }
            } else {
                message.channel.send({
                    embeds: [errorDm()],
                });
            }
        }
    },
};
