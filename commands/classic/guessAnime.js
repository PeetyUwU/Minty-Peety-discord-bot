module.exports = {
	name: 'guessanime',
	description: 'Mini-game guess anime',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		let anime = opts.GuessAnime.getRandomAnime();

		if (anime.gameType == 'Guess anime by picture') {
			const filter = (message, user) => {
				let array1 = message.content.trim().toLowerCase().split(' ');
				let array2 = anime.name.trim().toLowerCase().split(' ');

				array1 = array1.filter((element) => {
					return element !== '' && element !== ' ';
				});

				array2 = array2.filter((element) => {
					return element != '' && element != ' ';
				});

				array1.sort();
				array2.sort();

				let sortedString1 = array1.join(' ');
				let sortedString2 = array2.join(' ');

				if (sortedString1 == sortedString2) return true;
				else return false;
			};

			let Embed = new opts.EmbedBuilder({
				color: 0xff0000,
				title: 'Guess the anime',
				description: 'You have 20 seconds to guess the anime!',
				fields: [
					{
						name: 'Anime list: ',
						value: opts.GuessAnime.getAnimeList(),
					},
				],
			});
			Embed.setImage(anime.picture);
			channel.send({ embeds: [Embed] });

			let collector = new opts.MessageCollector(channel, {
				filter: filter,
				time: 20000,
				max: 1,
			});

			collector.on('collect', (collected) => {
				let count = opts.userManager.addNyanlings(
					collected.author.id,
					'guessAnime'
				);
				channel.send(
					`${collected.author} has won! Adding \`${count}\` nyanlings🪙`
				);
			});

			collector.on('end', (collected) => {
				if (collected.size == 0)
					return channel.send(
						`No-one won! The anime was ${anime.name}`
					);
			});
		} else if (anime.gameType == 'Guess character by picture') {
			const filter = (message, user) => {
				let array1 = message.content.trim().toLowerCase().split(' ');
				let array2 = anime.character.name
					.trim()
					.toLowerCase()
					.split(' ');

				array1 = array1.filter((element) => {
					return element !== '' && element !== ' ';
				});

				array2 = array2.filter((element) => {
					return element != '' && element != ' ';
				});

				array1.sort();
				array2.sort();

				let sortedString1 = array1.join(' ');
				let sortedString2 = array2.join(' ');

				if (sortedString1 == sortedString2) return true;
				else return false;
			};

			let Embed = new opts.EmbedBuilder({
				color: 0xff0000,
				title: `Guess the character from ${anime.name}`,
				description: 'You have 20 seconds to guess the anime!',
				fields: [
					{
						name: 'Character list: ',
						value: opts.GuessAnime.getAnimeCharacters(anime.name),
					},
				],
			});
			Embed.setImage(anime.character.picture);
			channel.send({ embeds: [Embed] });
			let collector = new opts.MessageCollector(channel, {
				filter: filter,
				time: 20000,
				max: 1,
			});

			collector.on('collect', (collected) => {
				let count = opts.userManager.addNyanlings(
					collected.author.id,
					'guessAnime'
				);
				channel.send(
					`${collected.author} has won! Adding \`${count}\` nyanlings🪙`
				);
			});

			collector.on('end', (collected) => {
				if (collected.size == 0)
					return channel.send(
						`No-one won! The character was ${anime.character.name}`
					);
			});
		}
	},
};
