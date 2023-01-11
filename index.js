const fs = require('fs');
const {
	Client,
	GatewayIntentBits,
	Permissions,
	Partials,
	EmbedBuilder,
	ActivityType,
	SlashCommandBuilder,
	Collection,
	MessageCollector,
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

const customBot = new Bot('Peety', client);

const PREFIX = 'm!';
const botAuthor = '676503697252941856';
const slashCommands = ['test'];

/**
 * @property {Class} aflbClient
 * @property {Class} Gifcmd
 * @property {Class} GuessAnime
 * @property {Class} distube
 */
const opts = {
	aflbClient,
	Gifcmd,
	GuessAnime,
	distube,
	Bot,
	userManager,
	ms,
	config,
	gifs,
	Client,
	GatewayIntentBits,
	Permissions,
	Partials,
	EmbedBuilder,
	ActivityType,
	SlashCommandBuilder,
	Collection,
	MessageCollector,
	customBot,
	clientDistube,
};

module.exports = { opts };

client.on('interactionCreate', async (interaction) => {
	try {
		if (!interaction.isChatInputCommand()) return;

		const command = client.interactions.get(interaction.commandName);

		if (!command) {
			console.error(
				`No command matching ${interaction.commandName} was found.`
			);
			return;
		}

		await command.execute(interaction, opts);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: 'There was an error while executing this command!',
			ephemeral: true,
		});
	}
});

client.on('ready', () => {
	console.log('Bot is ready!   ' + client.user.tag);

	client.guilds.cache.each((guild) => {
		guild.members.cache.forEach((member) => {
			userManager.checkUser(member);
		});
	});

	slashCommands.forEach((command) => {
		new SlashCommandBuilder()
			.setName(command)
			.setDescription('This command is only for testing');
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

client.commands = new Collection();

const commandsPath = './commands/classic';
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = `./commands/classic/${file}`;
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('name' in command && 'run' in command) {
		client.commands.set(command.name, command);
		if ('alias' in command) {
			command.alias.forEach((ali) => {
				client.commands.set(ali, command);
			});
		}
	} else {
		console.log(
			`[WARNING] The command at ${filePath} is missing a required "name" or "run" property.`
		);
	}
}

client.interactions = new Collection();

const commandsPath2 = './commands/interactions';
const commandFiles2 = fs
	.readdirSync(commandsPath2)
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles2) {
	const filePath = `./commands/interactions/${file}`;
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.interactions.set(command.data.name, command);
	} else {
		console.log(
			`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
		);
	}
}

client.on('messageCreate', async (message) => {
	if (message.author.bot) return;
	if (!message.content.startsWith(PREFIX)) return;

	const args = message.content.slice(PREFIX.length).split(/ +/);
	// const command = args.shift().toLowerCase();
	const channel = message.channel;
	const author = message.author;
	const guild = message.guild;

	try {
		const command = client.commands.get(args.shift().toLowerCase());

		if (!command) {
			console.error(
				`No command matching ${
					args.length > 0 ? args.shift().toLowerCase() : "Can't find"
				} was found.`
			);
			return;
		}

		await command.run(client, message, author, guild, channel, args, opts);
	} catch (error) {
		console.error(error);
		await message.reply({
			content: 'There was an error while executing this command!',
			ephemeral: true,
		});
	}
});

//! actions commands
// if (command.name == 'hentai') {
// 	hentai(message, author, guild, channel, args);
// }
// //? else if (command == 'sex') {
// // 	sex(message, author, guild, channel, args);
// // }

// //!help command

// //! economy commands

// //! games commands

// //!moderation commands
// else if (command.name == 'kick') {
// 	kick(message, author, guild, channel, args);
// } else if (command.name == 'ban') {
// 	ban(message, author, guild, channel, args);
// } else if (command.name == 'mute') {
// 	mute(message, author, guild, channel, args);
// }

//!moderation bot commands

//?
//?
//?

//!others

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
				(channel.id == '927651408159850516' && channel.type == 0) ||
				(channel.id == '891028805509066854' && channel.type == 0)
		);
		if (welcomeChannel) {
			welcomeChannel.send({
				files: [atta],
				content: `:wave: Hello <@${member.user.id}> welcome to **${member.guild.name}**. We currently have **${member.guild.memberCount}** members.`,
			});
		}
		if (!welcomeChannel) {
			let welcome;
			member.guild.channels.cache.each((channel) => {
				if (channel.type === 'text' && !welcome) welcome = channel;
			});
			welcome.send({
				files: [atta],
				content: `:wave: Hello <@${member.user.id}> welcome to **${member.guild.name}**. We currently have **${member.guild.memberCount}** members.`,
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

//! actions

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

//! others

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
