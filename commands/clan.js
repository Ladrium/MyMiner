/* eslint-disable require-atomic-updates */
const Mine = require("../models/mine");
const Clan = require("../models/clan");
const Discord = require("discord.js");
module.exports = {
	help: {
		name: "clan",
		usage: "view /clan for informations!",
		category: "Economy",
		aliases: [],
	},
	run: async (bot, message, args, ErrorMsg) => {
		try{
			let miner1;
			const miner = await Mine.findOne({
				userid: message.author.id,
			});
			const user2 = message.mentions.users.first();
			if(user2) {
				miner1 = await Mine.findOne({
					userid: user2.id,
				});
			}
			if (!miner) return message.reply("Wait, you didn't even start yet? Write /mine to start ^^!");
			const clan = await Clan.findOne({
				clanname: miner.clan,
			}).catch(console.error);
			const infoembed = new Discord.RichEmbed()
				.setTitle("Clan Commands")
				.setAuthor(message.author.username, bot.user.displayAvatarURL)
				.setColor("#36393F")
				.addField("Create", "use /clan create <name> to create a new clan!(Just works if you aren't in a clan.")
				.addField("Invite", "use /clan invite <user> to invite an user to your clan!")
				.addField("Leave", "use /clan leave to leave your current clan.")
				.addField("Info", "use /clan info to see the information of the current clan!")
				.addField("Lb", "use /clan lb for the clan leaderboard")
				.addField("Premium", "use /clan premium enable/disable to use your donator perks!")
				.addField("Kick", "use /clan kick <user> to kick someone from your clan!")
				.addField("Deposit", "use /clan deposit <money> to deposit a certain amount of money!")
				.addField("Withdraw", "use /clan withdraw <money> to withdraw a certain amount of money!")
				.addField("Your current clan status", `${miner.inclan ? `Joined: \`${miner.clan}\`` : "No Clan"}`);
			if (!args[0]) {
				message.channel.send(infoembed);
				return;
			}
			else if(args[0] === "create") {
				if (!args[1]) return message.reply("Sooo... what's the name gonna be?");
				if (miner.inclan) return message.reply("You already are in a clan xD");
				const clanToCreate = await Clan.findOne({ clanname: args[1] });
				if(clanToCreate) return message.reply("That clan already exists!");
				const newClan = new Clan({
					clanname: args.slice(1).join(" "),
					clanmembers: [message.author.id],
					clanpremium: false,
					clanmoney: 0,
					clanperks: [],
					clanowner: message.author.id,
				});
				miner.inclan = true;
				miner.clan = args.slice(1).join(" ");
				miner.save().catch(console.error);
				message.channel.send(`Created a new clan with the name: \`${args.slice(1).join(" ")}\` `);
				newClan.save().catch(console.error);
			}
			else if(args[0] === "invite") {
				if (!miner.inclan) return message.reply("Uhh, you aren't in a clan yet?");
				if (clan.clanowner !== message.author.id) return message.reply("Only the clan owner can Invite users!");
				if (!miner1) return message.reply("That User hasn't even started yet!");
				if (miner1.inclan) return message.reply("That User is already in a Clan!");
				const invEmbed = new Discord.RichEmbed()
					.setAuthor(message.author.username, bot.user.displayAvatarURL)
					.setTitle("Invite")
					.addField(user2.tag, "React with \"✅\" to accept the invite or with \"❌\" to decline it!");
				const msg = await message.channel.send(invEmbed);
				await msg.react("✅");
				msg.react("❌");
				const filter = (reaction, user) => user.id === user2.id;
				const collector = msg.createReactionCollector(filter, {
					time: 50000,
				});
				collector.on("collect", r => {
					if (r.emoji.name === "✅") {
						message.channel.send("Accepted!");
						miner1.inclan = true;
						miner1.clan = miner.clan;
						clan.clanmembers = [...clan.clanmembers, user2.id];
						collector.stop();
					}
					if (r.emoji.name === "❌") {
						message.channel.send("Declined!");
						collector.stop();
					}
					clan.save().catch(console.error);
					miner1.save().catch(console.error);
				});
				collector.on("end", () => msg.delete());
			}
			else if(args[0] === "leave") {
				if (!miner.inclan) return message.reply("Uhh, you aren't in a clan yet?");
				const msg1 = await message.channel.send("Are you sure you want to leave?");
				const filter1 = (reaction, user) => user.id === message.author.id;
				const collector1 = msg1.createReactionCollector(filter1, {
					time: 50000,
				});
				await msg1.react("✅");
				msg1.react("❌");
				collector1.on("collect", r => {
					if (r.emoji.name === "✅") {
						message.channel.send("Left!");
						clan.clanmembers = clan.clanmembers.filter(x => x !== message.author.id);
						if (miner.userid === clan.clanowner) {
							clan.clanmembers.forEach(async (member) => {
								const cMember = await Mine.findOne({ userid: member });
								cMember.inclan = false;
								cMember.clan = "no";
								cMember.save().catch(console.error);
							});
							miner.inclan = false;
							miner.clan = "no";
							miner.save().catch(console.error);
							clan.remove();
						}
						else{
							miner.inclan = false;
							miner.clan = "no";
							collector1.stop();
							clan.save().catch(console.error);
							miner.save().catch(console.error);
						}
					}
					if (r.emoji.name === "❌") {
						collector1.stop();
					}

				});
			}
			else if(args[0] === "lb") {
				let clans = await Clan.find({});
				clans = clans.sort((a, b) => b.clanmoney - a.clanmoney);
				let page = Math.round(parseInt(args[1])) || 1;
				let perpage = 10;
				let pages = clans.length / 10;
				pages = Math.ceil(pages);
				if (parseInt(args[0]) > pages) {return ErrorMsg("Leaderboard Error", "That is not a valid page number!");}
				let embed = new Discord.RichEmbed()
					.setTitle("Clan Leaderboard")
					.setFooter(`Showing page ${page}, from ${pages} pages`)
					.setColor("#36393F");
				try {
					for (let i = page * perpage - perpage; i < page * perpage; i++) {
						embed.addField(
							`${i + 1 + (page - 1) * 10}. ${clans[i].clanname}`,
							`Clan Money: **${clans[i].clanmoney}**`
						);
					}
				}
				catch (e) {
					1 + 1;
				}
				message.channel.send(embed);
			}
			else if (args[0] === "info") {
				if (!miner.inclan) return message.reply("You aren't in a clan..?");
				let members = clan.clanmembers;
				let memarr = [];
				if (members.length <= 10) {
					members.forEach(x => {
						let user = bot.users.get(x) || "Somebody who left.";
						memarr.push(user.tag);
					});
				}
				else {
					for (let i = 0; i <= 10; i++) {
						let user = bot.users.get(members[i]) || "Somebody who left.";
						memarr.push(user.tag);
					}
				}
				const infembed = new Discord.RichEmbed()
					.setAuthor(message.author.username, bot.user.displayAvatarURL)
					.setTitle(`${clan.clanname}'s Info`)
					.setColor("#36393F")
					.addField("Members", memarr.join(","))
					.addField("Balance", clan.clanmoney)
					.addField("Perks", clan.clanperks.length >= 1 ? clan.clanperks.join(",") : "No Perks")
					.addField("Premium Status", clan.clanpremium)
					.setFooter(`${clan.clanmembers.length} Total Members`)
					.setTimestamp();
				message.channel.send(infembed);
			}
			else if(args[0] === "deposit") {
				if (!miner.inclan) return message.reply("Uhh, you aren't in a clan yet?");
				if (isNaN(args[1])) return message.reply("Uhh, you can just deposit money?");
				if (args[1].includes("-")) return message.reply("You cannot deposit negative amounts!");
				let amount = parseInt(args[1]);
				if (amount > miner.money) return message.reply("Sorry, you can just deposit as much money as you have!");
				miner.money -= amount;
				clan.clanmoney += amount;
				clan.save().catch(console.error);
				miner.save().catch(console.error);
				message.channel.send(`Success!, Your Balance: **${miner.money}**, Clan Balance: **${clan.clanmoney}**.`);
			}
			else if(args[0] === "withdraw") {
				if (!miner.inclan) return message.reply("Uhh, you aren't in a clan yet?");
				if (isNaN(args[1])) return message.reply("Uhh, you can just deposit money?");
				if (args[1].includes("-")) return message.reply("You cannot deposit negative amounts!");
				let amount2 = parseInt(args[1]);
				if (amount2 > clan.clanmoney) return message.reply("Sorry, you can just deposit as much money as you have!");
				miner.money += amount2;
				clan.clanmoney -= amount2;
				clan.save().catch(console.error);
				miner.save().catch(console.error);
				message.channel.send(`Success!, Your Balance: **${miner.money}**, Clan Balance: **${clan.clanmoney}**.`);
			}
			else if(args[0] === "premium") {
				if (!miner.inclan) return message.reply("Uhh, you aren't in a clan yet?");
				if(!clan) return message.reply("Some error occured! please join the support server(link in /status)");
				if (clan.clanowner !== message.author.id) return message.reply("Only the clan owner can Invite users!");
				if(!miner.donator) return message.reply("You can only use this feature if you have the donator rank!");
				if(!args[1]) return message.reply("Do you want to enable or disable premium?(/premium enable/disable");
				if(args[1].toLowerCase() === "enable") {
					clan.clanpremium = true;
					clan.clanperks = [...clan.clanperks, "1.5x Boost"];
					message.reply("Successfully activated premium for the clan!");
				}
				else if(args[1].toLowerCase() === "disable") {
					clan.clanpremium = false;
					message.reply("Successfully disabled premium for the clan!");
				}
				else{
					message.reply("You can just use /premium enable or /premium disable !");
				}
				clan.save().catch(console.error);
			}
			else if(args[0] === "kick") {
				if(!miner1) return message.reply("That user doesn't exist!");
				if(!miner1.inclan) return message.reply("He isn't even in a clan yet!");
				if(user2.id === message.author.id) return message.reply("You cannot kick yourself!");
				if(!clan.clanmembers.includes(user2.id)) return message.reply("That user isnt in your clan!");
				miner1.inclan = false;
				miner1.clan = "no";
				clan.clanmembers = clan.clanmembers.filter(x => x !== user2.id);
				clan.save();
				miner1.save();
				message.channel.send(`Successfully kicked ${user2}`);
			}
			else{
				message.channel.send(infoembed);
			}
		}
		catch(e) {
			message.channel.send("An error occured! Please join the support server (/status)");
			bot.channels.get("580404002097856535").send(e);
		}
	},
};