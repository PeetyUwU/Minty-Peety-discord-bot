module.exports = {
	name: 'tease',
	description: 'Tease gif',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		let gif = await opts.aflbClient.sfw.tease();
		let Embed = new opts.EmbedBuilder();
		Embed.setDescription(`${author} teases ${args.join(' ')}`)
			.setImage(gif)
			.setTimestamp(new Date())
			.setColor(0xff0000);
		channel.send({ embeds: [Embed] });
	},
};
