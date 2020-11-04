const {
    MessageEmbed,
    Util
} = require("discord.js");
const Qdb = require('quick.db');
const config = require("../../config.json");

let tag_msg;


function add_iq_to_IDs(ids) {
    const table_name = 'iqTable'
    let iqTable = new Qdb.table(table_name);
    let carray = Array.from(ids);
    carray.forEach(ev => {
        iqTable.add(ev, 1);
    });
}

function random() {
    let min_a = [50, 100, 300, 700, 567, 1000];
    let max_a = [10, 180, 500, 709, 569, 1800, 69, 23, 85, 96];
    let min = min_a[Math.floor(Math.random() * min_a.length)];
    let max = max_a[Math.floor(Math.random() * max_a.length)];
    if (min > max) {
        [min, max] = [max, min];
    }
    let ret = Math.floor(Math.random() * (max - min + 1)) + min;
    // console.log('ret ='+ ret);
    min = ret - 7;
    max = ret + 8;
    if (ret >= min && ret <= max)
        return {
            max,
            min,
            ret
        };
}

module.exports = {
    name: "gnum",
    description: "Test how Strong your guess",
    category: "fun",
    aliases: [""],
    usage: `${config.prefix}gnum`,

    run: async (client, message, args, cmd) => {
        let q = await random();


        let i = 0;
        const Embed = new MessageEmbed()
            .setTitle("🌀 Guess The Number !!🌀")
            .setDescription(`--------**Range**--------\n\nMin:${q.min}\nMax:${q.max}`)
            .setColor(`GREEN`)
            .setFooter(
                `Guess The number! You have 15 seconds.`
            );
        tag_msg = message;
        let d = new Set();
        message.channel.send(Embed);
        try {

            let msgs = await message.channel.awaitMessages(function (u2) {



                if (u2.content == `${config.prefix}hacknum` && config.serverOwner == message.author.id) {
                    u2.member.send("the number is " + q.ret);

                }




                tag_msg = u2;
                if (Number(u2.content)) {
                    if (u2.content == q.ret)
                        d.add(u2.author.id)
                    return true;
                }
            }, {
                time: 15000,
                errors: ["time"]
            });
            // if (msgs.first().content == q) {
            //     return tag_msg.reply(`You got it correct!`);
            // } else {
            //     return tag_msg.reply(`You got it incorrect. ${msgs.first().content}`);
            // }
        } catch (e) {
            // console.log(e);
            if (!d.size) {
                const Embed = new MessageEmbed()
                    .setTitle("⛔ ⛔Times UP!! ⛔ ⛔")
                    .setDescription(`Nobody guessed it correct .\nThe number was **${q.ret}** .`)
                    .setColor(`RED`)
                    .setFooter(
                        `command used by ${message.author.tag}`
                    );
                message.channel.send(Embed);

            } else {
                let menVer = "";
                for (let i of d) {
                    menVer += "<@" + i + ">";
                }
                const Embed = new MessageEmbed()
                    .setTitle("⛔ 🎉Times UP!! 🎉 ⛔")
                    .setDescription(`🎉 ${menVer} 🎉 guessed it correct .\n\nThe number was **${q.ret}** .`)
                    .setColor(`GREEN`)
                    .setFooter(
                        `command used by ${message.author.tag}`
                    );
                add_iq_to_IDs(d);
                message.channel.send(Embed);
            }

        }
    }
};