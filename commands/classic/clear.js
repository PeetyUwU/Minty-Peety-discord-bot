module.exports = {
	name: 'clear',
	description: 'Clears messages',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		if (args.length <= 0) return channel.send('Example: m!clear 100');
		if (isNaN(args[0])) return channel.send('Please enter a number');
		if (parseInt(args[0]) <= 0 || parseInt(args[0]) > 100)
			return channel.send('Please enter number between 0 and 100');
		if (!message.member.permissions.has('MANAGE_MESSAGES'))
			return channel.send("U can't do that");
		channel.bulkDelete(Math.floor(args[0]));
	},
};
