module.exports = {
	name: 'cuddle',
	description: 'Cuddle gif',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		let gif = await opts.aflbClient.sfw.cuddle();
		let Embed = new opts.EmbedBuilder();
		Embed.setDescription(`${author} cuddles ${args.join(' ')}`)
			.setImage(gif)
			.setTimestamp(new Date())
			.setColor(0xff0000);
		channel.send({ embeds: [Embed] });
	},
};
