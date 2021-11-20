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
const responseDb = "responses";
const dataArray = [];
function initialEmbed(userId, pId, pNm, qn) {
    return new DISCORD.MessageEmbed()
        .setTitle(`Responses No : ${qn}`)
        .setColor("GOLD")
        .setDescription(
            `**Applicant : ** <@${userId}> \nPosition name : ${spc}${pNm}${spc}\n Process ID : ${spc}${pId}${spc}`
        );
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
function allRecruitmentData(key) {
    const data = dbFunctions.getDb(responseDb, key);
    const { questions } = dbFunctions.getDb(positionTable, key);
    const { name } = dbFunctions.getDb(positionListTable, key);
    const mentionArray = "";

    if (data) {
        let tempDt;
        let em;
        const res = [];
        const keys = Object.keys(data);
        keys.forEach((uId, idx) => {
            tempDt = data[uId];
            em = initialEmbed(uId, key, name, idx + 1);
            tempDt.forEach((q, ansI) => {
                em.addField(
                    `Question ${ansI + 1} : ${questions[ansI]}`,
                    `**User Response :** ${q}`,
                    true
                );
            });
            res.push(em);
        });
        // console.log(data.blackList);
        // data.questions.forEach((q, idx) => {
        //     em.addField(`Question ${idx + 1}`, `${q}`, true);
        // });
        return res;
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
    name: "result",
    description: "get the list of responses for a given recruitment process",
    usages: `result processId`,
    type: 1,
    aliases: [],
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
                text = allRecruitmentData(args);
                if (text.length) {
                    text.forEach((f) => {
                        message.channel.send({ embeds: [f] });
                    });
                }
            } else {
                text = openingsInfoEmbed();
                message.channel.send({ embeds: [text] });
            }
        }
    },
};
