/* eslint-disable comma-dangle */
const { MessageEmbed, Client } = require("discord.js");
const dbFunctions = require("../../database/dbFunctions");

const configDb = "botConfig";
module.exports = {
    name: "status",
    description: "set bot's status",
    usages: "status PLAYING Valorant with Waifu...",
    type: 1,
    aliases: [],
    async execute(bot = new Client(), message, options) {
        if (options.cmd === this.name || options.cmd === this.aliases[0]) {
            const go = bot.utilityFunctions.isValidRoles(message.member.roles.cache);
            // memberRolesIds.has();
            if (!go) return message.react("❌");
            const { args } = options;
            const statusMessage = args.slice(1, args.length).join(" ");
            // console.log(args[0].toUpperCase(), statusMessage);
            const st = {
                type: args[0].toUpperCase(),
                message: statusMessage,
            };
            dbFunctions.setDb(configDb, "botStatus", st);
            const pd = bot.user.setActivity(`${statusMessage}`, {
                type: `${args[0].toUpperCase()}`,
            });
            message.react("✅");
        }
    },
};
