const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hug')
		.setDescription('Hug gif')
		.addUserOption((option) =>
			option.setName(`mention`).setDescription(`Mention someone`)
		),
	async execute(interaction, opts) {
		let mention = interaction.options.getUser('mention');
		let author = interaction.user;
		let descMsg =
			interaction.options.data.length == 0
				? 'is hugging someone'
				: mention.id == author.id
				? 'wants a hug'
				: mention
				? `is kissing ${mention}`
				: 'err';
		if (descMsg == 'wants a hug')
			return interaction.reply(`${author} ${descMsg}`);
		let gif = await opts.aflbClient.sfw.hug();
		let Embed = new opts.EmbedBuilder();
		Embed.setDescription(`${author} ${descMsg}`)
			.setImage(gif)
			.setTimestamp(new Date())
			.setColor(0xff0000);
		interaction.reply({ embeds: [Embed] });
	},
};
