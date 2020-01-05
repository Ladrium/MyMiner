const Discord = require("discord.js");
module.exports = {
	help:{
		name:"donate",
		aliases:[],
		category:"Util",
	},
	run: (bot, message) => {
		const embed = new Discord.RichEmbed()
			.setAuthor(bot.user.username, message.author.displayAvatarURL)
			.setColor("#36393F")
			.setFooter(`Requested By: ${message.author.username}`, bot.user.displayAvatarURL)
			.addField("Do you want the bot to run even better? Or just help us with the bot in general?(You'll also get a donator rank + pickaxe)", "Then you can **[Donate Here](https://donatebot.io/checkout/565521491089686569)**")
			.setTimestamp();
		message.channel.send(embed);
	},
};