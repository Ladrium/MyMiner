const Discord = require("discord.js");
const Mine = require("../models/mine.js");
module.exports = {
	help: {
		name: "inventory",
		aliases: ["inv"],
		usage: "/inventory",
		category: "Economy",
		description: "Shows your fine inventory",
	},
	run: async (bot, message) => {

		try{
			let user = message.mentions.users.first() || message.author;
			const miner = await Mine.findOne({ userid: user.id });
			if (!miner) {
				message.reply(
					"Dude, you don't have ANYTHING you could just get stuff by mining with /mine..!"
				);
			}
			else {
				let embed = new Discord.RichEmbed()
					.setAuthor(bot.user.username, message.author.displayAvatarURL)
					.setTitle("Inventory")
					.setColor("#36393F")
					.addField(
						"Your Resources:",
						`Coal:**${miner.coal}**\nStone:**${miner.stone}**\nIron:**${miner.iron}**\nDiamond:**${miner.diamond}**\nEmeralds:**${miner.emerald}**\nLapiz:**${miner.lapiz}**`, true)
					.addField(
						"Informations",
						`__**Money**__\n**$${miner.money}**\n__**Pickaxe**__
						**${miner.pickaxe}Pickaxe**\nDurability:**${
	miner.durability !== 0 ? miner.durability : 0
}**\nLuck:**${miner.luck !== 0 ? miner.luck : 0}**\n__**Other**__\nClan:**${miner.clan}**\nXp:**${miner.xp}/${miner.lvl * 50}**\nLevel:**${miner.lvl}**\n`, true)
					.setTimestamp()
					.setFooter(`Requested By: ${message.author.username}`, bot.user.displayAvatarURL);
				if(message.guild.id === "608295769266585620") {
					embed.addField("Special", `Donator **${miner.donator ? "Yes" : "No"}**\nBooster **${miner.boost ? "3x" : "1.5x"}**`, true);
				}
				else{
					embed.addField("Special", `Donator **${miner.donator ? "Yes" : "No"}**\nBooster **${miner.boost ? "1.5x" : "No"}**`, true);
				}

				message.channel.send(embed);
			}
		}
		catch(e) {
			message.reply("Please make sure that I have the following permissions: ADD_REACTIONS, USE_EXTERNAL_EMOJIS, READ_MESSAGES, EMBED_LINKS, SEND_MESSAGES");
		}
	},
};