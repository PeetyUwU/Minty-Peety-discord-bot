module.exports = {
	name: 'smile',
	description: 'Smile gif',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		let descMsg = 'is smiling';
		let gif = await opts.aflbClient.sfw.smile();
		let Embed = new opts.EmbedBuilder();
		Embed.setDescription(`${author} ${descMsg}`)
			.setImage(gif)
			.setTimestamp(new Date())
			.setColor(0xff0000);
		channel.send({ embeds: [Embed] });
	},
};
