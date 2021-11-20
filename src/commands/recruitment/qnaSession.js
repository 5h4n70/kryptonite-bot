/* eslint-disable operator-linebreak */
/* eslint-disable new-cap */
const DISCORD = require("discord.js");
const dbFunctions = require("../../database/dbFunctions");
const config = require("../../../private/config.json");

const maxTimer = 30 * 1000;
const spc = "```";
const stats = "processStats";
const positionListTable = "positionList";
const configDb = "botConfig";
const positionTable = "SinglePosition";
const responseDb = "responses";
function blockedEmbed() {
    return new DISCORD.MessageEmbed()
        .setTitle("User Blocked!")
        .addField(
            "You are not allowed to apply for this position",
            "Contact with a Mod/admin for further info."
        )
        .setTimestamp()
        .setColor("RED");
}
function checkBlockList(processId, userId) {
    const previousList = dbFunctions.getDb(positionTable, processId);
    if (previousList.blackList.includes(userId)) {
        return true;
    }
    return false;
}
function updateUnsuccessfulResponse(user = new DISCORD.User(), positionID) {
    const p = dbFunctions.getDb(stats, positionID);
    if (p) {
        let nm = parseInt(p[user.id], 10);
        nm += 1;
        p[user.id] = nm;
        if (nm === 3) {
            const preD = dbFunctions.getDb(positionTable, positionID);
            preD.blackList.push(user.id);
        }
    } else {
        const pd = {};
        pd[user.id] = 1;
        dbFunctions.setDb(stats, positionID, pd);
    }
}
function updateDbs(user = new DISCORD.User(), positionID, ans = []) {
    // updating singleTable
    const tempSingledata = dbFunctions.getDb(positionTable, positionID);
    tempSingledata.successful_attempts.push(user.id);
    const operation1 = dbFunctions.setDb(positionTable, positionID, tempSingledata);
    // updating responseDb
    const operation2 = dbFunctions.setDb(responseDb, `${positionID}.${user.id}`, ans);
    if (operation1 && operation2) {
        return true;
    }
    return false;
}
function findMailBoxChannel(bot = new DISCORD.Client(), processId) {
    const serverId = dbFunctions.getDb(configDb, "serverId") || config.serverId;
    const channelId = dbFunctions.getDb(configDb, "mailBox") || config.mailBox;
    const targetChannel = dbFunctions.getDb(positionListTable, `${processId}.channel`) || channelId;
    // console.log(dbFunctions.getDb(positionListTable, `${processId}.channel`));
    if (targetChannel && serverId) {
        const server = bot.guilds.cache.get(serverId);
        const findChannel = server.channels.cache.get(targetChannel);
        if (findChannel) {
            return findChannel;
        }
    }
    return false;
}
function resultEmbed(user = new DISCORD.User(), positionID, posName, ans = []) {
    const resutDb = dbFunctions.getDb(positionTable, positionID);
    const { questions } = resutDb;
    const emdb = new DISCORD.MessageEmbed()
        .setTitle(`✅Received a response from ${user.tag}`)
        .setDescription(
            `**Position Name :** ${posName}\n\nID: ${spc}${positionID}${spc}\nApplicant : <@${user.id}>\n\n__**Responses**__`
        )
        .setTimestamp();
    ans.forEach((res, idx) => {
        emdb.addField(`Question ${idx + 1} : ${questions[idx]}`, `**User Response**: ${res}`);
    });
    return emdb;
}
function thanksEmbed(posName, uId) {
    return new DISCORD.MessageEmbed()
        .setTitle("✅ Sucessfully submitted your Response")
        .setDescription("Thanks for applying 💝 .\nif you get selected, you will be notified soon.")
        .setTimestamp()
        .addField("Position Name :", `${posName}`)
        .addField("applicant", `<@${uId}>`)
        .setColor("GREEN");
}
function questionEmbed(tag, posName) {
    return new DISCORD.MessageEmbed()
        .setColor("RANDOM")
        .setDescription("Enter your answer")
        .setTitle(`QnA session with ${tag} for ${posName}`)
        .setTimestamp();
}
function confirmationEmbed(id) {
    // console.log(`id   ${id}`);
    const p = dbFunctions.getDb(positionTable, id);
    return new DISCORD.MessageEmbed().setDescription(`
                            **For this Position ,you have to answer ${p.questions.length} Questions**.\n\n
                            **Are you Ready For a short QnA session ?**\n ( type yes/no)\n\n
                            Type ${spc} stop ${spc}to end this process.
                            `);
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
    const dataMap = new Map();
    const allData = dbFunctions.allDb(`${positionListTable}`);
    let countOpenings = 0;
    if (allData && allData.length) {
        let convertedData;
        let stringStat;
        const rt = new DISCORD.MessageEmbed().setTimestamp().setColor("RANDOM");
        // .setDescription(`There are total ${allData.length} openings Data.`);
        allData.forEach((singleData) => {
            // console.log(singleData);
            convertedData = JSON.parse(singleData.data);
            if (convertedData.status) {
                dataMap.set(convertedData.name, singleData.ID);
                countOpenings += 1;
                rt.addField("Position Name :", `${convertedData.name}`, true);
            }
        });
        if (countOpenings) {
            rt.setDescription(
                `There are total ${countOpenings} openings at this moment.\nEnter the position name you want to apply.`
            );
            return { cnt: countOpenings, em: rt, dataMap };
        }
    }
    const pd = noOpeningsEmbed();
    return { cnt: countOpenings, em: pd, dataMap };
}

// bot.runningRecrutment.add(msg.author.id);
async function QnA(bot = new DISCORD.Client(), message = new DISCORD.Message(), options = {}) {
    // console.log("qna");
    /// variable declaration
    const openingsQuery = openingsInfoEmbed();
    let msgCount = 0;
    let nameLoopCount = 0;
    let yesNoLoopCount = 0;
    let collector = 0;
    let askedQuestion = 0;
    let dataId = 0;
    let tempDb = 0;
    let posName = 0;
    const ansArray = [];

    /// function declarations
    const filter = (m = new DISCORD.Message()) => {
        if (m.author.bot) return false;
        // console.log(`msg count = ${msgCount}`);
        if (m.content === "stop") {
            collector.stop();
            return false;
        }
        if (msgCount === 0) {
            if (openingsQuery.dataMap.has(m.content)) {
                msgCount += 1;
                collector.resetTimer();
                posName = m.content;
                let fem = openingsQuery.dataMap.get(m.content);
                dataId = fem;
                const blc = checkBlockList(dataId, m.author.id);
                if (blc) {
                    m.channel.send({ embeds: [blockedEmbed()] });
                    collector.stop();
                    return false;
                }
                fem = confirmationEmbed(fem);
                m.channel.send({
                    embeds: [fem],
                });
            } else {
                nameLoopCount += 1;
                if (nameLoopCount > 5) {
                    m.channel.send({
                        content: `${spc}As you failed to type the position name more then 5 times,This process is closed now.${spc}`,
                    });
                    collector.stop();
                    return false;
                }
                m.channel.send({
                    content: `${spc}Enter the position name Exactly as given!${spc}`,
                });
            }
            return false;
        }
        if (msgCount === 1) {
            if (m.content.toLowerCase() === "yes") {
                msgCount += 1;
                collector.resetTimer();
                const pd = questionEmbed(m.author.tag, posName);
                tempDb = dbFunctions.getDb(positionTable, dataId);
                pd.addField(
                    `Question No:${askedQuestion + 1}`,
                    `${tempDb.questions[askedQuestion]}`
                );
                askedQuestion += 1;
                m.channel.send({
                    embeds: [pd],
                });
            } else if (m.content.toLowerCase() === "no") {
                collector.stop();
                m.channel.send({
                    content: `${spc}This process is closed now.${spc}`,
                });
                return false;
            } else {
                yesNoLoopCount += 1;
                if (yesNoLoopCount > 5) {
                    m.channel.send({
                        content: `${spc}This process is closed now.${spc}`,
                    });
                    collector.stop();
                    m.channel.send({ content: "Process closed successfully." });
                    return false;
                }
                m.channel.send({
                    content: `${spc}Enter  yes/no!${spc}`,
                });
            }
            return false;
        }
        if (msgCount >= 2) {
            // console.log(`last = ${askedQuestion}`);
            collector.resetTimer();
            ansArray.push(m.content);
            tempDb = dbFunctions.getDb(positionTable, dataId);
            if (askedQuestion === tempDb.questions.length) {
                collector.stop("ok");
                return true;
            }
            const pd = questionEmbed(m.author.tag, posName);
            pd.addField(`Question No:${askedQuestion + 1}`, `${tempDb.questions[askedQuestion]}`);
            askedQuestion += 1;
            m.channel.send({
                embeds: [pd],
            });
            return true;
        }
        // if (m.author.id === message.author.id && !m.author.bot) {
        //     return true;
        // }
        // if (m.author.bot) msgCount += 1;

        return false;
    };

    /// main task
    await message.channel.send({
        embeds: [openingsQuery.em],
    });
    if (!openingsQuery.cnt && bot.runningRecrutment.delete(message.author.id)) {
        // console.log("0 openings");
        return true;
    }
    collector = message.channel.createMessageCollector({
        filter,
        time: maxTimer,
    });
    // collector.on("collect", (m) => console.log(`Collected ${m.content}`));
    collector.on("end", (collected, reason) => {
        if (reason === "ok") {
            // console.log("op");
            const dbResult = updateDbs(message.author, dataId, ansArray);
            const responseChn = findMailBoxChannel(bot, dataId);
            if (responseChn) {
                message.channel.send({ embeds: [thanksEmbed(posName, message.author.id)] });
                responseChn.send({
                    embeds: [resultEmbed(message.author, dataId, posName, ansArray)],
                });
            }
        } else {
            updateUnsuccessfulResponse(message.author, dataId);
        }

        bot.runningRecrutment.delete(message.author.id);
    });

    return true;
}
module.exports = QnA;
