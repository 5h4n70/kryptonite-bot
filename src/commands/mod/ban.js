/* eslint-disable comma-dangle */
const { MessageEmbed, Message, User } = require("discord.js");

function errorDm() {
    return new MessageEmbed()
        .setDescription("use the command in right way!")
        .addField("-ban <mention a user>", "\u200b")
        .setTitle("error!")
        .setColor("RED")
        .setTimestamp();
}
function kicked(member = new Message().member) {
    return (
        new MessageEmbed()
            .setTitle("Member banned")
            // .setDescription("Can't kick him 😢")
            .addField("Name", `${member.user.tag}`)
            .addField("ID", `${member.user.id}`)
            .setColor("GREEN")
            .setTimestamp()
    );
}

function errorDmCatch() {
    return new MessageEmbed()
        .setDescription("Can't ban him 😢")
        .addField("Reason:", "I actually love him! 😐 ")
        .setTitle("error!")
        .setColor("RED")
        .setTimestamp();
}
module.exports = {
    name: "ban",
    description: "Ban a user.",
    usages: "ban @user.\nrip @user",
    type: 1,
    aliases: ["rip"],
    async execute(bot, message = new Message(), options) {
        if (options.cmd === "ban") {
            const go = bot.utilityFunctions.isValidRoles(message.member.roles.cache);
            // memberRolesIds.has();
            if (!go) return message.react("❌");
            const mentionedMember = message.mentions.members;
            if (mentionedMember.size) {
                mentionedMember.forEach((member) => {
                    if (member.bannable) {
                        member
                            .ban()
                            .then((er) => {
                                message.channel.send({
                                    embeds: [
                                        kicked(member).setFooter(
                                            `${message.author.tag}`,
                                            `${message.author.displayAvatarURL()}`
                                        ),
                                    ],
                                    content: "\u200b",
                                });
                            })
                            .catch((er) => {
                                message.channel.send({
                                    embeds: [
                                        errorDmCatch().setFooter(
                                            `${message.author.tag}`,
                                            `${message.author.displayAvatarURL()}`
                                        ),
                                    ],
                                    content: "\u200b",
                                });
                            });
                    } else {
                        message.channel.send({
                            embeds: [
                                errorDmCatch().setFooter(
                                    `${message.author.tag}`,
                                    `${message.author.displayAvatarURL()}`
                                ),
                            ],
                            content: "\u200b",
                        });
                    }
                });
            } else {
                message.channel.send({
                    embeds: [errorDm()],
                    content: "\u200b",
                });
            }
        }
    },
};
