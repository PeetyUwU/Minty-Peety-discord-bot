module.exports = {
	name: 'skip',
	description: 'Skips song',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		opts.clientDistube.skip(message);
	},
};
