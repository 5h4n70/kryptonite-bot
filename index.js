require("dotenv").config({
    path: "./private/.env",
});
const DISCORD = require("discord.js");
const qna = require("./src/commands/recruitment/qnaSession");
const config = require("./private/config.json");
const utF = require("./src/botFiles/myUtilityFunctions");
const dmChannel = require("./src/botFiles/dm");
const db = require("./src/database/dbFunctions");
const QnA = require("./src/commands/recruitment/qnaSession");

const botIntents = new DISCORD.Intents(14023);
const bot = new DISCORD.Client({
    intents: botIntents,
    partials: ["MESSAGE", "CHANNEL", "REACTION", "GUILD_MEMBER"],
});
bot.commandList = new DISCORD.Collection();
bot.aliasList = new DISCORD.Collection();
bot.config = new DISCORD.Collection();
bot.utilityFunctions = utF;
bot.runningRecrutment = new Set();
bot.config.set("prefix", db.getDb("botConfig", "prefix") || config.prefix);
require("./src/botFiles/loadCommands")(bot);

/**
 *checking command cooldowns
 * */
const coolDown = new Set();
const rOngoing = new Set();

// client events
bot.on("ready", async () => {
    console.log(`${bot.user.tag}    is Online !!`);
    const dbStatus = db.getDb("botConfig", "botStatus");

    setInterval(() => {
        bot.user.setActivity(`${dbStatus.message}`, {
            type: dbStatus.type,
            name: "idk",
            url: "https://discord.gg/az7pdhRGYx",
        });
    }, 10 * 60 * 1000);
});

bot.on("messageCreate", async (msg) => {
    if (msg.channel.type === "DM" && !msg.author.bot) {
        const ct = msg.content.toLowerCase();
        if (ct === `${bot.config.get("prefix")}apply` || ct === "apply") {
            // dmChannel(msg, bot);
            if (!bot.runningRecrutment.has(msg.author.id)) {
                bot.runningRecrutment.add(msg.author.id);

                QnA(bot, msg, {});
            }
            // setTimeout(() => {
            //     bot.runningRecrutment.delete(msg.author.id);
            //     console.log(`Deleted ${msg.author.id}`);
            // }, 10 * 1000);
            // console.log(`added ${msg.author.tag} into set.`);
        } else if (!bot.runningRecrutment.has(msg.author.id)) {
            dmChannel(msg, bot);
            // console.log("not a recruit session");
        }
    } else {
        // console.log("trigger");
        if (msg.author.bot) return;
        if (!msg.content.startsWith(bot.config.get("prefix"))) return;
        const args = msg.content.slice(1).split(" ");
        const cmd = args.shift().toLowerCase();

        // console.log();
        const findCommand = bot.utilityFunctions.findCmd(bot, cmd);
        if (findCommand.flag) {
            findCommand.result.execute(bot, msg, {
                args,
                cmd,
            });
        }
    }
});
bot.login(process.env.token);
// console.log(commandLoader);
