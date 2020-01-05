const Discord = require("discord.js");
module.exports = {
	help:{
		name:"boost",
		aliases:[],
		usage:"/boost",
		category:"Economy",
	},
	run: (bot, message) => {
		const bEmbed = new Discord.RichEmbed()
			.setTitle("Boost")
			.setColor("#36393F")
			.addField("How to get a booster", "You can get a booster from random drops or joining **__[This Server](https://discord.gg/aJxuvJU)__**");
		message.channel.send(bEmbed);
	},
};