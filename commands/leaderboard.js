const Discord = require("discord.js");
const Mine = require("../models/mine.js");
module.exports.run = async (bot, message, args, ErrorMsg) => {
	try{
		let users = await Mine.find({});
		users = users.sort((a, b) => b.money - a.money);
		const page = Math.round(parseInt(args[0])) || 1;
		const perpage = 10;
		let pages = users.length / 10;
		pages = Math.ceil(pages);
		if (parseInt(args[0]) > pages) return ErrorMsg("Leaderboard Error", "That is not a valid page number!");
		const embed = new Discord.RichEmbed()
			.setTitle("Money Leaderboard")
			.setFooter(`Showing page ${page}, from ${pages} pages`)
			.setColor("#36393F");
		try {
			for (let i = page * perpage - perpage; i < page * perpage; i++) {
				const user = bot.users.get(users[i].userid) ?
					bot.users.get(users[i].userid).username :
					"Somebody who left";
				embed.addField(
					`${i + 1 + (page - 1) * 10}. ${user}`,
					`Money: **${users[i].money}**, Pickaxe: **${users[i].pickaxe}**`
				);
			}
		}
		catch (_) {
			void null;
		}
		message.channel.send(embed);
	}
	catch(e) {
		message.reply("Please make sure that I have the following permissions: ADD_REACTIONS, USE_EXTERNAL_EMOJIS, READ_MESSAGES, EMBED_LINKS, SEND_MESSAGES");
	}
};
module.exports.help = {
	name: "leaderboard",
	aliases: ["lb"],
	category: "Economy",
	usage: "/lb",
};