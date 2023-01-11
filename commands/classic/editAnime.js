module.exports = {
	name: 'editanime',
	description: 'Edits anime from database',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		if (!opts.customBot.getManager(author.id))
			return channel.send("You are't allowed to do that");

		const filter = (message, user) => {
			return message.author.id == author.id;
		};

		const filterAnimeName = (message, user) => {
			if (
				message.author.id == author.id &&
				opts.GuessAnime.getAnime(message.content)
			) {
				anime = opts.GuessAnime.getAnime(message.content);
				return true;
			} else return false;
		};
		const EndFilter = (msg) => {
			return (
				(msg.author.id == author.id && msg.content == 'yes') ||
				(msg.author.id == author.id && msg.content == 'no')
			);
		};

		const URLFilter = (message, user) => {
			try {
				new URL(message.content);
			} catch {
				return false;
			}
			return message.author.id == author.id;
		};

		let charChange = 0;

		let collector = new opts.MessageCollector(channel, {
			filter: filterAnimeName,
			time: 60000,
			max: 1,
		});
		let msg;
		channel
			.send(`**Enter name of the anime you want to change**`)
			.then((sentMessage) => (msg = sentMessage));

		let changeName;
		let anime;
		collector.on('collect', (collected) => {
			collected.delete();
			msg.delete();
			console.log(collected.content);
			changeName = collected.content;
		});

		collector.on('end', (collected) => {
			let collector = new opts.MessageCollector(channel, {
				filter: filter,
				time: 60000,
				max: 1,
			});
			let Embed = new opts.EmbedBuilder({
				color: 0xff0000,
				title: `Anime name: ${anime.name}`,
				timestamp: new Date(),
			});

			anime.characters.forEach((ch) => {
				Embed.addFields({
					name: ch.name,
					value: ch.picture,
				});
			});

			Embed.setImage(anime.picture);

			let msg;
			channel
				.send({ embeds: [Embed] })
				.then((sentMessage) => (msg = sentMessage));
			let msg2;
			channel
				.send(
					`**Enter new anime name, 0 to leave it as it is or "exit"**`
				)
				.then((sentMessage) => (msg2 = sentMessage));

			let stop = false;
			collector.on('collect', (collected) => {
				msg.delete();
				msg2.delete();
				collected.delete();
				if (collected.content == 'exit') {
					stop = true;
					return channel.send('Canceling!!');
				}
				if (collected.content != 0) {
					anime.name = collected.content;
				}
			});

			collector.on('end', (collected) => {
				if (stop == true) return;
				if (collected.size == 0) return channel.send('Timed out');

				let collector = new opts.MessageCollector(channel, {
					filter: filter,
					time: 60000,
					max: 1,
				});

				let Embed = new opts.EmbedBuilder({
					color: 0xff0000,
					title: `Anime name: ${anime.name}`,
					timestamp: new Date(),
				});

				anime.characters.forEach((ch) => {
					Embed.addFields({
						name: ch.name,
						value: ch.picture,
					});
				});

				Embed.setImage(anime.picture);

				let msg;
				channel
					.send({ embeds: [Embed] })
					.then((sentMessage) => (msg = sentMessage));

				let msg2;
				channel
					.send(
						`**Enter new anime picture URL, 0 to leave it as it is or "exit"**`
					)
					.then((sentMessage) => (msg2 = sentMessage));

				let stop2 = false;
				collector.on('collect', (collected) => {
					msg.delete();
					msg2.delete();
					collected.delete();
					if (collected.content == 'exit') {
						stop2 = true;
						return channel.send('Canceling!!');
					}
					if (collected.content != 0) {
						try {
							new URL(collected.content);
						} catch (err) {
							return channel.send(`There was an error: ${err}`);
						}
						anime.picture = collected.content;
					}
				});

				collector.on('end', (collected) => {
					if (stop2 == true) return;
					if (collected.size == 0) return channel.send('Timed out');

					function changeCharacter() {
						let collector = new opts.MessageCollector(channel, {
							filter: filter,
							time: 60000,
							max: 1,
						});
						let characters = [];
						anime.characters.forEach((ch) => {
							characters.push(ch.name);
						});

						let Embed = new opts.EmbedBuilder({
							color: 0xff0000,
							title: `Anime name: ${anime.name}`,
							timestamp: new Date(),
						});

						anime.characters.forEach((ch) => {
							Embed.addFields({
								name: ch.name,
								value: ch.picture,
							});
						});

						Embed.setImage(anime.picture);

						let msg;
						channel
							.send({ embeds: [Embed] })
							.then((sentMessage) => (msg = sentMessage));

						let msg2;
						channel
							.send(
								`**What character do you want to edit? 0 to exit\n \`${characters.join(
									', '
								)}\`**`
							)
							.then((sentMessage) => (msg2 = sentMessage));

						let stop3 = false;
						let exit = false;
						let character;
						collector.on('collect', (collected) => {
							msg.delete();
							msg2.delete();
							collected.delete();
							if (collected.content == 0) {
								stop3 = true;
								return;
							}

							let charFound = false;
							anime.characters.forEach((ch) => {
								let array1 = ch.name
									.trim()
									.toLowerCase()
									.split(' ');
								let array2 = collected.content
									.trim()
									.toLowerCase()
									.split(' ');

								array1 = array1.filter((element) => {
									return element !== '' && element !== ' ';
								});
								array2 = array2.filter((element) => {
									return element !== '' && element !== ' ';
								});

								array1.sort();
								array2.sort();

								let sortedString1 = array1.join(' ');
								let sortedString2 = array2.join(' ');

								if (sortedString1 == sortedString2) {
									charFound = true;
									character = ch;
									return;
								}
							});

							if (charFound == false) {
								let msg;
								channel
									.send(
										"Didn't find character with that name"
									)
									.then((sentMessage) => (msg = sentMessage));
								setTimeout(() => {
									msg.delete();
								}, 5000);
								exit = true;
								return changeCharacter();
							}
						});

						collector.on('end', (collected) => {
							if (exit == true) return;
							else if (stop3 == true) {
								let collector = new opts.MessageCollector(
									channel,
									{
										filter: EndFilter,
										max: 1,
										time: 60000,
									}
								);

								let Embed = new opts.EmbedBuilder({
									color: 0xff0000,
									title: anime.name,
									timestamp: new Date(),
								});
								anime.characters.forEach((ch) => {
									Embed.addFields({
										name: ch.name,
										value: ch.picture,
									});
								});

								Embed.setImage(anime.picture);
								let msg;
								channel
									.send({ embeds: [Embed] })
									.then((sentMessage) => (msg = sentMessage));
								let msg2;
								//TODO
								channel
									.send(
										`**Are you sure you want to edit ${anime.name} with ${anime.characters.length} characters? (yes - no)**`
									)
									.then(
										(sentMessage) => (msg2 = sentMessage)
									);

								collector.on('collect', (collected) => {
									msg.delete();
									msg2.delete();
									collected.delete();
									if (collected.content == 'yes') {
										try {
											opts.GuessAnime.editAnime(
												anime,
												changeName
											);
										} catch (err) {
											return channel.send(
												`There was an error: ${err}`
											);
										}

										let Embed = new opts.EmbedBuilder({
											color: 0xff0000,
											title: `${anime.name}`,
											timestamp: new Date(),
										});
										anime.characters.forEach((ch) => {
											Embed.addFields({
												name: ch.name,
												value: ch.picture,
											});
										});

										Embed.setImage(anime.picture);

										return channel.send({
											embeds: [Embed],
										});
									} else if (collected.content == 'no') {
										return channel.send('Canceled!!');
									} else {
										return channel.send('Timed out!!');
									}
								});
							} else if (collected.size == 0)
								return channel.send('Timed out');
							else {
								charChange++;
								let collector = new opts.MessageCollector(
									channel,
									{
										filter: filter,
										time: 60000,
										max: 1,
									}
								);

								let Embed = new opts.EmbedBuilder({
									color: 0xff0000,
									title: `Character name: ${character.name}`,
									timestamp: new Date(),
								});

								Embed.setImage(character.picture);

								let msg;
								channel
									.send({ embeds: [Embed] })
									.then((sentMessage) => (msg = sentMessage));

								let msg2;
								channel
									.send(
										`**Enter new character name, 0 to leave it as it is or "exit"**`
									)
									.then(
										(sentMessage) => (msg2 = sentMessage)
									);

								let stop4 = false;
								collector.on('collect', (collected) => {
									msg.delete();
									msg2.delete();
									collected.delete();
									if (collected.content == 'exit') {
										stop4 = true;
										return channel.send('Canceling!!');
									}
									if (collected.content != 0) {
										anime.characters.forEach((ch) => {
											if (ch.name == character.name)
												ch.name = collected.content;
										});
									}
								});

								collector.on('end', (collected) => {
									if (stop4 == true) return;
									if (collected.size == 0)
										return channel.send('Timed out');

									let collector = new opts.MessageCollector(
										channel,
										{
											filter: filter,
											time: 60000,
											max: 1,
										}
									);
									let Embed = new opts.EmbedBuilder({
										color: 0xff0000,
										title: `Character name: ${character.name}`,
										timestamp: new Date(),
									});

									Embed.setImage(character.picture);

									let msg;
									channel
										.send({ embeds: [Embed] })
										.then(
											(sentMessage) => (msg = sentMessage)
										);

									let msg2;
									channel
										.send(
											`**Enter new character picture URL, 0 to leave it as it is or "exit"**`
										)
										.then(
											(sentMessage) =>
												(msg2 = sentMessage)
										);

									let stop5;
									collector.on('collect', (collected) => {
										msg.delete();
										msg2.delete();
										collected.delete();
										if (collected.content == 'exit') {
											stop5 = true;
											return channel.send('Canceling!!');
										}
										if (collected.content != 0) {
											try {
												new URL(collected.content);
											} catch (err) {
												return channel.send(
													`There was an error: ${err}`
												);
											}

											anime.characters.forEach((ch) => {
												if (ch.name == character.name)
													ch.picture =
														collected.content;
											});
										}
									});

									collector.on('end', (collected) => {
										if (stop5 == true) return;
										if (collected.size == 0)
											return channel.send('Timed out');

										return changeCharacter();
									});
								});
							}
						});
					}
					changeCharacter();
				});
			});
		});
	},
};
