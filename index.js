const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send("Don\'t hack me pls"));

app.listen(port, () => console.log(`Bot listening at http://localhost:${port}`));

// ================= START BOT CODE ===================





const {
  Client,
  Collection
} = require("discord.js")

const fs = require("fs")
const client = new Client({
  disableEveryone: "true" // This makes sure that the bot does not mention everyone
});
require('dotenv').config();
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/")
const config = require("./config.json"); // enter your bot prefix in the config.json file

var fromDBLbot = new Set();
var fromProofChannel = new Set();

const prefix = config.prefix;
const myFunctions = require('./functions.js');
const channelMonitorFunctions = require('./channelMonitor.js');
const monitor_channel = ["756789522603442197"];
// one word story

['command'].forEach(handler => {
  require(`./handler/${handler}`)(client);
})



client.once("ready", async () => {


  console.log(`${client.user.tag} is online`);
  client.user.setActivity('-ORION- discord server!', {
    type: 'WATCHING',
    url: "https://discord.gg/awNZfPR"
  }).catch(console.error);
  // console.log(client.commands);

// console.log('total members :' + serverMember69);
});



client.on("message", async message => {

  ///////////////////////////////// dm stufssssssssssssssssssssssssssssssssssssssssssssss

  if (message.channel.type == "dm" && !message.author.bot) {
    if (message.content.startsWith(config.prefix))
      return;
    else {
      myFunctions.dm_received(client, message);
    }
  }

  ///////////////////////////////// dm stufssssssssssssssssssssssssssssssssssssssssssssss



  // monitor_channel.forEach(item => {
  //   if (item == message.channel.id)
  //     channel_monitor(message);

  // });

   if(message.channel.id=='756789279610372137'){
     channelMonitorFunctions.count_channel_monitor(message);
   }


  client.prefix = prefix;
  if (message.author.bot) return; // This line makes sure that the bot does not respond to other bots
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return; // This line makes sure that the bot does not respond to other messages with the bots prefix
  if (!message.member) message.member = await message.guild.fetchMember(message);
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length === 0) return;

  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));
  if (command)
    command.run(client, message, args, cmd);
});

function channel_monitor(message) {

  return false;
}

/*
client.on('guildMemberAdd', member => {
  ///one year nitro channel id = 756194339201220721
  let chn = member.guild.channels.cache.get('523126012280569858');

  chn.send(`<@${member.id}>`).then(msg => {
    msg.delete({
      timeout: 1500
    })
  }).catch("can't delete nigga");
  chn2.send(`<@${member.id}>`).then(msg => {
    msg.delete({
      timeout: 1500
    })
  }).catch("can't delete nigga");

});
*/
client.login(process.env.token) //Enter your bot token here