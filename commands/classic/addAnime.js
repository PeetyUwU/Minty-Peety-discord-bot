module.exports = {
	name: 'addanime',
	description: 'Adds anime to database',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		if (!opts.customBot.getManager(author.id))
			return channel.send("You are't allowed to do that");
		const filter = (msg) => {
			return msg.author.id == author.id;
		};

		const EndFilter = (msg) => {
			return (
				(msg.author.id == author.id && msg.content == 'yes') ||
				(msg.author.id == author.id && msg.content == 'no')
			);
		};

		const URLFilter = (msg) => {
			try {
				new URL(msg.content);
			} catch {
				return false;
			}
			return msg.author.id == author.id;
		};

		let name;
		let picture;
		let characters = [];
		let characterName;
		let characterPicture;

		let collector = new opts.MessageCollector(channel, {
			filter: filter,
			time: 60000,
			max: 1,
		});
		let msg;
		channel
			.send(`**Enter anime name**`)
			.then((sentMessage) => (msg = sentMessage));

		collector.on('collect', (collected) => {
			name = collected.content;
			msg.delete();
			collected.delete();
		});

		collector.on('end', (collected) => {
			if (collected.size == 0) return;
			let collector = new opts.MessageCollector(channel, {
				filter: URLFilter,
				time: 60000,
				max: 1,
			});
			let msg;
			channel
				.send(`Name set to **${name}**\n**Enter anime picture url**`)
				.then((sentMessage) => (msg = sentMessage));

			collector.on('collect', (collected) => {
				picture = collected.content;
				msg.delete();
				collected.delete();
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

					Embed.setImage(picture);
					let msg;
					channel
						.send({ embeds: [Embed] })
						.then((sentMessage) => (msg = sentMessage));
					let msg2;
					channel
						.send(`**Enter character name or type *0* to exit**`)
						.then((sentMessage) => (msg2 = sentMessage));

					collector.on('collect', (collected) => {
						msg.delete();
						msg2.delete();
						collected.delete();
						if (collected.content == 0) return (stop = true);
						characterName = collected.content;
					});

					collector.on('end', (collected) => {
						if (collected.size == 0) {
							return channel.send('Timed out!!');
						}
						if (stop == true) {
							let collector = new opts.MessageCollector(channel, {
								filter: EndFilter,
								max: 1,
								time: 60000,
							});

							let Embed = new opts.EmbedBuilder({
								color: 0xff0000,
								title: name,
								timestamp: new Date(),
							});
							characters.forEach((ch) => {
								Embed.addFields({
									name: ch.name,
									value: ch.picture,
								});
							});

							Embed.setImage(picture);
							let msg;
							channel
								.send({ embeds: [Embed] })
								.then((sentMessage) => (msg = sentMessage));
							let msg2;
							channel
								.send(
									`**Are you sure you want to add ${name} with ${characters.length} characters? (yes - no)**`
								)
								.then((sentMessage) => (msg2 = sentMessage));

							collector.on('collect', (collected) => {
								collected.delete();
								if (collected.content == 'yes') {
									try {
										opts.GuessAnime.addAnime({
											name,
											characters,
											picture,
										});
									} catch (err) {
										return channel.send(
											`There was an error: ${err}`
										);
									}

									let Embed = new opts.EmbedBuilder({
										color: 0xff0000,
										title: `Adding anime withn name: ${name}`,
										timestamp: new Date(),
									});
									characters.forEach((ch) => {
										Embed.addFields({
											name: ch.name,
											value: ch.picture,
										});
									});

									Embed.setImage(picture);

									return channel.send({ embeds: [Embed] });
								} else if (collected.content == 'no') {
									return channel.send('Canceled!!');
								} else {
									return channel.send('Timed out!!');
								}
							});

							collector.on('end', (collected) => {
								msg.delete();
								msg2.delete();
								if (collected.size == 0)
									return channel.send('Timed out!!');
							});
						} else {
							let collector = new opts.MessageCollector(channel, {
								filter: URLFilter,
								time: 60000,
								max: 1,
							});
							let msg;
							channel
								.send(
									`Character name is **${characterName}**\n**Enter character picture url**`
								)
								.then((sentMessage) => {
									msg = sentMessage;
								});

							collector.on('collect', (collected) => {
								msg.delete();
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
		});
	},
};
