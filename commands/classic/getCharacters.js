module.exports = {
	name: 'getcharacters',
	description: 'Sends list of',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		if (!opts.customBot.getManager(author.id))
			return channel.send("You are't allowed to do that");
		if (args.length == 0) return channel.send('Please specify anime');
		let anime = args.join(' ');

		let characters;
		try {
			characters = opts.GuessAnime.getAnimeCharacters(anime);
		} catch (err) {
			channel.send(`There was an error: ${err}`);
		}

		channel.send(`Characters from ${anime}: ${characters}`);
	},
};
