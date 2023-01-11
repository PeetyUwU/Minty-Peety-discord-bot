module.exports = {
	name: 'blush',
	description: 'Blush gif',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		let gif =
			opts.gifs.blush[Math.floor(Math.random() * opts.gifs.blush.length)];
		let Embed = new opts.EmbedBuilder({
			color: 0xff0000,
			description: `${author} blushes`,
			timestamp: new Date(),
		});
		Embed.setImage(gif);
		channel.send({ embeds: [Embed] });
	},
};
