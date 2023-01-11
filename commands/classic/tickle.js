module.exports = {
	name: 'tickle',
	description: 'Tickle gif',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		let gif = await opts.aflbClient.sfw.tickle();
		let Embed = new opts.EmbedBuilder();
		Embed.setDescription(`${author} tickles ${args.join(' ')}`)
			.setImage(gif)
			.setTimestamp(new Date())
			.setColor(0xff0000);
		channel.send({ embeds: [Embed] });
	},
};
