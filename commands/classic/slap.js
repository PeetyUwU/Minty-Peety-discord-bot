module.exports = {
	name: 'slap',
	description: 'Slap gif',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		let mention = message.mentions.users.first();
		let descMsg =
			args.length == 0
				? 'is slapping someone'
				: mention.id == author.id
				? 'wants to be slapped'
				: mention
				? `is slapping ${mention}`
				: 'err';
		if (descMsg == 'wants to be slapped')
			return channel.send(`${author} ${descMsg}`);
		let gif = await opts.aflbClient.sfw.slap();
		let Embed = new opts.EmbedBuilder();
		Embed.setDescription(`${author} ${descMsg}`)
			.setImage(gif)
			.setTimestamp(new Date())
			.setColor(0xff0000);
		channel.send({ embeds: [Embed] });
	},
};
