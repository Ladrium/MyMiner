const Discord = require("discord.js");
const Clan = require("../models/clan");
const Mine = require("../models/mine.js");
module.exports = {
	help: {
		name: "sell",
		aliases: [],
		category: "Economy",
		usage: "/sell <item | all> (item count)",
		description: "Sell your HARD MINED ores... please I wanna build my house...",
	},
	run: async (bot, message, args, ErrorMsg) => {
		try{
			let embed = new Discord.RichEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL)
				.setTitle("Sell")
				.setColor("#36393F");
			const miner = await Mine.findOne({
				userid: message.author.id,
			});
			if (!miner) return message.reply("You can't sell stuff if you don't have anything! Start with m.mine!");
			const clan = await Clan.findOne({ clanname : miner.clan });
			if (!args[0]) {
				embed.addField("How to Sell", "/sell item itemCount or /sell all");
				message.channel.send(embed);
			}
			else if (args[0].toLowerCase() === "all") {
				let money =
              miner.stone * 2 +
              miner.coal * 5 +
              miner.iron * 8 +
              miner.diamond * 10 +
              miner.emerald * 50;
				if(clan) {
					if(clan.clanpremium) money = Math.floor(money * 1.5);
				}
				if(miner.boost) money = Math.floor(money * 1.5);
				miner.stone = 0;
				miner.coal = 0;
				miner.iron = 0;
				miner.diamond = 0;
				miner.emerald = 0;
				miner.lapiz = 0;
				miner.money = miner.money + money;
				embed.addField(
					"Successfully sold all your Ores",
					`**Money gained**:$${money}`
				);
				embed.addField("New Money Count", `$${miner.money}`);
				message.channel.send(embed);
				miner.save().catch(console.error);
			}
			else {
				if (
					![
						"stone",
						"coal",
						"iron",
						"diamond",
						"emerald",
						"lapiz",
					].includes(args[0].toLowerCase())
				) {
					return ErrorMsg(
						"Sell error",
						"You can just sell:stone,coal,iron,diamond,emerald or lapiz"
					);
				}
				let stuff;
				let money;
				if(!args[1]) return message.reply("Please specify an amount to sell!");
				let amount = args[1];
				if (args[0].toLowerCase() === "stone") {
					stuff = miner.stone;
					money = 2;
					if (stuff < amount) {
						return ErrorMsg(
							"Sell error",
							"You cannot sell more than you have!"
						);
					}
					miner.stone -= amount;
				}
				if (args[0].toLowerCase() === "coal") {
					stuff = miner.coal;
					money = 5;
					if (stuff < amount) {
						return ErrorMsg(
							"Sell error",
							"You cannot sell more than you have!"
						);
					}
					miner.coal -= amount;
				}
				if (args[0].toLowerCase() === "iron") {
					stuff = miner.iron;
					money = 8;
					if (stuff < amount) {
						return ErrorMsg(
							"Sell error",
							"You cannot sell more than you have!"
						);
					}
					miner.iron -= amount;
				}
				if (args[0].toLowerCase() === "diamond") {
					stuff = miner.diamond;
					money = 10;
					if (stuff < amount) {
						return ErrorMsg(
							"Sell error",
							"You cannot sell more than you have!"
						);
					}
					miner.diamond -= amount;
				}
				if (args[0].toLowerCase() === "emerald") {
					stuff = miner.emerald;
					money = 50;
					if (stuff < amount) {
						return ErrorMsg(
							"Sell error",
							"You cannot sell more than you have!"
						);
					}
					miner.emerald -= amount;
				}
				if (args[0].toLowerCase() === "lapiz") {
					stuff = miner.lapiz;
					money = 10;
					if (stuff < amount) {
						return ErrorMsg(
							"Sell error",
							"You cannot sell more than you have!"
						);
					}
					miner.lapiz -= amount;
				}
				money *= amount;
				if(message.guild.id === "608295769266585620" && miner.boost) money = Math.floor(money * 3);
				else if(message.guild.id === "608295769266585620" || miner.boost) money = Math.floor(money * 1.5);
				{miner.money += money;}
				miner.save().catch(e => console.log(e));
				message.channel.send(
					`Successfully sold :${amount}x${args[0].toLowerCase()}`
				);
			}
		}
		catch(e) {
			message.reply("Please make sure that I have the following permissions: ADD_REACTIONS, USE_EXTERNAL_EMOJIS, READ_MESSAGES, EMBED_LINKS, SEND_MESSAGES");
		}
	},
};