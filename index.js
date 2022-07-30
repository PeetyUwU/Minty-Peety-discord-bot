const fs = require('fs');

class Gif {
	/**
	 *
	 * @param {Object} opts options
	 */
	constructor(opts) {
		this.gifs = JSON.parse(fs.readFileSync('./gifs.json'));
	}

	/**
	 *
	 * @param {Object} opts
	 * @param {String} opts.type
	 * @param {String} opts.gifURL
	 */
	addGif(opts) {
		if (!opts.type || !opts.gifURL) throw new Error('Parameters missing');
		this.gifs[opts.type].push(opts.gifURL);
		fs.writeFileSync('./gifs.json', JSON.stringify(this.gifs, null, 2));
	}
}

const { time, clear } = require('console');
const { Client, Intents, Permissions } = require('discord.js');
const Discord = require('discord.js');
const NekoClient = require('nekos.life');
const aflb = require('aflb');
const aflbClient = new aflb();
const Canvas = require('canvas');
const Gifcmd = new Gif();
require('dotenv').config;

//!gifs

const blush = [
	'https://c.tenor.com/QHpICcsD_QAAAAAd/marin-nervous.gif',
	'https://c.tenor.com/aB3esnYeZiIAAAAC/girl-redhead.gif',
	'https://c.tenor.com/JhO1fYhvP14AAAAC/face-blush.gifrs',
	'https://c.tenor.com/r9qSPQVfZ3YAAAAC/anime-flush.gif',
	'https://c.tenor.com/wwxHnJqUNEMAAAAC/anime-blush.gif',
	'https://c.tenor.com/dH4YL72had0AAAAC/blush-anime.gif',
	'https://c.tenor.com/YHahKqZIGpkAAAAC/anime-blushing.gif',
	'https://c.tenor.com/A8Xon5cq5sQAAAAC/bell-cranel-dan-machi.gif',
	'https://c.tenor.com/LSdo3dxZvuQAAAAC/boy-anime.gif',
	'https://c.tenor.com/eCJJ9gxZTxwAAAAC/hot-embarrased.gif',
	'https://c.tenor.com/6dS26RmScPQAAAAC/kawaii.gif',
];

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	],
});

const PREFIX = 'm!';
const botAuthor = '676503697252941856';

client.on('ready', () => {
	console.log('Bot is ready!   ' + client.user.tag);

	const arrayOfStatus = [
		'OwO',
		'UnU',
		'OnO',
		'UwU',
		'^w^',
		'<3',
		'Prefix is ;',
		'I luv Minty <3',
	];
	let index = 0;
	setInterval(() => {
		if (index === arrayOfStatus.length) index = 0;
		const status = arrayOfStatus[index];
		client.user.setStatus('idle');
		client.user.setActivity({
			name: status,
			type: 'STREAMING',
			url: 'https://www.twitch.tv/peety_uwu',
		});
		index++;
	}, 7000);
});

client.on('messageCreate', async (message) => {
	if (message.author.bot) return;

	const args = message.content.slice(PREFIX.length).split(/ +/);
	const command = args.shift().toLowerCase();
	const channel = message.channel;
	const author = message.author;
	const guild = message.guild;

	if (!message.content.startsWith(PREFIX)) return;

	//! actions commands
	if (command == 'hi') {
		hi(message, author, guild, channel, args);
	}
	if (command == 'kiss') {
		kiss(message, author, guild, channel, args);
	}
	if (command == 'hug') {
		hug(message, author, guild, channel, args);
	}
	if (command == 'cuddle') {
		cuddle(message, author, guild, channel, args);
	}
	if (command == 'poke') {
		poke(message, author, guild, channel, args);
	}
	if (command == 'pat') {
		pat(message, author, guild, channel, args);
	}
	if (command == 'feed') {
		feed(message, author, guild, channel, args);
	}
	if (command == 'tickle') {
		tickle(message, author, guild, channel, args);
	}
	if (command == 'baka') {
		baka(message, author, guild, channel, args);
	}
	if (command == 'blush') {
		blushAction(message, author, guild, channel, args);
	}
	if (command == 'hentai') {
		hentai(message, author, guild, channel, args);
	}
	if (command == 'tease') {
		tease(message, author, guild, channel, args);
	}
	if (command == 'sex') {
		sex(message, author, guild, channel, args);
	}

	//!help command
	if (command == 'help') {
		help(message, author, guild, channel, args);
	}

	//!moderation commands
	if (command == 'clear') {
		clearMsg(message, author, guild, channel, args);
	}
	if (command == 'kick') {
		kick(message, author, guild, channel, args);
	}
	if (command == 'ban') {
		ban(message, author, guild, channel, args);
	}

	//!moderation bot commands
	if (command == 'add') {
		if (author != '676503697252941856' || author != '915682058066608128		')
			return channel.send("You can't do that");
		if (!args) return channel.send('No args');
		let type = args[0];
		let gifURL = args[1];
		if (!type || !gifURL) return channel.send('Missing arg');

		Gifcmd.addGif({ type, gifURL });

		channel.send(`Added ${gifURL} to ${type}`);
	}

	//!others
	if (command == 'marry') {
		marry(message, author, guild, channel, args);
	}
	if (command == 'rdnumber') {
		rdnumber(message, author, guild, channel, args);
	}
});

// client.on('guildMemberAdd', (member) => {
// 	getCanvas(member);
// 	const messageSend = `Welcome <@${member.id}> to our server`;
// 	let welcomeChannel = member.guild.channels.cache.find(
// 		(channel) => channel.name === 'Welcome' || channel.name === 'welcome'
// 	);
// 	if (welcomeChannel) {
// 		welcomeChannel.send(messageSend);
// 	}
// 	if (!welcomeChannel) {
// 		let welcome;
// 		member.guild.channels.cache.forEach((channel) => {
// 			if (channel.type === 'text' && !welcome) welcome = channel;
// 		});

// 		welcome.send(messageSend);
// 	} else {
// 		console.log("Couldn't find channel");
// 	}
// });

client.on('guildMemberAdd', (member) => {
	getCanvas(member);
});

client.on('guildCreate', (guild) => {
	let channeltoSend;
	guild.channels.cache.forEach((channel) => {
		if (
			channel.type === 'text' &&
			!channeltoSend &&
			channel.permissionsFor(guild.me).has('SEND_MESSAGES')
		)
			channeltoSend = channel;
	});
	if (!channeltoSend) return;

	let channelEmbed = new Discord.MessageEmbed()
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
	await Canvas.loadImage(
		member.user.displayAvatarURL({ format: 'png', size: 1024 })
	).then((img) => canvas.context.drawImage(img, 393, 47, 238, 238));
	let atta = new Discord.MessageAttachment(
		canvas.create.toBuffer(),
		`welcome-${member.user.id}.png`
	);
	try {
		let welcomeChannel = member.guild.channels.cache.find(
			(channel) =>
				channel.name === 'Welcome' ||
				channel.name === 'welcome' ||
				channel.id == '927651408159850516'
		);
		if (welcomeChannel) {
			welcomeChannel.send(
				`:wave: Hello <@${member.user.id}> welcome to **${member.guild.name}**`,
				atta
			);
		}
		if (!welcomeChannel) {
			let welcome;
			member.guild.channels.cache.forEach((channel) => {
				if (channel.type === 'text' && !welcome) welcome = channel;
			});
			welcome.send(
				`:wave: Hello <@${member.user.id}> welcome to **${member.guild.name}**. We now currently have **${member.guild.memberCount}** members.`,
				atta
			);
		}
	} catch (e) {
		console.log(e);
	}
}

//! moderation
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
	let Embed = new Discord.MessageEmbed({
		color: '#ff0000',
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
	guild.members.ban(mention, reason);
	let Embed = new Discord.MessageEmbed({
		color: '#ff0000',
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
	if (args.length <= 0) return channel.send('Please enter a number');
	if (isNaN(args[0])) return channel.send('Please enter a number');
	if (parseInt(args[0]) <= 0 || parseInt(args[0]) > 100)
		return channel.send('Please enter number between 0 and 100');
	if (!message.member.permissions.has('MANAGE_MESSAGES'))
		return channel.send("U can't do that");
	channel.bulkDelete(args[0]);
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
	let gif = await aflbClient.sfw.kiss();
	let Embed = new Discord.MessageEmbed();
	Embed.setDescription(`${author} kisses ${args.join(' ')}`)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor('#ff0000');
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
	let gif = await aflbClient.sfw.hug();
	let Embed = new Discord.MessageEmbed();
	Embed.setDescription(`${author} hugs ${args.join(' ')}`)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor('#ff0000');
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
	let Embed = new Discord.MessageEmbed();
	Embed.setDescription(`${author} pokes ${args.join(' ')}`)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor('#ff0000');
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
	let gif = blush[Math.floor(Math.random() * blush.length)];
	let Embed = new Discord.MessageEmbed({
		color: '#ff0000',
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
	let Embed = new Discord.MessageEmbed();
	Embed.setDescription(`${author} cuddles ${args.join(' ')}`)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor('#ff0000');
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
	let Embed = new Discord.MessageEmbed();
	Embed.setDescription(`${author} feeds ${args.join(' ')}`)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor('#ff0000');
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
	let Embed = new Discord.MessageEmbed();
	Embed.setDescription(`${args.join(' ')} is baka`)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor('#ff0000');
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
	let Embed = new Discord.MessageEmbed();
	Embed.setDescription(`${author} tickles ${args.join(' ')}`)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor('#ff0000');
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
	let gif = await aflbClient.sfw.pat();
	let Embed = new Discord.MessageEmbed();
	Embed.setDescription(`${author} pats ${args.join(' ')}`)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor('#ff0000');
	channel.send({ embeds: [Embed] });
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
	let Embed = new Discord.MessageEmbed();
	Embed.setDescription(`${author} teases ${args.join(' ')}`)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor('#ff0000');
	channel.send({ embeds: [Embed] });
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
	let Embed = new Discord.MessageEmbed();
	Embed.setDescription(`${author} teases ${args.join(' ')}`)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor('#ff0000');
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
	let Embed = new Discord.MessageEmbed();
	Embed.setDescription(``)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor('#ff0000');
	channel.send({ embeds: [Embed] });
}

//! nsfw actions

async function hentai(message, author, guild, channel, args) {
	if (!channel.nsfw) return channel.send("This isn't NSFW channel");
	let gif = await aflbClient.nsfw.hentai_gif();
	let Embed = new Discord.MessageEmbed();
	Embed.setDescription(`${author} fucks ${args.join(' ')}`)
		.setImage(gif)
		.setTimestamp(new Date())
		.setColor('#ff0000');
	channel.send({ embeds: [Embed] });
}

//! help commands

function help(message, author, guild, channel, args) {
	let Embed;
	if (args.length <= 0) {
		Embed = new Discord.MessageEmbed({
			color: '#ff0000',
			title: 'Help list',
			thumbnail: { url: 'https://i.imgur.com/qRFFT4T.jpg' },
			fields: [
				{ name: 'Prefix', value: 'm!' },
				{
					name: 'Commands',
					value: 'To see all commands use `m!help all`',
				},
			],
		});
	} else if (args[0] == 'all') {
		Embed = new Discord.MessageEmbed({
			color: '#ff0000',
			title: 'Mewmew commands',
			thumbnail: { url: 'https://i.imgur.com/qRFFT4T.jpg' },
			fields: [
				{
					name: '🎭Actions',
					value: '`kiss`, `hug`, `poke`, `blush`, `cuddle`, `feed`, `baka`, `tickle`, `pat`, `hi`, `tease`',
				},
				{ name: '🎭Actions (NSFW)', value: '`hentai`,' },
				{ name: 'Moderation', value: '`kick`, `ban`, `clear`' },
				{ name: 'Others', value: '`marry`' },
			],
		});
	}

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

function rdnumber(message, author, guild, channel, args) {
	let number = Math.round(Math.random() * 100);
	channel.send(`Your random number is ${number}`);
}

//client.user.setActivity('Test', { type: 'CUSTOM_STATUS', name: 'Peety' });
client.login(
	'OTk3MDQ2Njc4MDQzNTA0NzIw.GIbZQA.3t3Hxx9OWq_UU2YmCp_w4xT1hIxtr6uze_9byc'
);
