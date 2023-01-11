module.exports = {
	name: 'stop',
	description: 'Stops music',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		try {
			opts.clientDistube.stop(message);
			channel.send('Stopped playing');
		} catch (err) {
			return channel.send(err);
		}
	},
};
