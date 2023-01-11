module.exports = {
	name: 'nyanlings',
	description: 'Cash',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	alias: ['cash'],
	run: async (client, message, author, guild, channel, args, opts) => {
		let nyanlings = opts.userManager.getNyanlings(author.id);
		return message.reply(`You have ${nyanlings} Nyanlings🪙`);
	},
};
