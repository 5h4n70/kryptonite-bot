/* eslint-disable comma-dangle */
const { MessageEmbed, Message, User } = require("discord.js");

function errorDm() {
    return new MessageEmbed()
        .setDescription("use the command in right way!")
        .addField("-kick <mention a user>", "\u200b")
        .setTitle("error!")
        .setColor("RED")
        .setTimestamp();
}
function kicked(member = new Message().member) {
    return (
        new MessageEmbed()
            .setTitle("Member Kicked")
            // .setDescription("Can't kick him 😢")
            .addField("Name", `${member.user.tag}`)
            .addField("ID", `${member.user.id}`)
            .setColor("GREEN")
            .setTimestamp()
    );
}

function errorDmCatch() {
    return new MessageEmbed()
        .setDescription("Can't kick him 😢")
        .addField("Reason:", "I actually love him! 😐 ")
        .setTitle("error!")
        .setColor("RED")
        .setTimestamp();
}
module.exports = {
    name: "kick",
    description: "kick a member.",
    usages: "kick @user\nbye @user",
    type: 1,
    aliases: ["bye"],
    async execute(bot, message = new Message(), options) {
        if (options.cmd === "kick") {
            const go = bot.utilityFunctions.isValidRoles(message.member.roles.cache);
            // memberRolesIds.has();
            if (!go) return message.react("❌");
            const mentionedMember = message.mentions.members;
            if (mentionedMember.size) {
                mentionedMember.forEach((member) => {
                    if (member.kickable) {
                        member
                            .kick()
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
