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
function noOpeningsFound() {
    return new DISCORD.MessageEmbed()
        .setTitle("Error ⚠ ")
        .setColor("RED")
        .setTimestamp()
        .setDescription(
            `There is **no openings**  associated with that ID.😟\n
            Check the ID and Try again.\n`
        );
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
        // console.log(data.blackList);
        data.questions.forEach((q, idx) => {
            em.addField(`Question ${idx + 1}`, `${q}`, true);
        });
        return em;
    }
    return noOpeningsFound();
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
            // console.log(singleData);
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

module.exports = {
    name: "recruitment",
    description: "see recruitment process data.",
    usages: `rc processId\nrecrutiment`,
    type: 1,
    aliases: ["rc"],
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
                text = singleRecruitmentData(args);
            } else {
                text = openingsInfoEmbed();
            }
            message.channel.send({ embeds: [text] });
            // const info = dbFunctions.isTable(`${positionListTable}`);
            // // if (options.args.length) {
            // //     console.log(options.args);
            // // } else {
            // const emd = new DISCORD.MessageEmbed().setTitle("Recruitment info").setTimestamp();
            // if (info) {
            //     const allData = info.all();
            //     if (allData.length) {
            //         const firstArgs = options.args.find((rg) => rg.length === 10);
            //         if (firstArgs) {
            //             const std = info.get(firstArgs);
            //             if (std) {
            //                 const stats = dbFunctions.getDb(positionTable, firstArgs);
            //                 // console.log(stats);
            //                 emd.setDescription(
            //                     `Process ID : ${spc}${firstArgs}${spc}
            //                     Process Name : ${spc}${std.name}${spc}
            //                     Question Setter : <@${std.createdBy}>\n
            //                     Total  successful attempts: 0,
            //                     Total  unsuccessful attempts: 0,
            //                     Total Questions : ${stats.questions.length}\n`
            //                 );
            //                 stats.questions.forEach((q, idx) =>
            //                     emd.addField(`Question ${idx + 1}`, `${q}`, true)
            //                 );
            //             } else {
            //                 message.channel.send({
            //                     embeds: [
            //                         new DISCORD.MessageEmbed().setTitle(
            //                             "no recuritment exist with that ID."
            //                         ),
            //                     ],
            //                 });
            //             }
            //         } else {
            //             allData.forEach((dat) => {
            //                 // console.log();
            //                 dat.data = JSON.parse(dat.data);
            //                 emd.setColor("GREEN");
            //                 emd.addField(
            //                     `Position Name :\n${spc}${dat.data.name}${spc}`,
            //                     `ID: ${spc}${dat.ID}${spc}`,
            //                     true
            //                 );
            //             });
            //         }
            //     } else {
            //         emd.setDescription(
            //             `There is no openings  at this moment.😟\nKeep your eays on our server.\n\nThank you.`
            //         ).setColor("RED");
            //     }
            //     message.channel.send({
            //         embeds: [emd],
            //     });
            // } else {
            //     emd.setDescription(
            //         `There is no openings  at this moment.😟\nKeep your eays on our server.\n\nThank you.`
            //     ).setColor("RED");
            //     message.channel.send({
            //         embeds: [emd],
            //     });
            // }
        }
    },
};
