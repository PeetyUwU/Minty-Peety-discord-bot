module.exports = {
	name: 'akick',
	description: 'Anime kick gif',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		let mention = message.mentions.users.first();
		let descMsg =
			args.length == 0
				? 'is kicking someone'
				: mention.id == author.id
				? `<@${client.user.id}> kicks <@${author.id}>`
				: mention
				? `kicks ${mention}`
				: 'err';
		let gif =
			opts.gifs.kick[Math.floor(Math.random() * opts.gifs.kick.length)];
		if (descMsg == `<@${client.user.id}> kicks <@${author.id}>`) {
			let Embed = new opts.EmbedBuilder();
			Embed.setDescription(`${descMsg}`)
				.setImage(gif)
				.setTimestamp(new Date())
				.setColor(0xff0000);
			return channel.send({ embeds: [Embed] });
		}
		let Embed = new opts.EmbedBuilder();
		Embed.setDescription(`${author} ${descMsg}`)
			.setImage(gif)
			.setTimestamp(new Date())
			.setColor(0xff0000);
		return channel.send({ embeds: [Embed] });
	},
};
