module.exports = {
	name: 'hi',
	description: 'Sends hi',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		channel.send(`Hello ${message.author}`);
	},
};
