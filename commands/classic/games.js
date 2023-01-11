module.exports = {
	name: 'games',
	description: 'Lists games',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		let list = [];
		opts.userManager.games.forEach((game) => {
			list.push(`**\`${game}\`**`);
		});

		list.join(', ');
		return channel.send(list);
	},
};
