/* eslint-disable comma-dangle */
const text = "this is ping file";
const { MessageEmbed } = require("discord.js");

function errorDm() {
    return new MessageEmbed()
        .setDescription("use the command in right way!")
        .addField("-dm <mention a user> <your message>", "\u200b")
        .setTitle("error!")
        .setColor("RED")
        .setTimestamp();
}

function errorDmCatch() {
    return new MessageEmbed()
        .setDescription("Can't Dm him 😢")
        .addField("Reason:", "User May be turned of Receiving DM from this server 😐 ")
        .setTitle("error!")
        .setColor("RED")
        .setTimestamp();
}
module.exports = {
    name: "dm",
    description: "Dm a server member through the bot.",
    usages: "dm @user , adm #user",
    type: 1,
    aliases: ["adm"],
    async execute(bot, message, options) {
        if (options.cmd === "dm" || options.cmd === "adm") {
            const go = bot.utilityFunctions.isValidRoles(message.member.roles.cache);
            // memberRolesIds.has();
            if (!go) {
                return message.reply("You don't have enough permission to run this command!😅");
            }
            const mentionedCount = message.mentions.members;
            const { args } = options;
            if (mentionedCount.size) {
                const cut = args[0].slice(3, args[0].length - 1);
                if (!cut.length) {
                    message.reply({
                        embeds: [errorDm()],
                    });
                } else {
                    const member = await message.guild.members.cache.get(cut);
                    if (member) {
                        const msgAr = `${args.slice(1, args.length).join(" ")}\u200b`;
                        member
                            .send(msgAr)
                            // .then((msg) => message.delete())
                            .catch((er) => {
                                message.reply({
                                    embeds: [errorDmCatch()],
                                });
                            });
                    } else {
                        message.reply({
                            embeds: [errorDm()],
                        });
                    }
                }
            } else {
                message.reply({
                    embeds: [errorDm()],
                });
            }
            // if (options.cmd === "adm") {
            //     message.delete();
            // }
        }
    },
};
