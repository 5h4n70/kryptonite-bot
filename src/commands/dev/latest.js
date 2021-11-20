/* eslint-disable comma-dangle */
const Canvas = require("canvas");
const path = require("path");
const { MessageEmbed, MessageAttachment, Message } = require("discord.js");
const config = require("../../../private/config.json");

module.exports = {
    name: "d",
    description: "developer only command",
    type: 0,
    aliases: [],
    async execute(bot, message = new Message(), options) {
        const go = bot.utilityFunctions.isValidRoles(message.member.roles.cache);
        // memberRolesIds.has();
        if (!go) {
            return message.reply("You don't have enough permission to run this command!😅");
        }
        if (go) {
            const canvas = Canvas.createCanvas(900, 400);
            const ctx = canvas.getContext("2d");
            const bg = await Canvas.loadImage(path.join(__dirname, "./blk2.png"));
            // console.log(path.join(__dirname, "./blk.png"));
            let x = -500;
            let y = -200;
            ctx.drawImage(bg, x, y);
            const pfp = await Canvas.loadImage(message.author.displayAvatarURL({ format: "png" }));
            x = canvas.width / 2 - pfp.width / 2;
            y = 25;
            ctx.drawImage(pfp, x, y);
            ctx.fillStyle = "#ffffff";
            ctx.font = "35px sans-serif";
            const text = `${message.author.tag}`;
            x = canvas.width / 2 - ctx.measureText(text).width / 2;
            ctx.fillText(text, x, y);
            const attc = new MessageAttachment(canvas.toBuffer());
            message.channel.send({ content: "omg", files: [attc] });
        }
    },
};
