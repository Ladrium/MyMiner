const Discord = require("discord.js");

module.exports.run = (bot, message) => {
	try{
		const guilds = bot.guilds.size.toLocaleString();
		const users = bot.guilds.reduce((acc, val) => acc + val.memberCount, 0);
		const channels = bot.channels.size.toLocaleString();
		const ping = Math.round(bot.ping);

		const u = convertMS(bot.uptime);
		const duration = `${u.d}days : ${u.h}hours : ${u.m}minutes : ${u.s}seconds`;
		const statembed = new Discord.RichEmbed()
			.setAuthor("Stats / Informations", bot.user.displayAvatarURL)
			.setColor("#36393F")
			.addField("General", `Guilds:**${guilds}**\nChannels:**${channels}**\nUsers:**${users}**`)
			.addField(
				"System",
				`
			Ping: **${ping}**
			`,
				true
			)
			.addField(
				"Links",
				`
		__**[Our Server](https://discord.gg/8F47kqe)**__
		__**[Invite](http://bit.ly/myminerbot)**__
		  `, true)
			.addField("Status", "Database: **Connected**\nBot: **Online**")
			.setFooter(`Bot Uptime: ${duration}`);
		message.channel.send(statembed).catch(() =>
			message.reply("Please make sure that I have the following permissions: ADD_REACTIONS, USE_EXTERNAL_EMOJIS, READ_MESSAGES, EMBED_LINKS, SEND_MESSAGES")
		);
	}
	catch(_) {
		message.reply("Please make sure that I have the following permissions: ADD_REACTIONS, USE_EXTERNAL_EMOJIS, READ_MESSAGES, EMBED_LINKS, SEND_MESSAGES");
	}
};
module.exports.help = {
	name: "status",
	aliases: [],
	usage: "/status",
	category: "Util",
};
function convertMS(ms) {
	let d, h, m, s;
	s = Math.floor(ms / 1000);
	m = Math.floor(s / 60);
	s = s % 60;
	h = Math.floor(m / 60);
	m = m % 60;
	d = Math.floor(h / 24);
	h = h % 24;
	return {
		d: d,
		h: h,
		m: m,
		s: s,
	};
}
