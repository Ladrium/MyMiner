module.exports = {
	help:{

		name:"shutdown",
		aliases:[],
		category:"Owner",
		usage:"/shutdown",
	},
	run: () => {
		process.exit();
	},
};