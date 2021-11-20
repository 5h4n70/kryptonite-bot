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

let dataArray = [];
function uid() {
    const pp = `_${Math.random().toString(36).substr(2, 9)}`;
    return pp;
}
function initialEmbed() {
    return new DISCORD.MessageEmbed()
        .setTitle("Creating New Recruitment process")
        .addField("Enter the process name:", "\u200b")
        .setDescription(
            `You can set maximum 20 Questions!\n\n
            **To cancel this process, type** ${spc}cancel${spc}\n\n
            **To Save this process, type** ${spc}save${spc}\n\n
            You will have ${maxTimer / 1000}seconds to set each questions.`
        );
}
const filter = (m) => filterValue;
module.exports = {
    name: "cr",
    description: "Create Recruitment",
    usages: "cr",
    type: 1,
    aliases: ["create_recruitment"],
    async execute(bot, message = new DISCORD.Message(), options) {
        if (options.cmd === this.name || this.aliases.includes(options.cmd)) {
            const go = bot.utilityFunctions.shouldExecuteCommand(message);
            // memberRolesIds.has();
            if (!go) return message.react("❌");
            // console.log("hi");
            // console.log(bot.aliasList);
            filterValue = true;
            // const processId = uid();
            dataArray = [];
            message.channel.send({ embeds: [initialEmbed()] });
            const collector = message.channel.createMessageCollector({
                filter,
                idle: maxTimer,
            });
            collector.on("collect", (dt) => {
                if (dt.content.toLowerCase() === "cancel") {
                    collector.stop();
                } else if (dt.content.toLowerCase() === "save") {
                    collector.stop("ok");
                } else if (!dt.author.bot && dt.author.id === message.author.id) {
                    collector.resetTimer({
                        idle: maxTimer,
                    });
                    dataArray.push(dt.content);
                    if (dataArray.length) {
                        message.channel.send({
                            content: `${spc}Enter Your Question ${dataArray.length}:${spc}`,
                        });
                    }
                    // console.log(`collected : ${dt.content}`);
                }
            });
            collector.on("end", (collected, rsn) => {
                const processId = uid();
                // console.log("reason : ", rsn);
                if (dataArray.length > 1 && dataArray.length < 22 && rsn === "ok") {
                    const prName = dataArray.shift();
                    dbFunctions.setDb(positionListTable, processId, {
                        name: prName,
                        createdBy: message.author.id,
                        status: 0,
                        limit: 3,
                    });

                    dbFunctions.setDb(positionTable, processId, {
                        questions: dataArray,
                        successful_attempts: [],
                        unsuccessful_attempts: [],
                        blackList: [],
                    });
                    const final = new DISCORD.MessageEmbed()
                        .setTitle("Success!")
                        .setColor("GREEN")
                        .setDescription(
                            `a new Recruitment process has been created with\n
                            ID:${spc}${processId}${spc}\n
                            Name:${spc}${prName}${spc}\n
                            Total Questions: ${dataArray.length}`
                        )
                        .setTimestamp();
                    if (dataArray.length < 20) {
                        dataArray.forEach((mc, idx) => {
                            final.addField(`Question ${idx + 1}:`, `${mc}`);
                        });
                    }
                    message.channel.send({ embeds: [final] });
                    // console.log("Done");
                } else {
                    message.channel.send({
                        embeds: [
                            new DISCORD.MessageEmbed()
                                .setColor("RED")
                                .setDescription(
                                    "Please follow the instructions and must type save at the end."
                                )
                                .setTitle("Recruitment process didn't save!!"),
                        ],
                    });
                }
            });
            // const
        }
    },
};
