const Discord = require("discord.js");
const Mine = require("../models/mine.js");
module.exports = {
	help: {
		name: "buy",
		aliases: [],
		category: "Economy",
		usage: "/buy <Item>",
		description: "buy something for your gf",
	},
	run:  (bot, message, args, ErrorMsg) => {
		Mine.findOne(
			{
				userid: message.author.id,
			},
			(err, miner) => {
				if (err) console.log(err);
				let embed = new Discord.RichEmbed()
					.setTitle("Buy")
					.setAuthor(message.author.username, message.author.displayAvatarURL)
					.setColor("#36393F")
					.setTimestamp();
				if (!miner) {
					return message.reply(
						"lol, how do you want to buy anything without having even started yet xd?"
					);
				}
				if (!args[0]) {
					return ErrorMsg(
						"Please provide something to buy!",
						"If you want to see the items view /shop !"
					);
				}
				switch (args[0].toLowerCase()) {
				case "wood":
					if (miner.money < 10) {
						return ErrorMsg(
							"Money Error",
							"Sorry, you don't have enough Money!"
						);
					}
					miner.pickaxe = "Wood";
					miner.money = miner.money - 10;
					embed.addField(
						"Success!",
						"you successfully bought a wood pickaxe!"
					);
					message.channel.send(embed);
					miner.durability = 20;
					break;
				case "stone":
					if (miner.money < 500) {
						return ErrorMsg(
							"Money Error",
							"Sorry, you don't have enough Money!"
						);
					}
					miner.pickaxe = "Stone";
					miner.money = miner.money - 500;
					embed.addField(
						"Success!",
						"you successfully bought a stone pickaxe!"
					);
					message.channel.send(embed);
					miner.durability = 30;
					break;
				case "iron":
					if (miner.money < 5000) {
						return ErrorMsg(
							"Money Error",
							"Sorry, you don't have enough Money!"
						);
					}
					miner.pickaxe = "Iron";
					miner.money = miner.money - 5000;
					embed.addField(
						"Success!",
						"you successfully bought a iron pickaxe!"
					);
					message.channel.send(embed);
					miner.durability = 50;

					break;
				case "diamond":
					if (miner.money < 20000) {
						return ErrorMsg(
							"Money Error",
							"Sorry, you don't have enough Money!"
						);
					}
					miner.pickaxe = "Diamond";
					miner.money = miner.money - 20000;
					miner.durability = 80;
					embed.addField(
						"Success!",
						"you successfully bought a diamond pickaxe!"
					);
					message.channel.send(embed);
					break;
				case "obsidian":
					if (miner.money < 200000) {
						return ErrorMsg(
							"Money Error",
							"Sorry, you don't have enough Money!"
						);
					}
					miner.pickaxe = "Obsidian";
					miner.money = miner.money - 200000;
					miner.durability = 200;
					embed.addField(
						"Success!",
						"you successfully bought a obsidian pickaxe!"
					);
					break;
				}
				miner.luck = 0;
				miner.save().catch(e => console.log(e));
			}
		);
	},
};
