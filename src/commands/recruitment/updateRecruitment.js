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

const dataArray = [];
function initialEmbed() {
    return new DISCORD.MessageEmbed().setTitle("Creating New Recruitment process").setColor("GOLD");
}
function singleRecruitmentData(key) {
    const data = dbFunctions.getDb(positionTable, key);
    const name = dbFunctions.getDb(positionListTable, key);
    let mentionArray = "";

    if (data) {
        if (data.blackList.length) {
            data.blackList.forEach((i) => {
                mentionArray += ` <@${i}> `;
            });
        }
        const em = new DISCORD.MessageEmbed()
            .setTitle(`Position Name : ${name.name}`)
            .setDescription(
                `ID : ${spc}${key}${spc}\n
            Total Questions : ${data.questions.length}\n
            Total Sucessful attempts : ${data.successful_attempts.length}
            Total unsuccessful attempts : ${data.unsuccessful_attempts.length}
            BlackListed Users : ${mentionArray}`
            )
            .setColor("GREEN")
            .setTimestamp();
        console.log(data.blackList);
        return em;
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
function noOpeningsEmbed() {
    return new DISCORD.MessageEmbed()
        .setTitle("Recruitment Info")
        .setColor("RED")
        .setTimestamp()
        .setDescription(
            `There is **no openings**  at this moment.😟\n
            Keep your eays on our server.\n\n
            Thank you.\n`
        );
}
function noOpeningsFound() {
    return new DISCORD.MessageEmbed()
        .setTitle(" ⚠ Error ⚠ ")
        .setColor("RED")
        .setTimestamp()
        .setDescription(
            `There is **no openings**  associated with that ID.😟\n
            Check the ID and Try again.\n`
        );
}
function openingsInfoEmbed() {
    const allData = dbFunctions.allDb(`${positionListTable}`);
    if (allData && allData.length) {
        let convertedData;
        let stringStat;
        const rt = new DISCORD.MessageEmbed()
            .setTimestamp()
            .setColor("GREEN")
            .setDescription(`There are total ${allData.length} openings Data.`);
        allData.forEach((singleData) => {
            convertedData = JSON.parse(singleData.data);
            stringStat = convertedData.status ? "Active" : "Off";
            rt.addField(
                `Position Name : ${convertedData.name}\nID  :   ${spc}${singleData.ID}${spc}`,
                `Status :${spc} ${stringStat}${spc}`,
                true
            );
            // if (convertedData.status) {
            //     refinedArray.push(convertedData);
            // }
        });
        return rt;
    }

    return noOpeningsEmbed();
}
function checkStatus(args) {
    let rt;
    if (args.length) {
        rt = filterArgs(args);
    }
    if (rt) {
        const findData = dbFunctions.getDb(positionListTable, rt);
        if (findData) {
            return rt;
        }
    }
    return false;
}
module.exports = {
    name: "addq",
    description: "manage a recrutiment process data.",
    usages: `to add question : addq processId\nto delete question : deleteq pocessId\nto start a recrutiment process : open process\n
            close a process : -close processId\nadd a user to blacklist : addbl processId`,
    type: 1,
    aliases: ["open", "close", "updaten", "deleteq", "removebl", "addbl"],
    async execute(bot, message = new DISCORD.Message(), options) {
        if (options.cmd === this.name || this.aliases.includes(options.cmd)) {
            const go = bot.utilityFunctions.shouldExecuteCommand(message);
            // memberRolesIds.has();
            let text = new DISCORD.MessageEmbed().setDescription("\u200b");
            if (!go) return message.react("❌");
            const decider = checkStatus(options.args);
            if (decider) {
                const previousData = dbFunctions.getDb(positionListTable, decider);
                const previousDataTable = dbFunctions.getDb(positionTable, decider);
                if (options.cmd === "open") {
                    previousData.status = 1;
                    dbFunctions.setDb(positionListTable, decider, previousData);
                    text.setTimestamp()
                        .setTitle("process updated!")
                        .setColor("GREEN")
                        .addField(`Name ${previousData.name}`, "Process is Active now!");
                    message.channel.send({ embeds: [text] });
                } else if (options.cmd === "close") {
                    previousData.status = 0;
                    dbFunctions.setDb(positionListTable, decider, previousData);
                    text.setTimestamp()
                        .setTitle("process updated!")
                        .addField(`Name : ${previousData.name}`, "Process closed.");
                    message.channel.send({ embeds: [text] });
                } else if (options.cmd === "updaten") {
                    // console.log("nice");
                    const filter = (m) => m.author.id === message.author.id;
                    const collector = message.channel.createMessageCollector({
                        filter,
                        max: 1,
                        time: maxTimer,
                    });
                    message.channel.send({
                        content: `${spc}Enter The new Recruitment process Name : ${spc}`,
                    });
                    collector.on("end", (collected) => {
                        if (collected.size) {
                            const pd = collected.first().content;
                            previousData.name = pd;
                            dbFunctions.setDb(positionListTable, decider, previousData);
                            text.addField(`Sucessfully Changed the process Name!`, `\u200b`)
                                .setColor("GREEN")
                                .setTimestamp();
                        } else {
                            text.addField(`Failed to change process name`, "\u200b")
                                .setColor("RED")
                                .setTimestamp();
                        }
                        message.channel.send({ embeds: [text] });
                    });
                } else if (options.cmd === "addq") {
                    // console.log("OP");
                    const filter = (m) => m.author.id === message.author.id && !m.author.bot;
                    const collector = message.channel.createMessageCollector({
                        filter,
                        max: 1,
                        time: maxTimer,
                    });
                    message.channel.send({
                        content: `${spc}Enter The new Question : ${spc}`,
                    });
                    collector.on("end", (collected) => {
                        if (collected.size) {
                            const pd = collected.first().content;
                            // console.log(previousDataTable.questions);
                            previousDataTable.questions.push(pd);
                            dbFunctions.setDb(positionTable, decider, previousDataTable);
                            text.addField(
                                `Sucessfully added a new question!`,
                                `Name : ${previousData.name}`
                            )
                                .setColor("GREEN")
                                .setTimestamp();
                        } else {
                            text.addField(`Failed to add new question.`, "\u200b")
                                .setColor("RED")
                                .setTimestamp();
                        }
                        message.channel.send({ embeds: [text] });
                    });
                } else if (options.cmd === "deleteq") {
                    // console.log("OP");
                    const filter = (m) => {
                        if (m.author.id === message.author.id && !m.author.bot) {
                            const num = parseInt(m.content, 10);
                            if (num && num <= previousDataTable.questions.length && num > 0) {
                                return true;
                            }
                            message.channel.send({
                                content: `${spc}Enter a valid Question Number: ${spc}`,
                            });
                        }

                        return false;
                    };
                    const collector = message.channel.createMessageCollector({
                        filter,
                        max: 1,
                        time: maxTimer,
                    });
                    message.channel.send({
                        content: `${spc}Enter The Question Number you want to delete: ${spc}`,
                    });
                    collector.on("end", (collected) => {
                        if (collected.size) {
                            const pd = collected.first().content;
                            // console.log(previousDataTable.questions);
                            const n = parseInt(pd, 10);
                            previousDataTable.questions.splice(n - 1, 1);
                            dbFunctions.setDb(positionTable, decider, previousDataTable);
                            text.addField(
                                `Sucessfully deleted   Question No: ${n}!`,
                                `Name : ${previousData.name}`
                            )
                                .setColor("GREEN")
                                .setTimestamp();
                        } else {
                            text.addField(`Failed to add new question.`, "\u200b")
                                .setColor("RED")
                                .setTimestamp();
                        }
                        message.channel.send({ embeds: [text] });
                    });
                } else if (options.cmd === "removebl") {
                    const idx = previousDataTable.blackList.indexOf(options.args[1]);
                    if (idx >= 0) {
                        previousDataTable.blackList.splice(idx, 1);
                        dbFunctions.setDb(positionTable, decider, previousDataTable);
                        message.react("👍");
                    } else {
                        message.channel.send({ content: "Failed :( " });
                    }
                } else if (options.cmd === "addbl") {
                    const idx = previousDataTable.blackList.indexOf(options.args[1]);
                    if (idx === -1) {
                        const kd = previousDataTable.blackList.push(options.args[1]);
                        // console.log(kd);
                        dbFunctions.setDb(positionTable, decider, previousDataTable);
                        message.react("👍");
                    } else {
                        message.channel.send({ content: "Already in the blackList. " });
                    }
                }
            } else {
                text = noOpeningsFound();
                message.channel.send({ embeds: [text] });
            }
        }
    },
};
