module.exports = {
	name: 'queue',
	description: 'queue',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, author, guild, channel, args, opts) => {
		const queue = opts.clientDistube.getQueue(message);
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
	},
};
