const { opts: options } = require('../../index.js');

module.exports = {
	name: 'getanimelist',
	description: 'Sends list of anime in database',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	/**
	 *
	 * @param {Object} client
	 * @param {Object} message
	 * @param {Object} author
	 * @param {Object} guild
	 * @param {Object} channel
	 * @param {Array} args
	 * @param {options} opts
	 * @returns
	 */
	run: async (client, message, author, guild, channel, args, opts) => {
		if (!opts.customBot.getManager(author.id))
			return channel.send("You are't allowed to do that");
		return channel.send(opts.GuessAnime.getAnimeList());
	},
};
