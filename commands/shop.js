/* eslint-disable no-unused-vars */
const Discord = require("discord.js");
module.exports = {
	help: {
		name: "shop",
		aliases: [],
		category: "Economy",
		usage: "/shop (page)",
		description: "Shows the shop",
	},
	run: async (bot, message) => {
		try{
			let pages = [];
			let embed = new Discord.RichEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL)
				.setTitle("Shop")
				.setColor("#36393F")
				.setFooter("Page 1")
				.addField("Pickaxes :", "**Wood**: $50\n**Stone**:$500\n**Iron**:$5k\n**Diamond**:$20K\n**Obsidian**:$200K");
			let embed1 = new Discord.RichEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL)
				.setTitle("Shop")
				.setColor("#36393F")
				.setFooter("Page 2")
				.addField("Pickaxes :", "**Donator**:$1-4\n**Donator+**:$5-9\n**Holy Pickaxe**:$10+");
			pages.push(embed);
			pages.push(embed1);
			const msg = await message.channel.send(embed);
			await msg.react("◀");
			msg.react("▶");
			const filter = (reaction, user) => user.id === message.author.id;
			const collector = msg.createReactionCollector(filter, {
				time: 50000,
			});
			collector.on("collect", (r) => {
				if (r.emoji.name === "◀") {
					msg.edit(embed);
				}
				else if(r.emoji.name === "▶") {
					msg.edit(embed1);
				}
				if(message.guild.me.hasPermission("MANAGE_MESSAGES")) {
					if(!r.message) return;
					r.message.reactions.find(reaction => reaction.emoji.name == r.emoji.name).remove(message.author).catch(_ =>message.reply("Please make sure that I have the following permissions: ADD_REACTIONS, USE_EXTERNAL_EMOJIS, READ_MESSAGES, EMBED_LINKS, SEND_MESSAGES")
					);
				}
			});
		}
		catch(_) {
			message.reply("Please make sure that I have the following permissions: ADD_REACTIONS, USE_EXTERNAL_EMOJIS, READ_MESSAGES, EMBED_LINKS, SEND_MESSAGES");
		}
	},
};