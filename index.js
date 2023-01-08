const fs = require('fs');
const {
	Client,
	GatewayIntentBits,
	Permissions,
	Partials,
	EmbedBuilder,
	ActivityType,
} = require('discord.js');
const Discord = require('discord.js');
const NekoClient = require('nekos.life');

const { exec } = require('child_process');

const ms = require('ms');

const aflb = require('aflb');
const aflbClient = new aflb();

const Canvas = require('canvas');

const Gif = require('./modules/gif.js');
const Gifcmd = new Gif();

const GuessAnime = require('./modules/guessAnime.js');

const distube = require('distube');

const EventEmitter = require('events');

const { Bot, EventList } = require('./modules/botManager.js');
const { getAnime } = require('./modules/guessAnime.js');

const UsersManager = require('./modules/usersManager.js');
let userManager = new UsersManager();

require('dotenv').config();

const config = JSON.parse(fs.readFileSync('./config.json'));

//!INVITE LINK

const inviteLink =
	'https://discord.com/api/oauth2/authorize?client_id=811205997540016148&permissions=8&scope=bot';

//!gifs

const gifs = Gifcmd.gifs;

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping,
	],
	partials: [
		Partials.Channel,
		Partials.Message,
		Partials.User,
		Partials.Reaction,
		Partials.GuildMember,
	],
});

const clientDistube = new distube.DisTube(client, {
	leaveOnEmpty: true,
	emitNewSongOnly: true,
	emitAddSongWhenCreatingQueue: false,
});

const PREFIX = 'm!';
const botAuthor = '676503697252941856';

client.on('ready', () => {
	console.log('Bot is ready!   ' + client.user.tag);

	client.guilds.cache.each((guild) => {
		guild.members.cache.forEach((member) => {
			userManager.checkUser(member);
		});
	});

	const arrayOfStatus = [
		'Prefix is m!',
		'OwO',
		'UnU',
		'OnO',
		'UwU',
		'^w^',
		'<3',
		'YEEEET',
		// 'I luv Minty <3',
	];
	let index = 0;
	setInterval(() => {
		if (index === arrayOfStatus.length) index = 0;
		const status = arrayOfStatus[index];
		client.user.setStatus('idle');
		// client.user.setActivity({
		// 	name: status,
		// 	type: 'STREAMING',
		// 	url: 'https://www.twitch.tv/peety_uwu',
		// });
		client.user.setActivity({ name: status, type: ActivityType.Watching });
		index++;
	}, 7000);
});

client.on('guildMemberAdd', (member) => {
	getCanvas(member);

	// let humanRole = member.guild.roles.cache.find(
	// 	(role) => role.name === 'Human'
	// );
	// let aboutMeRole = member.guild.roles.cache.find(
	// 	(role) => role.name === '---- About me ----'
	// );
	// let gamesRole = member.guild.roles.cache.find(
	// 	(role) => role.name === '---- Games ----'
	// );
	// member.roles.add([humanRole, aboutMeRole, gamesRole]);

	member.guild.members.cache.each((member) => {
		if (member.user.bot) return;

		userManager.checkUser(member);
	});
});

const customBot = new Bot('Peety', client);

client.on('messageCreate', async (message) => {
	if (message.author.bot) return;

	const args = message.content.slice(PREFIX.length).split(/ +/);
	const command = args.shift().toLowerCase();
	const channel = message.channel;
	const author = message.author;
	const guild = message.guild;

	if (!message.content.startsWith(PREFIX)) return;
	//! actions commands
	else if (command == 'hi') {
		hi(message, author, guild, channel, args);
	} else if (command == 'kiss') {
		kiss(message, author, guild, channel, args);
	} else if (command == 'hug') {
		hug(message, author, guild, channel, args);
	} else if (command == 'cry') {
		cry(message, author, guild, channel, args);
	} else if (command == 'smile') {
		smile(message, author, guild, channel, args);
	} else if (command == 'smug') {
		smug(message, author, guild, channel, args);
	} else if (command == 'slap') {
		slap(message, author, guild, channel, args);
	} else if (command == 'cuddle') {
		cuddle(message, author, guild, channel, args);
	} else if (command == 'poke') {
		poke(message, author, guild, channel, args);
	} else if (command == 'pat') {
		pat(message, author, guild, channel, args);
	} else if (command == 'feed') {
		feed(message, author, guild, channel, args);
	} else if (command == 'tickle') {
		tickle(message, author, guild, channel, args);
	} else if (command == 'baka') {
		baka(message, author, guild, channel, args);
	} else if (command == 'blush') {
		blushAction(message, author, guild, channel, args);
	} else if (command == 'hentai') {
	} else if (command == 'akick') {
		akick(message, author, guild, channel, args);
	} else if (command == 'hentai') {
		hentai(message, author, guild, channel, args);
	} else if (command == 'tease') {
		tease(message, author, guild, channel, args);
	}
	//? else if (command == 'sex') {
	// 	sex(message, author, guild, channel, args);
	// }

	//!help command
	else if (command == 'help') {
		help(message, author, guild, channel, args);
	}

	//! economy commands
	else if (command == 'nyanlings' || command == 'cash') {
		nyanlings(message, author, guild, channel, args);
	}

	//!moderation commands
	else if (command == 'clear') {
		clearMsg(message, author, guild, channel, args);
	} else if (command == 'kick') {
		kick(message, author, guild, channel, args);
	} else if (command == 'ban') {
		ban(message, author, guild, channel, args);
	} else if (command == 'mute') {
		mute(message, author, guild, channel, args);
	}

	//!moderation bot commands
	else if (command == 'addgif') {
		if (!customBot.getManager(author.id)) return console.log(author); //channel.send("You can't do that");
		if (!args) return channel.send('No args');
		let type = args[0];
		let gifURL = args.slice(1);
		if (!type || !gifURL) return channel.send('Missing arg');

		try {
			Gifcmd.addGif({ type, gifURL });
		} catch (err) {
			return channel.send(`There was an error: ${err}`);
		}

		let Embed = new EmbedBuilder();
		Embed.setTitle(`Adding ${type} gif`)
			.setDescription(`${gifURL.join(', ')}`)
			.setImage(gifURL[0])
			.setColor(0xff0000);
		return channel.send({ embeds: [Embed] });
	} else if (command == 'invitelink') {
		return channel.send(inviteLink);
	} else if (command == 'addmanager') {
		if (customBot.getManager(author.id)) {
			let mention = message.mentions.users.first();
			if (!mention) return channel.send('Please mention someone');

			try {
				customBot.addManager(mention.id);
			} catch (err) {
				return channel.send(err);
			}

			return channel.send(`Added ${mention.tag} as bot manager`);
		} else {
			return channel.send("You can't do that");
		}
	}

	//?
	else if (command == 'addanime') {
		if (!customBot.getManager(author.id))
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

		let collector = new Discord.MessageCollector(channel, {
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
			let collector = new Discord.MessageCollector(channel, {
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
					let collector = new Discord.MessageCollector(channel, {
						filter: filter,
						time: 60000,
						max: 1,
					});

					let Embed = new EmbedBuilder({
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
							let collector = new Discord.MessageCollector(
								channel,
								{
									filter: EndFilter,
									max: 1,
									time: 60000,
								}
							);

							let Embed = new EmbedBuilder({
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
										GuessAnime.addAnime({
											name,
											characters,
											picture,
										});
									} catch (err) {
										return channel.send(
											`There was an error: ${err}`
										);
									}

									let Embed = new EmbedBuilder({
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
							let collector = new Discord.MessageCollector(
								channel,
								{
									filter: URLFilter,
									time: 60000,
									max: 1,
								}
							);
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
	}
	//?
	else if (command == 'addcharacter') {
		if (!customBot.getManager(author.id))
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

		let collector = new Discord.MessageCollector(channel, {
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
				let collector = new Discord.MessageCollector(channel, {
					filter: filter,
					time: 60000,
					max: 1,
				});

				let Embed = new EmbedBuilder({
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
						try {
							GuessAnime.addCharacter({
								name,
								characters,
							});
						} catch (err) {
							return channel.send(`There was an error: ${err}`);
						}

						let Embed = new EmbedBuilder({
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

						let collector = new Discord.MessageCollector(channel, {
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
									GuessAnime.addCharacter({
										name,
										characters,
									});
								} catch (err) {
									return channel.send(
										`There was an error: ${err}`
									);
								}

								let Embed = new EmbedBuilder({
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
						let collector = new Discord.MessageCollector(channel, {
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
	} else if (command == 'getanimelist') {
		if (!customBot.getManager(author.id))
			return channel.send("You are't allowed to do that");
		return channel.send(GuessAnime.getAnimeList());
	} else if (command == 'getcharacters') {
		if (!customBot.getManager(author.id))
			return channel.send("You are't allowed to do that");
		if (args.length == 0) return channel.send('Please specify anime');
		let anime = args.join(' ');

		let characters;
		try {
			characters = GuessAnime.getAnimeCharacters(anime);
		} catch (err) {
			channel.send(`There was an error: ${err}`);
		}

		channel.send(`Characters from ${anime}: ${characters}`);
	} else if (command == 'editanime') {
		if (!customBot.getManager(author.id))
			return channel.send("You are't allowed to do that");

		const filter = (message, user) => {
			return message.author.id == author.id;
		};

		const filterAnimeName = (message, user) => {
			if (
				message.author.id == author.id &&
				GuessAnime.getAnime(message.content)
			) {
				anime = GuessAnime.getAnime(message.content);
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

		let collector = new Discord.MessageCollector(channel, {
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
			let collector = new Discord.MessageCollector(channel, {
				filter: filter,
				time: 60000,
				max: 1,
			});
			let Embed = new EmbedBuilder({
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

				let collector = new Discord.MessageCollector(channel, {
					filter: filter,
					time: 60000,
					max: 1,
				});

				let Embed = new EmbedBuilder({
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
						let collector = new Discord.MessageCollector(channel, {
							filter: filter,
							time: 60000,
							max: 1,
						});
						let characters = [];
						anime.characters.forEach((ch) => {
							characters.push(ch.name);
						});

						let Embed = new EmbedBuilder({
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
								let collector = new Discord.MessageCollector(
									channel,
									{
										filter: EndFilter,
										max: 1,
										time: 60000,
									}
								);

								let Embed = new EmbedBuilder({
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
											GuessAnime.editAnime(
												anime,
												changeName
											);
										} catch (err) {
											return channel.send(
												`There was an error: ${err}`
											);
										}

										let Embed = new EmbedBuilder({
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
								let collector = new Discord.MessageCollector(
									channel,
									{
										filter: filter,
										time: 60000,
										max: 1,
									}
								);

								let Embed = new EmbedBuilder({
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

									let collector =
										new Discord.MessageCollector(channel, {
											filter: filter,
											time: 60000,
											max: 1,
										});
									let Embed = new EmbedBuilder({
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
	} else if (command == 'guessanime') {
		let anime = GuessAnime.getRandomAnime();

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

			let Embed = new EmbedBuilder({
				color: 0xff0000,
				title: 'Guess the anime',
				description: 'You have 20 seconds to guess the anime!',
				fields: [
					{ name: 'Anime list: ', value: GuessAnime.getAnimeList() },
				],
			});
			Embed.setImage(anime.picture);
			channel.send({ embeds: [Embed] });

			let collector = new Discord.MessageCollector(channel, {
				filter: filter,
				time: 20000,
				max: 1,
			});

			collector.on('collect', (collected) => {
				userManager.addNyanlings(collected.author.id, 'guessAnime');
				channel.send(`${collected.author} has won!`);
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

			let Embed = new EmbedBuilder({
				color: 0xff0000,
				title: `Guess the character from ${anime.name}`,
				description: 'You have 20 seconds to guess the anime!',
				fields: [
					{
						name: 'Character list: ',
						value: GuessAnime.getAnimeCharacters(anime.name),
					},
				],
			});
			Embed.setImage(anime.character.picture);
			channel.send({ embeds: [Embed] });
			let collector = new Discord.MessageCollector(channel, {
				filter: filter,
				time: 20000,
				max: 1,
			});

			collector.on('collect', (collected) => {
				userManager.addNyanlings(collected.author.id, 'guessAnime');
				channel.send(`${collected.author} has won!`);
			});

			collector.on('end', (collected) => {
				if (collected.size == 0)
					return channel.send(
						`No-one won! The character was ${anime.character.name}`
					);
			});
		}
	}
	//?
	else if (command == 'creategif') {
		if (
			!customBot.getManager(author.id) &&
			author.id != '824699240701493279'
		)
			return console.log(author); //channel.send("You can't do that");
		if (!args) return channel.send('No args');
		let name = args[0];
		let gifURL = args.slice(1);
		if (!name || !gifURL) return channel.send('Missing arg');

		let s = Gifcmd.createGifCategory({ channel, name, gifURL });
		if (!s) return channel.send('This category already exists');
		channel.send(`Created ${name}`);
	}

	//!others
	else if (command == 'marry') {
		marry(message, author, guild, channel, args);
	} else if (command == 'divorce') {
		divorce(message, author, guild, channel, args);
	} else if (command == 'rdnumber') {
		rdnumber(message, author, guild, channel, args);
	} else if (command == 'play') {
		play(message, author, guild, channel, args);
	} else if (command == 'queue') {
		queue(message, author, guild, channel, args);
	} else if (command == 'skip') {
		skip(message, author, guild, channel, args);
	} else if (command == 'stop') {
		stop(message, author, guild, channel, args);
	} else if (command == 'guessAnime') {
		guessAnime(message, author, guild, channel, args);
	}
});

// client.on('guildMemberAdd', (member) => {
// 	getCanvas(member);
// });

client.on('guildCreate', (guild) => {
	let channeltoSend;
	guild.channels.cache.forEach((channel) => {
		if (
			channel.type === 0 &&
			!channeltoSend &&
			channel.permissionsFor(guild.me).has('SEND_MESSAGES')
		)
			channeltoSend = channel;
	});
	if (!channeltoSend) return;

	let channelEmbed = new EmbedBuilder()
		.setColor(0xff1100)
		.setAuthor(`Hi! Thank you for inviting me to ${guild.name}!`)
		.setDescription('Prefix is ";"');

	channeltoSend.send(channelEmbed).catch((e) => {
		if (e) {
			return;
		}
	});

	//    guild.roles.create({
	//         data: {
	//           name: 'Muted',
	//           color: 'BLACK',
	//           reason: 'Need mute role',
	//           permissions: ["SEND_MESSAGES"]
	//         },

	//       })
	guild.channels.create('Peety-bot-channels', {
		type: 'category',
		position: 0,
	});
	guild.channels.create('Peety-bot-updates', 'text').then((addChannel) => {
		const categoryId = guild.channels.cache.find(
			(c) => c.name === 'Peety-bot-channels'
		);
		addChannel.setParent(categoryId);
	});
});

/**
 *
 * @param {Object} member member
 */
async function getCanvas(member) {
	let welcomeCanvas = {};
	welcomeCanvas.create = Canvas.createCanvas(1024, 500);
	welcomeCanvas.context = welcomeCanvas.create.getContext('2d');
	welcomeCanvas.context.font = '72px sans-serif';
	welcomeCanvas.context.fillStyle = '#ffffff';

	const backgroung = await Canvas.loadImage('./img/bg.jpg');
	welcomeCanvas.context.drawImage(backgroung, 0, 0);

	let canvas = welcomeCanvas;
	canvas.context.font = '42px sans-serif';
	canvas.context.textAlign = 'center';
	canvas.context.fillText(member.user.tag, 512, 410);
	canvas.context.font = '32px sans-serif';
	canvas.context.beginPath();
	canvas.context.arc(512, 166, 119, 0, Math.PI * 2, true);
	canvas.context.closePath();
	canvas.context.clip();
	let url = !member.user.avatar
		? member.user.defaulAvatarUrl
		: 'https://cdn.discordapp.com/avatars/' +
		  member.user.id +
		  '/' +
		  member.user.avatar +
		  '.jpeg';
	await Canvas.loadImage(url).then((img) =>
		canvas.context.drawImage(img, 393, 47, 238, 238)
	);
	let atta = new Discord.AttachmentBuilder(canvas.create.toBuffer(), {
		name: `welcome-${member.user.id}.png`,
	});
	try {
		let welcomeChannel = member.guild.channels.cache.find(
			(channel) =>
				(channel.name === 'Welcome' && channel.type == 0) ||
				(channel.name === 'welcome' && channel.type == 0) ||
				(channel.id == '927651408159850516' && channel.type == 0)
		);
		if (welcomeChannel) {
			welcomeChannel.send({
				files: [atta],
				content: `:wave: Hello <@${member.user.id}> welcome to **${member.guild.name}**. We now currently have **${member.guild.memberCount}** members.`,
			});
		}
		if (!welcomeChannel) {
			let welcome;
			member.guild.channels.cache.each((channel) => {
				if (channel.type === 'text' && !welcome) welcome = channel;
			});
			welcome.send({
				files: [atta],
				content: `:wave: Hello <@${member.user.id}> welcome to **${member.guild.name}**. We now currently have **${member.guild.memberCount}** members.`,
			});
		}
	} catch (e) {
		console.log(e);
	}
}

//! moderation

/**
 *
 * @param {Number} ms miliseconds
 * @returns {String} miliseconds converted to days, hours, etc...
 */
function msToTime(ms) {
	let seconds = (ms / 1000).toFixed(1);
	let minutes = (ms / (1000 * 60)).toFixed(1);
	let hours = (ms / (1000 * 60 * 60)).toFixed(1);
	let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
	if (seconds < 60) return seconds + ' Sec';
	else if (minutes < 60) return minutes + ' Min';
	else if (hours < 24) return hours + ' Hrs';
	else return days + ' Days';
}

/**
 * kicks user
 * @param {Object} message message
 * @param {Object} author message author
 * @param {Object} guild message guild
 * @param {Object} channel message channel
 */
function kick(message, author, guild, channel, args) {
	let mention = message.mentions.members.first();
	let reason = args.slice(1).join(' ');
	if (!mention) return channel.send('Please mention someone');
	if (!message.member.permissions.has('KICK_MEMBERS'))
		return channel.send("U can't do that");
	guild.members.kick(mention, reason);
	let Embed = new EmbedBuilder({
		color: 0xff0000,
		title: 'Kick',
		description: `Kicked ${mention}`,
		fields: [
			{ name: 'Reason', value: reason },
			{ name: 'Time', value: new Date().toLocaleString() },
			{ name: 'Kicked by', value: author.tag },
		],
		thumbnail: { url: 'https://i.imgur.com/qRFFT4T.jpg' },
	});
	channel.send({ embeds: [Embed] });
}

// /**
//  * kicks user
//  * @param {Object} message message
//  * @param {Object} author message author
//  * @param {Object} guild message guild
//  * @param {Object} channel message channel
//  */
// function mute(message, author, guild, channel, args) {
// 	if (!message.member.permissions.has('ADMINISTRATOR'))
// 		return channel.send('You are not allowed to do that!');
// 	let mention = message.mentions.users.first();
// 	if (mention.permissions.has('ADMINISTRATOR'))
// 		return channel.send("I can't do that!");
// 	if (!mention) return channel.send('You need to mention someone!');
// 	let time = ms(args[1]);
// 	if (isNaN(time))
// 		return channel.send(
// 			'First argument needs to be time. (1min, 1s, 1mo, 1h, 1y, 1d, 1w)'
// 		);
// 	let reason = args.slice(2).join(' ');
// 	message.member.timeout(time, reason);
// 	return channel.send(`Muting ${mention} for ${msToTime(ms)}`);
// }

/**
 * bans user
 * @param {Object} message message
 * @param {Object} author message author
 * @param {Object} guild message guild
 * @param {Object} channel message channel
 */
function ban(message, author, guild, channel, args) {
	let mention = message.mentions.members.first();
	let reason = args.slice(1).join(' ');
	if (!mention) return channel.send('Please mention someone');
	if (!message.member.permissions.has('BAN_MEMBERS'))
		return channel.send("U can't do that");
	if (mention.permissions.has('ADMINISTRATOR'))
		return channel.send('That user is admin');

	guild.members.ban(mention, reason);
	let Embed = new EmbedBuilder({
		color: 0xff0000,
		title: 'Ban',
		description: `Banned ${mention}`,
		fields: [
			{ name: 'Reason', value: reason },
			{ name: 'Time', value: new Date().toLocaleString() },
			{ name: 'Banned by', value: author.tag },
		],
		thumbnail: { url: 'https://i.imgur.com/qRFFT4T.jpg' },
	});
	channel.send({ embeds: [Embed] });
}

/**
 * clears chat
 * @param {Object} message message
 * @param {Object} author message author
 * @param {Object} guild message guild
 * @param {Object} channel message channel
 */
function clearMsg(message, author, guild, channel, args) {
	if (args.length <= 0) return channel.send('Example: m!clear 100');
	if (isNaN(args[0])) return channel.send('Please enter a number');
	if (parseInt(args[0]) <= 0 || parseInt(args[0]) > 100)
		return channel.send('Please enter number between 0 and 100');
	if (!message.member.permissions.has('MANAGE_MESSAGES'))
		return channel.send("U can't do that");
	channel.bulkDelete(Math.floor(args[0]));
}

//! actions

/**
 *
 * @param {Object} message message
 * @param {Object} author message author
 * @param {Object} guild message guild
 * @param {Object} channel message channel
 */
async function kiss(message, author, guild, channel, args) {
	let mention = message.mentions.users.first();
	let descMsg =
		args.length == 0
			? 'is kissing someone'
			: mention.id == author.id
			? 'wants a kiss'
			: mention
			? `is kissing ${mention}`
			: 'err';
	if (descMsg == 'wants a kiss') return channel.send(`${author} ${descMsg}`);
	let gif = await aflbClient.sfw.kiss();
	let Embed = new EmbedBuilder();
	Embed.setDescription(`${author} ${descMsg}`)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor(0xff0000);
	channel.send({ embeds: [Embed] });
}

/**
 *
 * @param {Object} message message
 * @param {Object} author message author
 * @param {Object} guild message guild
 * @param {Object} channel message channel
 */
async function hug(message, author, guild, channel, args) {
	let mention = message.mentions.users.first();
	let descMsg =
		args.length == 0
			? 'is hugging someone'
			: mention.id == author.id
			? 'wants a hug'
			: mention
			? `is hugging ${mention}`
			: 'err';
	if (descMsg == 'wants a hug') return channel.send(`${author} ${descMsg}`);
	let gif = await aflbClient.sfw.hug();
	let Embed = new EmbedBuilder();
	Embed.setDescription(`${author} ${descMsg}`)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor(0xff0000);
	channel.send({ embeds: [Embed] });
}
/**
 *
 * @param {Object} message message
 * @param {Object} author message author
 * @param {Object} guild message guild
 * @param {Object} channel message channel
 */
async function cry(message, author, guild, channel, args) {
	let descMsg = 'is crying';
	let gif = await aflbClient.sfw.cry();
	let Embed = new EmbedBuilder();
	Embed.setDescription(`${author} ${descMsg}`)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor(0xff0000);
	channel.send({ embeds: [Embed] });
}
/**
 *
 * @param {Object} message message
 * @param {Object} author message author
 * @param {Object} guild message guild
 * @param {Object} channel message channel
 */
async function smile(message, author, guild, channel, args) {
	let descMsg = 'is smiling';
	let gif = await aflbClient.sfw.smile();
	let Embed = new EmbedBuilder();
	Embed.setDescription(`${author} ${descMsg}`)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor(0xff0000);
	channel.send({ embeds: [Embed] });
}
/**
 *
 * @param {Object} message message
 * @param {Object} author message author
 * @param {Object} guild message guild
 * @param {Object} channel message channel
 */
async function smug(message, author, guild, channel, args) {
	let descMsg = 'has a smug look';
	let gif = await aflbClient.sfw.smug();
	let Embed = new EmbedBuilder();
	Embed.setDescription(`${author} ${descMsg}`)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor(0xff0000);
	channel.send({ embeds: [Embed] });
}

async function slap(message, author, guild, channel, args) {
	let mention = message.mentions.users.first();
	let descMsg =
		args.length == 0
			? 'is slapping someone'
			: mention.id == author.id
			? 'wants to be slapped'
			: mention
			? `is slapping ${mention}`
			: 'err';
	if (descMsg == 'wants to be slapped')
		return channel.send(`${author} ${descMsg}`);
	let gif = await aflbClient.sfw.slap();
	let Embed = new EmbedBuilder();
	Embed.setDescription(`${author} ${descMsg}`)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor(0xff0000);
	channel.send({ embeds: [Embed] });
}

/**
 *
 * @param {Object} message message
 * @param {Object} author message author
 * @param {Object} guild message guild
 * @param {Object} channel message channel
 */
async function poke(message, author, guild, channel, args) {
	let gif = await aflbClient.sfw.poke();
	let Embed = new EmbedBuilder();
	Embed.setDescription(`${author} pokes ${args.join(' ')}`)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor(0xff0000);
	channel.send({ embeds: [Embed] });
}

/**
 *
 * @param {Object} message message
 * @param {Object} author message author
 * @param {Object} guild message guild
 * @param {Object} channel message channel
 */
async function blushAction(message, author, guild, channel, args) {
	let gif = gifs.blush[Math.floor(Math.random() * gifs.blush.length)];
	let Embed = new EmbedBuilder({
		color: 0xff0000,
		description: `${author} blushes`,
		timestamp: new Date(),
	});
	Embed.setImage(gif);
	channel.send({ embeds: [Embed] });
}

/**
 *
 * @param {Object} message message
 * @param {Object} author message author
 * @param {Object} guild message guild
 * @param {Object} channel message channel
 */
async function cuddle(message, author, guild, channel, args) {
	let gif = await aflbClient.sfw.cuddle();
	let Embed = new EmbedBuilder();
	Embed.setDescription(`${author} cuddles ${args.join(' ')}`)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor(0xff0000);
	channel.send({ embeds: [Embed] });
}

/**
 *
 * @param {Object} message message
 * @param {Object} author message author
 * @param {Object} guild message guild
 * @param {Object} channel message channel
 */
async function feed(message, author, guild, channel, args) {
	let gif = await aflbClient.sfw.feed();
	let Embed = new EmbedBuilder();
	Embed.setDescription(`${author} feeds ${args.join(' ')}`)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor(0xff0000);
	channel.send({ embeds: [Embed] });
}

/**
 *
 * @param {Object} message message
 * @param {Object} author message author
 * @param {Object} guild message guild
 * @param {Object} channel message channel
 */
async function baka(message, author, guild, channel, args) {
	let gif = await aflbClient.sfw.baka();
	let Embed = new EmbedBuilder();
	Embed.setDescription(`${args.join(' ')} is baka`)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor(0xff0000);
	channel.send({ embeds: [Embed] });
}

/**
 *
 * @param {Object} message message
 * @param {Object} author message author
 * @param {Object} guild message guild
 * @param {Object} channel message channel
 */
async function tickle(message, author, guild, channel, args) {
	let gif = await aflbClient.sfw.tickle();
	let Embed = new EmbedBuilder();
	Embed.setDescription(`${author} tickles ${args.join(' ')}`)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor(0xff0000);
	channel.send({ embeds: [Embed] });
}

/**
 *
 * @param {Object} message message
 * @param {Object} author message author
 * @param {Object} guild message guild
 * @param {Object} channel message channel
 */
async function pat(message, author, guild, channel, args) {
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
	let gif = await aflbClient.sfw.pat();
	let Embed = new EmbedBuilder();
	Embed.setDescription(`${author} ${descMsg}`)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor(0xff0000);
	channel.send({ embeds: [Embed] });
}

/**
 *
 * @param {Object} message message
 * @param {Object} author message author
 * @param {Object} guild message guild
 * @param {Object} channel message channel
 */
async function akick(message, author, guild, channel, args) {
	let mention = message.mentions.users.first();
	let descMsg =
		args.length == 0
			? 'is kicking someone'
			: mention.id == author.id
			? `<@${client.user.id}> kicks <@${author.id}>`
			: mention
			? `kicks ${mention}`
			: 'err';
	let gif = gifs.kick[Math.floor(Math.random() * gifs.kick.length)];
	if (descMsg == `<@${client.user.id}> kicks <@${author.id}>`) {
		let gif = gifs.kick[Math.floor(Math.random() * gifs.kick.length)];
		let Embed = new EmbedBuilder();
		Embed.setDescription(`${descMsg}`)
			.setImage(gif)
			.setTimestamp(new Date())
			.setColor(0xff0000);
		return channel.send({ embeds: [Embed] });
	}
	let Embed = new EmbedBuilder();
	Embed.setDescription(`${author} ${descMsg}`)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor(0xff0000);
	return channel.send({ embeds: [Embed] });
}

/**
 *
 * @param {Object} message message
 * @param {Object} author message author
 * @param {Object} guild message guild
 * @param {Object} channel message channel
 */
async function hi(message, author, guild, channel, args) {
	channel.send(`Hello ${message.author}`);
}

/**
 *
 * @param {Object} message message
 * @param {Object} author message author
 * @param {Object} guild message guild
 * @param {Object} channel message channel
 */
async function tease(message, author, guild, channel, args) {
	let gif = await aflbClient.sfw.tease();
	let Embed = new EmbedBuilder();
	Embed.setDescription(`${author} teases ${args.join(' ')}`)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor(0xff0000);
	channel.send({ embeds: [Embed] });
}

/**
 *
 * @param {Object} message message
 * @param {Object} author message author
 * @param {Object} guild message guild
 * @param {Object} channel message channel
 */
async function sex(message, author, guild, channel, args) {
	let gif = await aflbClient.sfw.sex();
	let Embed = new EmbedBuilder();
	Embed.setDescription(``)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor(0xff0000);
	channel.send({ embeds: [Embed] });
}

//! nsfw actions

async function hentai(message, author, guild, channel, args) {
	if (!channel.nsfw) return channel.send("This isn't NSFW channel");
	let gif = await aflbClient.nsfw.hentai_gif();
	let Embed = new EmbedBuilder();
	Embed.setDescription(`Here u go`)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor(0xff0000);
	channel.send({ embeds: [Embed] });
}

//! help commands

function help(message, author, guild, channel, args) {
	let Embed = new EmbedBuilder({
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
}

//! others

async function marry(message, author, guild, channel, args) {
	let marry =
		JSON.parse(fs.readFileSync('./database/marry.json')).length <= 0
			? []
			: JSON.parse(fs.readFileSync('./database/marry.json'));
	let mention = message.mentions.users.first();
	if (!mention) {
		return channel.send('Please mention someone!');
	}
	if (mention.id == author.id) {
		return channel.send("You can't marry yourself");
	}
	for (let m of marry) {
		if (m.accept == mention.id) {
			return channel.send(`${mention} is already married to <@${m.ask}>`);
		} else if (m.ask == mention.id) {
			return channel.send(
				`${mention} is already married to <@${m.accept}>`
			);
		} else if (m.ask == author.id) {
			return channel.send(`You're aleady married to <@${m.accept}>`);
		} else if (m.accept == author.id) {
			return channel.send(`You're aleady married to <@${m.ask}>`);
		}
	}
	let reactionMessage = await channel.send(
		`${mention}, will you marry ${author}?`
	);
	const check = '✅';
	const cross = '❌';
	await reactionMessage.react(check);
	await reactionMessage.react(cross);
	const filter = (reaction, user) =>
		(!user.bot && user.id == mention.id && reaction.emoji.name === check) ||
		(!user.bot && user.id == mention.id && reaction.emoji.name === cross);

	const collector = reactionMessage.createReactionCollector({
		filter,
		time: 15000,
		max: 1,
		errors: ['time'],
	});
	collector.on('collect', (reaction, user) => {
		if (reaction.emoji.name == check) {
			channel.send(`${mention} is now married to ${author}`);
			let newMarry = {
				ask: author.id,
				accept: mention.id,
			};
			marry = [...marry, newMarry];
			fs.writeFileSync(
				'./database/marry.json',
				JSON.stringify(marry, null, 2)
			);
		} else if (reaction.emoji.name == cross) {
			channel.send(
				`Sorry but ${mention} doesn't want to marry you, ${author}`
			);
		}
	});
}

function divorce(message, author, guild, channel, args) {
	let marry =
		JSON.parse(fs.readFileSync('./database/marry.json')).length <= 0
			? []
			: JSON.parse(fs.readFileSync('./database/marry.json'));

	let marryFiltred = marry.filter(
		(m) => m.ask != author.id && m.accept != author.id
	);
	let marryPair = marry.filter(
		(m) => m.ask == author.id || m.accept == author.id
	);
	if (marryPair.length <= 0) {
		return channel.send('U are not married');
	}

	let secondPerson =
		marryPair[0].ask == author.id ? marryPair[0].accept : marryPair[0].ask;
	console.log(marryFiltred);
	console.log(marryPair);

	marry = marryFiltred;
	fs.writeFileSync('./database/marry.json', JSON.stringify(marry, null, 2));
	channel.send(`U divorced with <@${secondPerson}>`);

	// for (let m of marry) {
	// 	if (m.accept == mention.id) {
	// 		return channel.send(`${mention} divorced with <@${m.ask}>`);
	// 	} else if (m.ask == mention.id) {
	// 		return channel.send(
	// 			`${mention} is already married to <@${m.accept}>`
	// 		);
	// 	} else if (m.ask == author.id) {
	// 		return channel.send(`You're aleady married to <@${m.accept}>`);
	// 	} else if (m.accept == author.id) {
	// 		return channel.send(`You're aleady married to <@${m.ask}>`);
	// 	}
	// }
}

function nyanlings(message, author, guild, channel, args) {
	let nyanlings = userManager.getNyanlings(author.id);
	return message.reply(`You have ${nyanlings} Nyanlings🪙`);
}

function rdnumber(message, author, guild, channel, args) {
	let number = Math.round(Math.random() * 100);
	channel.send(`Your random number is ${number}`);
}

function play(message, author, guild, channel, args) {
	let music = args.join(' ');
	if (!message.member.voice.channelId) return message.reply('Join vc please');

	clientDistube.play(message.member.voice.channel, music, {
		textChannel: channel,
		member: message.member,
		message,
	});
}
function queue(message, author, guild, channel, args) {
	const queue = clientDistube.getQueue(message);
	channel.send(
		'Current queue:\n' +
			queue.songs
				.map(
					(song, id) =>
						`**${id + 1}**. [${song.name}](${song.url}) - \`${
							song.formattedDuration
						}\``
				)
				.join('\n')
	);
}
function skip(message, author, guild, channel, args) {
	clientDistube.skip(message);
}
function stop(message, author, guild, channel, args) {
	try {
		clientDistube.stop(message);
		channel.send('Stopped playing');
	} catch (err) {
		return channel.send(err);
	}
}

function guessAnime(message, author, guild, channel, args) {}

clientDistube.on('playSong', (queue, song) => {
	queue.textChannel.send(
		`Playing \`${song.name}\` - \`${song.formattedDuration}\``
	);
});
clientDistube.on('addSong', (queue, song) => {
	queue.textChannel.send(
		`Adding \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}`
	);
});

//client.user.setActivity('Test', { type: 'CUSTOM_STATUS', name: 'Peety' });
try {
	client.login(process.env.TOKEN2);
} catch (err) {
	console.log(err);
	process.exit(1);
}

if (config.message_on_start == 1) {
	try {
		client.users.fetch('676503697252941856', false).then((u) => {
			try {
				u.send('Bot is on');
			} catch (err) {
				console.log(err);
			}
		});
	} catch (err) {
		console.error(err);
	}

	try {
		client.users.fetch('824699240701493279', false).then((u) => {
			try {
				u.send('Bot is on');
			} catch (err) {
				console.log(err);
			}
		});
	} catch (err) {
		console.error(err);
	}
}
