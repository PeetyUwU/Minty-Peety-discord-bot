module.exports = {
	name: 'addmanager',
	description: 'Adds bot manager',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		if (opts.customBot.getManager(author.id)) {
			let mention = message.mentions.users.first();
			if (!mention) return channel.send('Please mention someone');

			try {
				opts.customBot.addManager(mention.id);
			} catch (err) {
				return channel.send(err);
			}

			return channel.send(`Added ${mention.tag} as bot manager`);
		} else {
			return channel.send("You can't do that");
		}
	},
};
