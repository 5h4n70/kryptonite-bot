/* eslint-disable quotes */
/* eslint-disable comma-dangle */
const DISCORD = require("discord.js");
const config = require("../../../private/config.json");

module.exports = {
    name: "apply",
    description: "show bot's ping.",
    usages: "ping\nuptime",
    type: 0,
    aliases: [],
    async execute(bot = new DISCORD.Client(), message, options) {
        if (options.cmd === this.name) {
            const go = bot.utilityFunctions.shouldExecuteCommand(message);
            // memberRolesIds.has();
            if (!go) return message.react("❌");

            const pd = bot.utilityFunctions
                .errorEmbedTemplate({
                    description:
                        'If You can\'t DM me  ,Make sure you have turned On "Allow direct messages from server members" option from Privacy Settings.',
                    title: "This command available only in DM",
                })
                .setImage(
                    "https://media.giphy.com/media/0ZykXvDhLmyVlCZTzU/giphy.gif?cid=790b7611f7d8ac58505e485610bc058a87713ff994468da9&rid=giphy.gif"
                );

            message.channel.send({
                embeds: [pd],
            });
        }
    },
};
