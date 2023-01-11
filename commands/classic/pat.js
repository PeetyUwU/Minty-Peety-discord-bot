module.exports = {
	name: 'pat',
	description: 'Pat gif',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		let mention = message.mentions.users.first();
		let descMsg =
			args.length == 0
				? 'is giving headpat to someone'
				: mention.id == author.id
				? 'wants a headpat'
				: mention
				? `is giving headpat to ${mention}`
				: 'err';
		if (descMsg == 'wants a headpat')
			return channel.send(`${author} ${descMsg}`);
		let gif = await opts.aflbClient.sfw.pat();
		let Embed = new opts.EmbedBuilder();
		Embed.setDescription(`${author} ${descMsg}`)
			.setImage(gif)
			.setTimestamp(new Date())
			.setColor(0xff0000);
		channel.send({ embeds: [Embed] });
	},
};
