const { opts: options } = require('../../index.js');

module.exports = {
	name: 'marry',
	description: 'Marry someone',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	/**
	 *
	 * @param {Object} client client
	 * @param {Object} message message object
	 * @param {Object} author message author object
	 * @param {Object} guild guild object
	 * @param {Object} channel channel object
	 * @param {Array} args array of arguments
	 * @param {options} opts options
	 * @returns
	 */
	run: async (client, message, author, guild, channel, args, opts) => {
		let mention = message.mentions.users.first();
		let user = opts.userManager.getUser(author.id);
		let mentionUser = opts.userManager.getUser(mention.id);

		if (!mention) {
			return channel.send('Please mention someone!');
		}
		if (mention.id == author.id) {
			return channel.send("You can't marry yourself");
		}
		if (user.marry) {
			return channel.send('You are already married!');
		}
		if (mentionUser.marry) {
			return channel.send(`${mention} is already married`);
		}

		let reactionMessage = await channel.send(
			`${mention}, will you marry ${author}?`
		);
		const check = '✅';
		const cross = '❌';
		await reactionMessage.react(check);
		await reactionMessage.react(cross);
		const filter = (reaction, user) =>
			(!user.bot &&
				user.id == mention.id &&
				reaction.emoji.name === check) ||
			(!user.bot &&
				user.id == mention.id &&
				reaction.emoji.name === cross);

		const collector = reactionMessage.createReactionCollector({
			filter,
			time: 15000,
			max: 1,
			errors: ['time'],
		});

		collector.on('collect', (reaction, user) => {
			if (reaction.emoji.name == check) {
				opts.userManager.marry(author.id, mention.id);
				channel.send(`${mention} is now married to ${author}`);
			} else if (reaction.emoji.name == cross) {
				channel.send(
					`Sorry but ${mention} doesn't want to marry you, ${author}`
				);
			}
		});
	},
};
