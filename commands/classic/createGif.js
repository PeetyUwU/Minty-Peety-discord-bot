module.exports = {
	name: 'creategif',
	description: 'Creates gif category',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		if (!opts.customBot.getManager(author.id)) return console.log(author); //channel.send("You can't do that");
		if (!args) return channel.send('No args');
		let name = args[0];
		let gifURL = args.slice(1);
		if (!name || !gifURL) return channel.send('Missing arg');

		let s = opts.Gifcmd.createGifCategory({ channel, name, gifURL });
		if (!s) return channel.send('This category already exists');
		channel.send(`Created ${name}`);
	},
};
