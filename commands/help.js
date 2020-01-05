module.exports.run = (bot, message) => {
	let helpembed = bot.helpembed;
	helpembed.setTimestamp();
	message.channel.send(helpembed);
	message.react("✅");
};
module.exports.help = {
	name:"help",
	aliases:["h"],
	category:"Util",
	usage:"/help",
};