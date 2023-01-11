const fs = require('fs');

class GuessAnime {
	static GUESSANIMEFILE = JSON.parse(
		fs.readFileSync('./database/guessAnime.json')
	);
	static gameTypes = ['Guess anime by picture', 'Guess character by picture'];
	constructor() {}

	/**
	 *
	 * @param {Object} opts
	 * @param {String} opts.name
	 * @param {Object[]} [opts.characters]
	 * @param {String} opts.picture
	 */
	static addAnime(opts) {
		if (!opts || !opts.picture || !opts.name) throw 'Parameters missing';

		opts.characters.forEach((ch) => {
			if (!ch.name || !ch.picture) throw 'Character parameters missing';

			try {
				new URL(ch.picture);
			} catch {
				throw 'Invalid URL';
			}
		});

		for (let gu of GuessAnime.GUESSANIMEFILE) {
			if (gu.name == opts.name)
				throw 'This anime already exists. Please use m!addCharacters';
		}

		try {
			new URL(opts.picture);
		} catch {
			throw 'Invalid URL';
		}

		GuessAnime.GUESSANIMEFILE.push(opts);

		fs.writeFileSync(
			'./database/guessAnime.json',
			JSON.stringify(GuessAnime.GUESSANIMEFILE, null, 2)
		);
	}

	/**
	 *
	 * @param {Object} opts
	 * @param {String} opts.name
	 * @param {Object[]} opts.characters
	 * @param {String} opts.characters[].name
	 * @param {String} opts.characters[].picture

	 */
	static addCharacter(opts) {
		if (!opts || !opts.name || opts.characters.length == 0)
			throw 'Parameters missing';

		opts.characters.forEach((ch) => {
			if (!ch.name || !ch.picture) throw 'Parameters missing';

			try {
				new URL(ch.picture);
			} catch {
				throw 'Invalid URL';
			}
		});

		let animeFound = false;
		for (let gA of GuessAnime.GUESSANIMEFILE) {
			let array1 = opts.name.trim().toLowerCase().split(' ');
			let array2 = gA.name.trim().toLowerCase().split(' ');

			array1 = array1.filter((element) => {
				return element !== '' && element !== ' ';
			});
			array2 = array1.filter((element) => {
				return element !== '' && element !== ' ';
			});

			array1.sort();
			array2.sort();

			let sortedString1 = array1.join(' ');
			let sortedString2 = array2.join(' ');

			if (sortedString2 == sortedString1) {
				animeFound = true;
				for (let ch of gA.characters) {
					opts.characters = opts.characters.filter(
						(nCh) => ch.name != nCh.name
					);
				}
				gA.characters.push(...opts.characters);
			}
		}

		if (animeFound == false) {
			throw 'Anime with that name not found. Please check the name or add the anime using m!addAnime';
		}

		fs.writeFileSync(
			'./database/guessAnime.json',
			JSON.stringify(GuessAnime.GUESSANIMEFILE, null, 2)
		);
	}

	static getRandomAnime() {
		let animeList = [];
		let anime = {
			character: {},
		};

		GuessAnime.GUESSANIMEFILE.forEach((gA) => {
			animeList.push(gA.name);
		});

		anime.name = animeList[Math.floor(Math.random() * animeList.length)];

		for (let gA of GuessAnime.GUESSANIMEFILE) {
			if (gA.name == anime.name) {
				let character =
					gA.characters[
						Math.floor(Math.random() * gA.characters.length)
					];
				anime.picture = gA.picture;
				anime.character.name = character.name;
				anime.character.picture = character.picture;
				anime.gameType =
					GuessAnime.gameTypes[
						Math.floor(Math.random() * GuessAnime.gameTypes.length)
					];
			}
		}

		return anime;
	}

	static getAnimeList() {
		let animeList = [];

		GuessAnime.GUESSANIMEFILE.forEach((gA) => {
			animeList.push(`**\`${gA.name}\`**`);
		});

		return animeList.sort((a, b) => 0.5 - Math.random()).join(', ');
	}
	/**
	 *
	 * @param {String} anime
	 */
	static getAnimeCharacters(anime) {
		let characters;
		let animeFound = false;
		GuessAnime.GUESSANIMEFILE.forEach((a) => {
			let array1 = anime.trim().toLowerCase().split(' ');
			let array2 = a.name.trim().toLowerCase().split(' ');

			array1 = array1.filter((element) => {
				return element !== '' && element !== ' ';
			});
			array2 = array1.filter((element) => {
				return element !== '' && element !== ' ';
			});

			array1.sort();
			array2.sort();

			let sortedString1 = array1.join(' ');
			let sortedString2 = array2.join(' ');
			if (sortedString1 == sortedString2) {
				animeFound = true;
				characters = a.characters;
			}
		});

		if (animeFound == false)
			throw "Anime with that name doens't exist or doesn't have any characters added!";

		let charactersString = [];
		characters.forEach((ch) => {
			charactersString.push(`**\`${ch.name}\`**`);
		});

		return charactersString.join(', ');
	}

	static getAnime(name) {
		if (!name) throw 'Prameters missing';

		let array1 = name.trim().toLowerCase().split(' ');

		array1 = array1.filter((element) => {
			return element !== '' && element !== ' ';
		});

		array1.sort();

		let sortedString1 = array1.join(' ');

		for (let gA of GuessAnime.GUESSANIMEFILE) {
			let array2 = gA.name.trim().toLowerCase().split(' ');

			array2 = array2.filter((element) => {
				return element != '' && element != ' ';
			});

			array2.sort();

			let sortedString2 = array2.join(' ');

			if (sortedString1 == sortedString2) {
				return gA;
			}
		}
		throw "Anime with that name doesn't exist";
	}

	/**
	 *
	 * @param {Object} opts
	 * @param {String} opts.name
	 * @param {String} opts.picture
	 * @param {Object[]} [opts.characters]
	 * @param {String} opts.characters[].name
	 * @param {String} opts.characters[].picture
	 */
	static editAnime(opts, changed) {
		if (!opts || !opts.picture || !opts.name || opts.characters.length == 0)
			throw 'Parameters missing';

		opts.characters.forEach((ch) => {
			if (!ch.name || !ch.picture) throw 'Character parameters missing';

			try {
				new URL(ch.picture);
			} catch {
				throw 'Invalid URL';
			}
		});

		GuessAnime.GUESSANIMEFILE = GuessAnime.GUESSANIMEFILE.filter((a) => {
			let array1 = changed.trim().toLowerCase().split(' ');
			let array2 = a.name.trim().toLowerCase().split(' ');

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

			return sortedString1 != sortedString2;
		});

		GuessAnime.GUESSANIMEFILE.push(opts);

		fs.writeFileSync(
			'./database/guessAnime.json',
			JSON.stringify(GuessAnime.GUESSANIMEFILE, null, 2)
		);
	}
}
module.exports = GuessAnime;
