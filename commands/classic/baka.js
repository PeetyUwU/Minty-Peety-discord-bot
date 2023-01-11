module.exports = {
	name: 'baka',
	description: 'Baka gif',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		let gif = await opts.aflbClient.sfw.baka();
		let Embed = new opts.EmbedBuilder();
		Embed.setDescription(
			`${args.length == 0 ? author : args.join(' ')} is baka`
		)
			.setImage(gif)
			.setTimestamp(new Date())
			.setColor(0xff0000);
		channel.send({ embeds: [Embed] });
	},
};
