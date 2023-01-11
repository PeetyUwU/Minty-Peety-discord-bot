module.exports = {
	name: 'addgif',
	description: 'Adds gif',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		if (!opts.customBot.getManager(author.id)) return console.log(author); //channel.send("You can't do that");
		if (!args) return channel.send('No args');
		let type = args[0];
		let gifURL = args.slice(1);
		if (!type || !gifURL) return channel.send('Missing arg');

		try {
			opts.Gifcmd.addGif({ type, gifURL });
		} catch (err) {
			return channel.send(`There was an error: ${err}`);
		}

		let Embed = new opts.EmbedBuilder();
		Embed.setTitle(`Adding ${type} gif`)
			.setDescription(`${gifURL.join(', ')}`)
			.setImage(gifURL[0])
			.setColor(0xff0000);
		return channel.send({ embeds: [Embed] });
	},
};
