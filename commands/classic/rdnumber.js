module.exports = {
	name: 'rdnumber',
	description: 'Generates random number',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		let number = Math.round(Math.random() * 100);
		channel.send(`Your random number is ${number}`);
	},
};
