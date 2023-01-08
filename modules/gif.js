const fs = require('fs');

class Gif {
	/**
	 *
	 * @param {Object} opts options
	 */
	constructor(opts) {
		this.gifs = JSON.parse(fs.readFileSync('./database/gifs.json'));
	}

	/**
	 *
	 * @param {Object} opts
	 * @param {"blush"} opts.type
	 * @param {[String]} opts.gifURL
	 */
	addGif(opts) {
		if (!opts.type || opts.gifURL.length <= 0) throw 'Parameters missing';

		for (let u of opts.gifURL) {
			if (this.gifs[opts.type].includes(u)) continue;

			this.gifs[opts.type].push(u);
			console.log('err');
		}
		fs.writeFileSync(
			'./database/gifs.json',
			JSON.stringify(this.gifs, null, 2)
		);
		return this;
	}
	/**
	 *
	 * @param {Object} opts
	 * @param {String} opts.name
	 * @param {Object} opts.channel
	 * @param {[String]} [opts.gifURL]
	 */
	createGifCategory(opts) {
		if (!opts.name || !opts.channel) throw new Error('Missing parameters');
		if (this.gifs[opts.name]) return false;
		this.gifs[opts.name] = [];
		if (opts.gifURL) {
			for (let u of opts.gifURL) {
				if (this.gifs[opts.name].includes(u)) continue;
				this.gifs[opts.name].push(u);
			}
		}

		fs.writeFileSync(
			'./database/gifs.json',
			JSON.stringify(this.gifs, null, 2)
		);
		return this;
	}
}

module.exports = Gif;
