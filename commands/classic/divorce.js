const { opts: options } = require('../../index.js');

module.exports = {
	name: 'divorce',
	description: '',
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
		let user;
		try {
			user = opts.userManager.divorce(author.id);
			if (user == false) {
				return channel.send('You are not married!');
			}
		} catch (err) {
			channel.send(`There was error: ${err}`);
			console.log(err);
		}

		channel.send(`U divorced with <@${user}>`);
	},
};
