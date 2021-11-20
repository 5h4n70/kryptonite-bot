/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */
const DISCORD = require("discord.js");
const config = require("../../../private/config.json");
const dbFunctions = require("../../database/dbFunctions");

const maxTimer = 30 * 1000;
let filterValue;
const spc = "```";
const positionListTable = "positionList";
const positionTable = "SinglePosition";
const stats = "processStats";
const responseDb = "responses";
const dataArray = [];

function deleteSingleRecruitmentData(key) {
    const data = dbFunctions.getDb(positionTable, key);
    const name = dbFunctions.getDb(positionListTable, key);
    const pd = dbFunctions.deleteDb(positionListTable, key) && dbFunctions.deleteDb(stats, key);
    const kd = dbFunctions.deleteDb(positionTable, key) && dbFunctions.deleteDb(responseDb, key);

    if (pd && kd) {
        // console.log("they exist");
        return new DISCORD.MessageEmbed()
            .setTitle("Process Deleted!")
            .addField(`ID : ${key}`, `Name : ${name.name}`)
            .setTimestamp()
            .setColor("GOLD");
    }
    return new DISCORD.MessageEmbed()
        .setTimestamp()
        .setTitle("Failed")
        .setColor("RED")
        .addField(`No such recruitment process exist with that id`, `check id again!`);
}
function filterArgs(args) {
    return args.find((ar) => ar.length === 10);
}

module.exports = {
    name: "drec",
    description: "delete a recruitment process data.",
    usages: "dc processId\ndrec processId",
    type: 1,
    aliases: ["dc"],
    async execute(bot, message = new DISCORD.Message(), options) {
        if (options.cmd === this.name || this.aliases.includes(options.cmd)) {
            const go = bot.utilityFunctions.shouldExecuteCommand(message);
            // memberRolesIds.has();
            let text = new DISCORD.MessageEmbed().setDescription("OmegaLuL");
            if (!go) return message.react("❌");
            let args;

            if (options.args) {
                args = filterArgs(options.args);
            }
            if (args) {
                text = deleteSingleRecruitmentData(args);
            } else {
                text = new DISCORD.MessageEmbed()
                    .setTimestamp()
                    .setTitle("Failed")
                    .setColor("RED")
                    .addField(
                        `No such recruitment process exist with that id`,
                        `check the id again!`
                    );
            }
            message.channel.send({ embeds: [text] });
        }
    },
};
