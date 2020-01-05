const mongoose = require("mongoose");
const Clan = new mongoose.Schema({
	clanname: String,
	clanmembers: Array,
	clanpremium: Boolean,
	clanmoney: Number,
	clanperks: Array,
	clanowner: String,
});
module.exports = mongoose.model("Clans", Clan);