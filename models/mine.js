const mongoose = require("mongoose");

const mineS = mongoose.Schema({
	userid: String,
	minecooldown: Number,
	pickaxe: String,
	durability: Number,
	luck: Number,
	money: Number,
	coal: Number,
	stone: Number,
	iron: Number,
	diamond: Number,
	emerald: Number,
	lapiz: Number,
	boost: Boolean,
	lastboost: Number,
	xp: Number,
	lvl: Number,
	donator: Boolean,
	clan: String,
	inclan: Boolean,
});

module.exports = mongoose.model("mine", mineS);