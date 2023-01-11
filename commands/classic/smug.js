module.exports = {
	name: 'smug',
	description: 'Smug gif',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		let descMsg = 'has a smug look';
		let gif = await opts.aflbClient.sfw.smug();
		let Embed = new opts.EmbedBuilder();
		Embed.setDescription(`${author} ${descMsg}`)
			.setImage(gif)
			.setTimestamp(new Date())
			.setColor(0xff0000);
		channel.send({ embeds: [Embed] });
	},
};
