/* eslint-disable operator-linebreak */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
const DISCORD = require("discord.js");

function flip() {
    const Throws = Math.ceil(Math.random() * 100 + 20);
    const coinArray = [];
    let Toss;
    for (let i = 0; i < Throws; i += 1) {
        const rndNo = Math.floor(Math.random() * 2 + 1);
        if (rndNo === 1) {
            Toss = 0;
        } else {
            Toss = 1;
        } // if (rnd === 1)
        coinArray.push(Toss);
    }
    const rews = coinArray[Math.floor(Math.random() * coinArray.length)];
    if (rews) return "Head";
    return "Tail";
}

function firstEmbed(users, msg) {
    const lp =
        "React with\n\n🇭 for Head.\n🇹 for Tail.\n\n**Only one person can Choose.**\n\nTime :** 20sec**";
    let fp = "";
    if (users.size === 1) {
        fp = `${users.first()} <@${msg.author.id}>`;
    } else if (users.size === 2) {
        fp = `${users.first()} ${users.last()}`;
    }
    const rt = new DISCORD.MessageEmbed()
        .setTimestamp()
        .setTitle("Toss")
        .setDescription(fp + lp)
        .setFooter(msg.author.tag, msg.author.avatarURL());
    return rt;
}
const mEmbd = new DISCORD.MessageEmbed()
    .setColor("YELLOW")
    .setTitle("Toss")
    .setDescription("H for Head , T for tails")
    .setTimestamp();

const obj = {
    name: "toss",
    description: "interactive Toss command.u can mention people who will be able to vote.",
    usages: "toss @user @user\ntoss",
    type: 1,
    aliases: [],
    async execute(bot, message = new DISCORD.Message(), options) {
        const go = bot.utilityFunctions.shouldExecuteCommand(message);
        // memberRolesIds.has();
        if (!go) return message.react("❌");
        const mentionedUser = message.mentions.members;

        if (mentionedUser.size) {
            mentionedUser.delete(message.author.id);
        }
        const getInitialEmbed = firstEmbed(mentionedUser, message);
        const neM = await message.channel.send({
            embeds: [getInitialEmbed],
        });
        neM.react("🇭");
        neM.react("🇹");

        const filter = (reaction, user) => {
            if (user.bot) {
                return false;
            }
            if (reaction.emoji.name !== "🇭" && reaction.emoji.name !== "🇹") {
                return false;
            }

            if (mentionedUser.size === 0) {
                return true;
            }
            if (mentionedUser.size === 1) {
                if (mentionedUser.has(user.id) || user.id === message.author.id) {
                    return true;
                }
            }
            if (mentionedUser.size === 2) {
                if (mentionedUser.has(user.id)) {
                    return true;
                }
            }
            neM.reactions.cache.get(reaction.emoji.name).users.remove(user);
            return false;
        };
        const collector = new DISCORD.ReactionCollector(neM, {
            filter,
            max: 1,
            time: 20 * 1000,
        });
        collector.on("end", (collected) => {
            // console.log(`data size ${collected.size}`);
            if (collected.size) {
                const chose = collected.firstKey() === "🇭" ? "Head" : "Tail";
                const tossResult = flip();
                const te = collected
                    .first()
                    .users.cache.filter((user) => user.id !== message.client.user.id);
                getInitialEmbed
                    .setColor("GREEN")
                    .addField(
                        "\u200b",
                        `🛑 <@${te.firstKey()}> Chose ${collected.firstKey()} ${chose}`
                    )
                    .addField("Toss Result : ", `${tossResult}`);

                // message.channel.send({
                //     // content: pd,
                //     embeds: [getInitialEmbed],
                // });
                neM.edit({
                    embeds: [getInitialEmbed],
                });
            } else {
                neM.delete();
            }
        });
    },
};

module.exports = obj;
