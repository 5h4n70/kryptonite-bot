const {
    MessageEmbed,
    Message,
    Client
} = require("discord.js");
const config = require("../../config.json");
const Qdb = require('quick.db');
const myFunctions = require('../../functions.js');
const asc_tab = require('ascii-table');




module.exports = {
    name: "count",
    category: "info",
    aliases: ["set-count", "top-counter"],
    description: ' see the next number to count ',
    usage: `${config.prefix}count`,

    run: async (client, message, args, cmd) => {
        var local_prm = {
            onlyServerManager: true,
            onlyHeadAdmin: true,
            onlyAdmin: true,
            onlyHeadModerator: true,
            onlyModerator: true,
            onlyTrialModerator: false
        }
        var go = myFunctions.is_allowed(local_prm, myFunctions.check_permissions(message.member));
        if (go) {
            if (cmd == 'set-count') {
                let temp = Number(args[0]);
                if (temp) {
                    let d = Qdb.delete('last_count');
                    Qdb.push('last_count', temp)
                    message.reply("Done :) ");
                } else
                    message.reply("Enter a valid Number");
            } else if (cmd == 'top-counter') {



                let count_leaderBoard = new Qdb.table('count_board');
                let d = count_leaderBoard.all();
                d.sort((a, b) => a.data > b.data ? -1 : 1);
                // console.log(d);

                const embed = new MessageEmbed()
                    .setTitle("🎀🎀 Top 10 counters 🎀🎀")
                    .setColor('RANDOM')
                    // .setDescription(`(max : member)`)
                    .setTimestamp()
                    .setFooter(`requested by  ${message.author.tag}`);

                let loop_length = d.length;
                if (loop_length > 10)
                    loop_length = 10;
                const ajaira_variable = ["🥇 ", "🥈 ", "🥉 "];
                let table = "---- User-----------------------points\n";
                for (let t = 0; t < loop_length; t++) {
                    let em_top = "";
                    if (t < 3) {
                        em_top = ajaira_variable[t];
                    }
                    let element = d[t];
                    const Guild56 = await message.guild.members.fetch(element.ID)
                        .then(gE => {
                            // console.log(gE.user.tag);
                            table += `\n${em_top}${gE.user.tag} --------------- ${element.data}\n`;
                        })
                        .catch(console.error);
                }
                embed.setDescription(table);
                message.channel.send(embed);



                // console.log(d);
            } else {
                let d = Qdb.get('last_count') + 1;
                message.reply("The number  to count Next is : " + d);
            }
        }
    }
}