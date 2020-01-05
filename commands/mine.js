/* eslint-disable no-inner-declarations */
const Discord = require("discord.js");
const Miner = require("../models/mine.js");
const ms = require("ms");
Array.prototype.random = function(count) {
	let arr = this;
	if (count === undefined) return arr[Math.floor(Math.random() * arr.length)];
	if (typeof count !== "number") throw new TypeError("The count must be a number.");
	if (!Number.isInteger(count) || count < 1) throw new RangeError("The count must be an integer greater than 0.");
	if (arr.length === 0) return [];
	const rand = new Array(count);
	arr = arr.slice();
	for (let i = 0; i < count; i++) rand[i] = arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
	return rand;
};
module.exports = {
	help: {
		name: "mine",
		aliases: ["farm"],
		usage: "/mine 1, 2 or 3",
		category: "Economy",
		description: "Mine some stone u n00b",
	},
	run: async (bot, message, args) => {
		try{
			const miner = await Miner.findOne({ userid: message.author.id });
			if (!miner) {
				const newMine = new Miner({
					userid: message.author.id,
					minecooldown: 0,
					pickaxe: "Wood",
					durability: 20,
					luck: 0,
					money: 0,
					coal: 0,
					stone: 0,
					iron: 0,
					diamond: 0,
					emerald: 0,
					lapiz: 0,
					boost: false,
					xp: 0,
					lvl: 0,
					donator: false,
					clan: "no",
					inclan: false,
				});
				newMine.save().catch((e) => console.log(e));
				return message.reply("Sorry, I just had to create a chest for you... Why didn't you do it yourself..?");
			}
			else{
				const stone = bot.emojis.get("601426580530790401");
				const coal = bot.emojis.get("601426594111946762");
				const diamond = bot.emojis.get("601426625699119105");
				const emerald = bot.emojis.get("607130255089467412");
				const lapiz = bot.emojis.get("601426754783019008");
				const iron = bot.emojis.get("606801983877152768");
				const ores = {
					stone,
					coal,
					diamond,
					emerald,
					lapiz,
					iron,
				};
				const loot1 = ["stone", "coal", "iron"];
				const loot2 = [...loot1, "lapiz"];
				const loot3 = [...loot2, "emerald", "diamond"];
				const cooldown = 5000;
				const embed = new Discord.RichEmbed()
					.setAuthor(message.author.username, message.author.displayAvatarURL)
					.setTitle("Mine")
					.setImage("https://cdn.glitch.com/d61d8672-0d72-4133-ba8f-a4c2419fea0b%2Fminergif1.gif?v=1561049643501")
					.setColor("#36393F");
				function random(number) {
					return Math.floor(Math.random() * number);
				}
				function Mine(minelevel) {
					if(miner.durability <= 0) return message.reply("uhh, your pickaxe broke! Buy a new one..");
					let loot;
					if(minelevel === 1) {
						loot = loot1.random(2);
						if(["iron", "stone", "diamond"].includes(miner.pickaxe.toLowerCase())) {
							loot = loot1.random(2);
						}
						else if(miner.pickaxe.toLowerCase() === "donator") {
							loot = loot1;
						}
					}
					else if(minelevel === 2) {
						if(["wood", "stone"].includes(miner.pickaxe.toLowerCase())) return message.reply("You need ATLEAST an iron pickaxe for this!");
						loot = loot2.random(2);
						if(["diamond", "donator"].includes(miner.pickaxe)) {
							loot = loot1.random(3);
						}

					}
					else if(minelevel === 3) {
						if(["wood", "stone"].includes(miner.pickaxe.toLowerCase())) return message.reply("You need ATLEAST a diamond pickaxe for this!");
						loot = loot3.random(3);
						if(miner.pickaxe.toLowerCase() === "donator") {
							loot = loot3.random(4);
						}
					}
					const itemarr = [];
					if(Array.isArray(loot)) {
						loot.forEach(x => {
							const amn = random(15);
							miner[x] += amn;
							const items = x.replace(x, ores[x]);
							itemarr.push(`${items}x${amn}`);
						});
					}
					miner.xp += random(20);
					if(miner.xp >= miner.lvl * 50) {
						miner.lvl += 1;
						miner.xp = 0;
					}
					miner.durability -= 1;
					embed.addField("You Mined", itemarr.join("\n"));
					message.channel.send(embed);
					miner.minecooldown = Date.now();
					miner.save();
				}

				if (miner.minecooldown !== null && cooldown - (Date.now() - miner.minecooldown) > 0) {
					const timeObj = ms(cooldown - (Date.now() - miner.minecooldown));
					const minecooldownembed = new Discord.RichEmbed()
						.setAuthor("Next Mining Tour")
						.setColor("#ff0000")
						.setDescription(
							`You mined way too much for now.. You are so exhausted.. you can mine again in: **${timeObj}**!`
						)
						.setFooter("Requested By " + message.author.tag, message.author.avatarURL);
					message.channel.send(minecooldownembed);
				}
				else if(!args[0]) {
					message.channel.send("You can use the following difficulties: /mine 1, /mine 2, /mine 3");
				}
				else if(args[0] == 1) {Mine(1);}
				else if (args[0] == 2) {Mine(2);}
				else if(args[0] == 3) {Mine(3);}
				else {Mine(1);}
			}
		}
		catch(e) {
			message.reply("Please make sure that I have the following permissions: ADD_REACTIONS, USE_EXTERNAL_EMOJIS, READ_MESSAGES, EMBED_LINKS, SEND_MESSAGES");
		}
	},
};
