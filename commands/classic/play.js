const { opts: options } = require('../../index.js');

module.exports = {
	name: 'play',
	description: 'Plays music',
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
		let music = args.join(' ');
		if (!message.member.voice.channelId)
			return message.reply('Join vc please');

		opts.clientDistube.play(message.member.voice.channel, music, {
			textChannel: channel,
			member: message.member,
			message,
		});
	},
};
