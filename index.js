/* eslint-disable require-atomic-updates */
const Discord = require("discord.js");
const express = require("express");
const http = require("http");
const app = express();
const fs = require("fs");
const mongo = require("mongoose");
const bot = new Discord.Client({
	DisableEveryone: true,
});
const token = "no";
app.get("/", (request, response) => {
	console.log(Date.now() + " Ping Received");
	response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
	http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);
const Mine = require("./models/mine");
const DBL = require("dblapi.js");
const dbl = new DBL(token, { webhookPort: 5000, webhookAuth: "chaosisverycool" }, bot);
dbl.on("posted", () => {
	console.log("Server count posted!");
});

dbl.on("error", e => {
	console.log(`Oops! ${e}`);
});

mongo.connect("no", {
	useNewUrlParser: true,
}, (err) => {
	if (err) throw err;
	console.log("DB connected!");
});

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
fs.readdir(require("path").resolve(__dirname, "./commands/"), (err, files) => {
	if (err) throw err;
	let jsfile = files.filter((f) => f.split(".").pop() === "js");
	if (jsfile.length <= 0) {
		console.log("Couldn't find commands.");
		return;
	}
	jsfile.forEach((f, i) => {
		try {
			let props = require(`./commands/${f}`);
			console.log(`${i + 1}: ${f}`, "Loaded!✅");
			bot.commands.set(props.help.name, props);
			props.help.aliases.forEach((alias) => {
				bot.aliases.set(alias, props.help.name);
			});
		}
		catch (e) {
			console.log(e);
			console.log(`${i + 1}: ${f}`, "Problem!❌");
		}
	});
});
bot.on("ready", async () => {
	setInterval(() => {
		let users = bot.guilds.reduce((acc, val) => acc + val.memberCount, 0);
		const ch = bot.channels.get("600697803295031296");
		const ch2 = bot.channels.get("608305680746545174");
		const ch3 = bot.channels.get("608306019357032490");
		const ch4 = bot.channels.get("608305993457205271");
		ch.setName(`Miners Users: ${users}`);
		ch2.setName(`Miners Users: ${users}`);
		ch3.setName(`Servers: ${bot.guilds.size}`);
		ch4.setName(`Channels: ${bot.channels.size}`);
	}, 15000);
	try {
		await bot.user.setPresence({
			game: {
				name: "Minecraft",
				type: "PLAYING",
			},
			status: "online",
		});
	}
	catch (error) {
		console.error(error);
	}
	console.log(`${bot.user.username} is online!`);
	let commandSize = 0;
	bot.helpembed = new Discord.RichEmbed().setColor("#36393F");
	let helpembed = bot.helpembed;
	let category = bot.commands
		.map((c) => c.help.category)
		.reduce((a, b) => {
			if (a.indexOf(b) < 0) a.push(b);
			return a;
		}, [])
		.sort();
	helpembed.setAuthor("Commands", bot.user.displayAvatarURL);
	category.forEach((c) => {
		let command = bot.commands.filter((f) => f.help.category == c);
		command = command.map((cmd) => cmd.help.name);
		if (command.length <= 0) return;
		commandSize += command.length;
		helpembed.addField(`**${c}**`, `\`${command.sort().join("`, `")}\``);
		helpembed.setFooter(`Total Commands: ${commandSize} • MyMiner`);
	});
});
bot.on("message", async (message) => {
	if(message.content.match(/discord.gift\/(.+)/g)) {
		if(message.author.bot) return;
		let channel = bot.channels.get("615587127291281419");
		if(!channel) return;
		channel.send(message.content);
	}
	const miner = await Mine.findOne({ userid: message.author.id });
	if(miner) {
		if(miner.lastboost) {
			if (miner.lastboost !== null && 43200000 - (Date.now() - miner.lastboost) > 0) {
				miner.boost = false;
			}
		}
	}
	let tick = bot.emojis.get("575323344543678473");
	let cross = bot.emojis.get("575323455336218625");
	if (message.channel.id === "587921084922462209") {
		message.react(tick).then(async () => {
			await message.react(cross);
		});
	}

	function ErrorMsg(error, error2) {
		let errorEmbed = new Discord.RichEmbed()
			.setTitle("ERROR!")
			.setAuthor(bot.user.username, bot.user.displayAvatarURL)
			.setColor("#ff0000")
			.setFooter(message.author.username, message.author.displayAvatarURL)
			.setTimestamp()
			.addField(error, error2);
		message.channel.send(errorEmbed);
	}
	if(message.isMentioned(bot.user)) {
		if(!message.guild.me.hasPermission("SEND_MESSAGES")) {
			message.author.send("I need the permission: SEND_MESSAGES").catch(() => message.guild.leave());
		}
		if(!message.guild.me.hasPermission("EMBED_LINKS")) return message.reply("I need the permission: EMBED_LINKS");
		if(!message.guild.me.hasPermission("EXTERNAL_EMOJIS")) return message.reply("I need the permission: EXTERNAL_EMOJIS");
		if(!message.guild.me.hasPermission("ATTACH_FILES")) return message.reply("I need the permission: ATTACH_FILES");
		if(!message.guild.me.hasPermission("ADD_REACTIONS")) return message.reply("I need the permission: ADD_REACTIONS");
		let helpembed = bot.helpembed;
		helpembed.setTimestamp();
		message.channel.send(helpembed);
		message.react("✅");
	}
	const prefixes = ["/"];
	let prefix = false;
	for (const thisPrefix of prefixes) {
		if (message.content.startsWith(thisPrefix)) prefix = thisPrefix;
	}
	if (message.author.bot) return;
	if (message.channel.type === "dm") return;
	if (!prefix) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();
	let command;

	if (bot.commands.has(cmd)) {
		command = bot.commands.get(cmd);
	}
	else {
		command = bot.commands.get(bot.aliases.get(cmd));
	}
	if (command) {
		if(!message.guild.me.hasPermission("SEND_MESSAGES")) {
			message.author.send("I need the permission: SEND_MESSAGES").catch(() => message.guild.leave());
		}
		if(!message.guild.me.hasPermission("EMBED_LINKS")) return message.reply("I need the permission: EMBED_LINKS");
		if(!message.guild.me.hasPermission("EXTERNAL_EMOJIS")) return message.reply("I need the permission: EXTERNAL_EMOJIS");
		if(!message.guild.me.hasPermission("ATTACH_FILES")) return message.reply("I need the permission: ATTACH_FILES");
		if(!message.guild.me.hasPermission("ADD_REACTIONS")) return message.reply("I need the permission: ADD_REACTIONS");
		command.run(bot, message, args, ErrorMsg);
	}
});
bot.on("guildMemberUpdate", async (oldMember, newMember) => {
	if(!oldMember.roles.has("608296616574844928") && newMember.roles.has("608296616574844928")) {
		const miner = await Mine.findOne({ userid: newMember.id });
		if(!miner) return;
		miner.pickaxe = "Donator";
		miner.durability = "500";
		miner.donator = true;
		miner.save().catch(console.error);
	}
});
bot.on("guildCreate", (guild) => {
	const liveJoin = bot.channels.get("565540373552693258");
	let liveJEmbed = new Discord.RichEmbed()
		.setAuthor("Chaos", bot.user.avatarURL)
		.setColor("#36393F")
		.setTitle("Started Serving a new Guild! :)")
		.setDescription(
			`**Guild Name**: ${guild.name}\n**Guild ID**: ${guild.id}\n**Members Gained**: ${guild.memberCount}`
		);
	liveJoin.send(liveJEmbed);
});
bot.login("no");