module.exports = {
	name: 'invitelink',
	description: 'Invite link',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		return channel.send(inviteLink);
	},
};
