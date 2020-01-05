const Discord = require("discord.js");
module.exports = {
	help:{
		name:"vote",
		aliases:[],
		usage:"/vote",
		category:"Util",
	},
	run:  (bot, message) => {
		try{
			const vEmbed = new Discord.RichEmbed()
				.setTitle("Vote")
				.setDescription("You can vote [here](https://discordbots.org/bot/587627808520667146/vote)")
				.setAuthor(message.author.username, bot.user.displayAvatarURL)
				.setColor("#36393F")
				.setTimestamp()
				.addField("Features", "For voting you get a higher chance of rare ores!");

			message.channel.send(vEmbed);
		}
		catch(_) {
			message.reply("Please make sure that I have the following permissions: ADD_REACTIONS, USE_EXTERNAL_EMOJIS, READ_MESSAGES, EMBED_LINKS, SEND_MESSAGES");
		}
	},
};