module.exports = {
	name: 'help',
	description: 'Help command',
	cooldown: 3,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		let Embed = new opts.EmbedBuilder({
			color: 0xff0000,
			title: 'Peety commands',
			thumbnail: { url: 'https://i.imgur.com/qRFFT4T.jpg' },
			fields: [
				{ name: 'Emotes', value: '`blush`, `cry`, `smile`, `smug`' },
				{
					name: '🎭Actions',
					value: '`kiss`, `hug`, `poke`, `cuddle`, `feed`, `baka`, `tickle`, `pat`, `hi`, `tease`, `akick`',
				},
				{ name: '🎵Music', value: '`play`, `queue`, `skip`, `stop`' },
				// { name: '🎭Actions (NSFW)', value: '||`hentai`||,' },
				{ name: '⚙️Moderation', value: '`kick`, `ban`, `clear`' },
				{ name: '🎲Games', value: '`guessanime`,' },
				{ name: '💰Economy', value: '`nyanlings`, `cash`' },
				{
					name: 'Others',
					value: '`marry`, `divorce`, `rdnumber`, `help`',
				},
			],
		});
		channel.send({ embeds: [Embed] });
	},
};
