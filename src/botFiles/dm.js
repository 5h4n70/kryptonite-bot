const { Message, Client, MessageEmbed, MessageAttachment } = require("discord.js");
// const { mailBox, serverId } = require("../../private/config.json");
const config = require("../../private/config.json");
const dbFunctions = require("../database/dbFunctions");

const configDb = "botConfig";
function findMailBoxChannel(bot = new Client()) {
    const serverId = dbFunctions.getDb(configDb, "serverId") || config.serverId;
    const targetChannel = dbFunctions.getDb(configDb, "mailBox") || config.mailBox;
    // console.log(dbFunctions.getDb(positionListTable, `${processId}.channel`));
    if (targetChannel && serverId) {
        const server = bot.guilds.cache.get(serverId);
        const findChannel = server.channels.cache.get(targetChannel);
        if (findChannel) {
            return findChannel;
        }
    }
    return false;
}
module.exports = async (msg = new Message(), bot = new Client()) => {
    const targetChannel = findMailBoxChannel(bot);
    const listOfLinks = [];
    if (targetChannel) {
        const mess = new MessageEmbed()
            .setTitle(`Message from ${msg.author.tag}`)
            .setDescription(`Message :\n${msg.content || "no Message"}`)
            .addField("Live mention : ", `<@${msg.author.id}>`)
            .setColor("RANDOM")
            .setFooter(
                `${msg.author.tag}`,
                `${msg.author.displayAvatarURL({ format: "png", size: 32 })}`
            )
            .setTimestamp();
        // targetChannel.send({
        //     content: `Live Mention : <@${msg.author.id}>`,
        // });
        if (msg.attachments.size) {
            msg.attachments.forEach((file) => {
                listOfLinks.push(new MessageAttachment(file.url));
            });
            targetChannel.send({
                embeds: [mess],
                files: listOfLinks,
            });
        } else {
            targetChannel.send({
                embeds: [mess],
            });
        }
    }
};
