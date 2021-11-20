/* eslint-disable global-require */
/* eslint-disable no-param-reassign */
const text = "this is reload file";
const djs = require("discord.js");
const glob = require("glob");
const config = require("../../../private/config.json");

const obj = {
    name: "reload",
    description: "developer only command : reload",
    type: 0,
    aliases: ["r"],
    execute(bot, message, options) {
        // eslint-disable-next-line eqeqeq
        const isOnwer = bot.utilityFunctions.isBotOwner(message.author.id);
        // console.log(isOnwer);
        if (isOnwer) {
            bot.commandList.sweep(() => true);
            bot.aliasList.sweep(() => true);
            // bot.utilityFunctions.sweep(() => true);
            glob(`${__dirname}/../**/*.js`, async (err, filePaths) => {
                if (err) return console.log(err);

                filePaths.forEach((file) => {
                    delete require.cache[require.resolve(file)];
                    // eslint-disable-next-line import/no-dynamic-require
                    // eslint-disable-next-line global-require
                    // eslint-disable-next-line import/no-dynamic-require
                    const pull = require(file);
                    if (pull.name) {
                        bot.commandList.set(pull.name, pull);
                    }
                    if (pull.aliases) {
                        pull.aliases.forEach((alias) => {
                            bot.aliasList.set(alias, pull.name);
                        });
                    }
                });
            });
            bot.utilityFunctions = require("../../botFiles/myUtilityFunctions");
            message.channel.send("All command reloaded!");
        }
    },
};

module.exports = obj;
