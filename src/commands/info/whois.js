/* eslint-disable operator-linebreak */
const { MessageEmbed, Message } = require("discord.js");
const prettyMs = require("pretty-ms");

module.exports = {
    name: "whois",
    description: "Get your/a User info.",
    usages: "whois @user \nwhois",
    type: 1,
    aliases: ["userinfo"],
    async execute(bot, message = new Message(), options) {
        if (options.cmd) {
            const go = bot.utilityFunctions.shouldExecuteCommand(message);
            // memberRolesIds.has();
            if (!go) return message.react("❌");
            let user = message.member;
            if (message.mentions.members.size) {
                user = message.mentions.members.first();
            }

            const accountAge = prettyMs(user.user.createdTimestamp - message.createdTimestamp, {
                verbose: true,
                unitCount: 4,
            })
                .split("-")
                .join(" ");
            const serverAge = prettyMs(user.joinedTimestamp - message.createdTimestamp, {
                verbose: true,
                unitCount: 4,
            })
                .split("-")
                .join(" ");
            const rolesHave =
                user.roles.cache
                    .filter((r) => r.id !== message.guild.id)
                    .map((r) => r)
                    .join(",") || "none";
            const finalResult = new MessageEmbed()
                .setTitle(`Informations about : ${user.user.tag}`)
                .setColor("GREEN")
                .addField("User ID", user.user.id.toString(), true)
                .addField("Account Created At", user.user.createdAt.toString(), true)
                .addField("Account Age", accountAge, true)
                .addField("Join in this Server at : ", `${message.member.joinedAt}`, true)
                .addField("Server Age ", `${serverAge}`, true)
                .addField("Roles ", rolesHave, true)
                .setFooter(`${message.author.tag}`, `${message.author.displayAvatarURL()}`)
                .setTimestamp();
            message.channel.send({
                embeds: [finalResult],
            });
        }
    },
};
