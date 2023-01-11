module.exports = {
	name: 'addcharacter',
	description: 'Adds character to database',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		if (!opts.customBot.getManager(author.id))
			return channel.send("You are't allowed to do that");
		const filter = (message, user) => {
			return message.author.id == author.id;
		};

		const URLFilter = (message, user) => {
			try {
				new URL(message.content);
			} catch {
				return false;
			}
			return message.author.id == author.id;
		};

		let name;
		let characters = [];
		let characterName;
		let characterPicture;

		let collector = new opts.MessageCollector(channel, {
			filter: filter,
			time: 60000,
			max: 1,
		});
		let msg1;
		channel.send(`**Enter anime name**`).then((sentMessage) => {
			msg1 = sentMessage;
		});

		collector.on('collect', (collected) => {
			msg1.delete();
			collected.delete();
			name = collected.content;
		});

		collector.on('end', (collected) => {
			if (collected.size == 0) return;

			function characterAnimeAdd() {
				let stop = false;
				let collector = new opts.MessageCollector(channel, {
					filter: filter,
					time: 60000,
					max: 1,
				});

				let Embed = new opts.EmbedBuilder({
					color: 0xff0000,
					title: `Anime name: ${name}`,
					timestamp: new Date(),
				});

				characters.forEach((ch) => {
					Embed.addFields({
						name: ch.name,
						value: ch.picture,
					});
				});

				if (characters.length > 0)
					Embed.setImage(characters[0].picture);

				let msg1;
				channel.send({ embeds: [Embed] }).then((sentMessage) => {
					msg1 = sentMessage;
				});

				let msg2;
				channel
					.send(`**Enter character name or type *0* to exit**`)
					.then((sentMessage) => {
						msg2 = sentMessage;
					});

				collector.on('collect', (collected) => {
					msg1.delete();
					msg2.delete();
					collected.delete();
					if (collected.content == 0) return (stop = true);

					characterName = collected.content;
				});

				collector.on('end', (collected) => {
					if (collected.size == 0) {
						stop = true;
					}
					if (stop == true) {
						if (characters.length == 0)
							return channel.send('Canceled!');

						let Embed = new opts.EmbedBuilder({
							color: 0xff0000,
							title: `Anime name: ${name}`,
							timestamp: new Date(),
						});

						characters.forEach((ch) => {
							Embed.addFields({
								name: ch.name,
								value: ch.picture,
							});
						});

						Embed.setImage(characters[0].picture);

						let msg1;
						channel
							.send({ embeds: [Embed] })
							.then((sentMessage) => {
								msg1 = sentMessage;
							});

						let msg2;
						channel
							.send(
								`**Are you sure you want to add ${characters.length} characters to ${name}? (yes - no)**`
							)
							.then((sentMessage) => (msg2 = sentMessage));

						let collector = new opts.MessageCollector(channel, {
							filter: filter,
							time: 60000,
							max: 1,
						});

						collector.on('collect', (collected) => {
							msg1.delete();
							msg2.delete();
							collected.delete();
							if (collected.content == 'yes') {
								try {
									opts.GuessAnime.addCharacter({
										name,
										characters,
									});
								} catch (err) {
									return channel.send(
										`There was an error: ${err}`
									);
								}

								let Embed = new opts.EmbedBuilder({
									color: 0xff0000,
									title: `Adding ${characters.length} characters to ${name}`,
									timestamp: new Date(),
								});

								characters.forEach((ch) => {
									Embed.addFields({
										name: ch.name,
										value: ch.picture,
									});
								});

								Embed.setImage(characters[0].picture);

								return channel.send({ embeds: [Embed] });
							} else if (collected.content == 'no') {
								return channel.send('Canceled!!');
							} else {
								return channel.send('Timed out!!');
							}
						});

						collector.on('end', (collected) => {
							if (collected.size == 0)
								return channel.send('Timed out!!');
						});
					} else {
						let collector = new opts.MessageCollector(channel, {
							filter: URLFilter,
							time: 60000,
							max: 1,
						});
						let msg1;
						channel
							.send(`**Enter character picture url**`)
							.then((sentMessage) => {
								msg1 = sentMessage;
							});

						collector.on('collect', (collected) => {
							msg1.delete();
							collected.delete();
							characterPicture = collected.content;
						});

						collector.on('end', (collected) => {
							if (collected.size == 0) return;

							characters.push({
								name: characterName,
								picture: characterPicture,
							});

							return characterAnimeAdd();
						});
					}
				});
			}
			characterAnimeAdd();
		});
	},
};
