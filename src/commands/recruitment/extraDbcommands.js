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
    name: "setchannel",
    description: "set where recruitment data's  will be posted.",
    usages: `setchannel #channel_name`,
    type: 1,
    aliases: [],
    async execute(bot, message = new DISCORD.Message(), options) {
        if (options.cmd === this.name || this.aliases.includes(options.cmd)) {
            const go = bot.utilityFunctions.shouldExecuteCommand(message);
            // memberRolesIds.has();
            const text = new DISCORD.MessageEmbed().setDescription("\u200b");
            if (!go) return message.react("❌");
            if (options.cmd === "setchannel" && options.args.length >= 2) {
                // console.log("here");
                const decider = checkStatus(options.args);
                const menCh = message.mentions.channels;
                if (menCh.size === 1 && decider) {
                    // console.log("here2");
                    const dt = dbFunctions.getDb(positionListTable, decider);
                    // console.log();
                    dt.channel = menCh.firstKey();
                    dbFunctions.setDb(positionListTable, decider, dt);
                    const em = new DISCORD.MessageEmbed()
                        .setTimestamp()
                        .setColor("GREEN")
                        .setTitle("Success")
                        .addField("\u200b", "\u200b")
                        .setDescription(
                            `Responses for prcoess ${spc}${decider}${spc} \nwill be logged in <#${dt.channel}>.\n\n`
                        );
                    message.channel.send({
                        embeds: [em],
                    });
                } else {
                    message.reply(
                        `Please Use the Command Correctly!\n${spc}setchannel processId #channel${spc}`
                    );
                }
            }
        }
    },
};
