module.exports = {
	name: 'kiss',
	description: 'Kiss gif',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		let mention = message.mentions.users.first();
		let descMsg =
			args.length == 0
				? 'is kissing someone'
				: mention.id == author.id
				? 'wants a kiss'
				: mention
				? `is kissing ${mention}`
				: 'err';
		if (descMsg == 'wants a kiss')
			return channel.send(`${author} ${descMsg}`);
		let gif = await opts.aflbClient.sfw.kiss();
		let Embed = new opts.EmbedBuilder();
		Embed.setDescription(`${author} ${descMsg}`)
			.setImage(gif)
			.setTimestamp(new Date())
			.setColor(0xff0000);
		channel.send({ embeds: [Embed] });
	},
};
