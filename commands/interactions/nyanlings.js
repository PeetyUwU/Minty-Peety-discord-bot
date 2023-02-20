const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cash')
		.setDescription('Sends cash ammount'),
	async execute(interaction, opts) {
		let nyanlings = opts.userManager.getNyanlings(interaction.user.id);
		return interaction.reply(
			`<@${interaction.user.id}>, you have ${nyanlings} Nyanlings🪙`
		);
	},
};
