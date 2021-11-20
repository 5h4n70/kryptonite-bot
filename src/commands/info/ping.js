/* eslint-disable comma-dangle */
const { MessageEmbed } = require("discord.js");

function getUptime(client) {
    let totalSeconds = client.uptime / 1000;
    const days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    return ` ${days} days   ${hours} hours   ${minutes} minutes . `;
}

module.exports = {
    name: "ping",
    description: "show bot's ping.",
    usages: "ping\nuptime",
    type: 1,
    aliases: ["uptime"],
    async execute(bot, message, options) {
        if (options.cmd === "ping" || options.cmd === "uptime") {
            if (options.cmd === "ping") {
                const go = bot.utilityFunctions.shouldExecuteCommand(message);
                // memberRolesIds.has();
                if (!go) return message.react("❌");

                const upTime = getUptime(bot);
                const msg = await message.channel.send("Pinging.....");
                const embed = new MessageEmbed()
                    .setTitle("Latency and Ping")
                    .setColor("RANDOM")
                    .addField("Uptime", upTime)
                    .setDescription(
                        `Pong!!\n Latency is ${Math.floor(
                            msg.createdTimestamp - message.createdTimestamp
                        )}ms\nAPI Ping ${Math.round(bot.ws.ping)}ms`
                    );
                message.channel.send({
                    embeds: [embed],
                    content: "\u200b",
                });
                msg.delete();
            } else {
                const upTime = getUptime(bot);
                const embed = new MessageEmbed().setColor("RANDOM").addField("Uptime", upTime);
                message.channel.send({
                    embeds: [embed],
                    content: "\u200b",
                });
            }
        }
    },
};
