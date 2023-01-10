const EventEmitter = require('events');
const fs = require('fs');

/**
 * @typedef {"add"} Events
 */

/**
 * @callback Callback
 * @param {Object} user
 */

/**
 * @class User manager class for managing {@link User}
 * @extends EventEmitter
 */
class UsersManager extends EventEmitter {
	/**
	 *
	 * @param {Object} opts
	 */
	constructor(opts = {}) {
		super();
		this.fileName = opts.fileName || './database/users.json';
		this.users = JSON.parse(fs.readFileSync(this.fileName));
		this.games = ['Guess anime'];
	}

	checkUser(member) {
		let foundUser = false;
		this.users.forEach((user) => {
			if (user.id == member.user.id) {
				if (!user.guilds.includes(member.guild.id)) {
					user.guilds.push(member.guild.id);
				}
				foundUser = true;
				return;
			}
		});

		if (foundUser == false) {
			this.add(member, { tag: member.user.tag });
		}
	}

	/**
	 *
	 * @param {Object} member
	 * @param {Object} [opts]
	 * @param {String} opts.tag
	 */
	add(member, opts = {}) {
		let user = new User(member);
		this.users.push(user);
		this.updateDatabase();
	}

	/**
	 *
	 * @param {String} id user id
	 * @param {"guessAnime"} game game
	 */
	addNyanlings(id, game) {
		let user = this.getUser(id);
		let count = user.gainBoost * user.games[game].winPrice;
		user.nyanlings += count;
		this.users = this.users.map((u) => (u.id === id ? user : u));

		this.updateDatabase();

		return count;
	}

	/**
	 *
	 * @param {String} id author id
	 */
	getNyanlings(id) {
		let user = this.getUser(id);
		return user.nyanlings;
	}

	updateUser(id, user) {}

	getUser(userId) {
		return this.users.find((user) => user.id === userId);
	}

	updateDatabase() {
		fs.writeFileSync(this.fileName, JSON.stringify(this.users, null, 2));
	}

	/**
	 * Registers a listener for a specific event.
	 *
	 * @param {Events} event - The name of the event to listen for.
	 * @param {Callback} listener - The function to be called when the event is emitted.
	 *
	 * @event Test#change
	 * @param {string} value - The new value of the component.
	 *
	 * @returns {EventEmitter} The instance of the event emitter, allowing chaining of calls.
	 */
	on(event, listener) {
		this.addListener(event, listener);
		return this;
	}
}

/**
 * @class User class is used by {@link UsersManager} to create new users
 */
class User {
	/**
	 *
	 * @param {String} id id of a user
	 * @param {String} guild id of a guild
	 * @param {Object} [opts]
	 */
	constructor(member) {
		if (!member) throw 'Missing parameters';

		let guild;
		if (member.guild) {
			guild = [member.guild.id];
		} else {
			guild = member.guilds;
		}
		let games = member.games || {};
		let user = member.user || {};

		this.id = member.id;
		this.marry = member.marry || '';
		this.guilds = [...guild];
		this.nyanlings = member.nyanlings || 0;
		this.gainBoost = member.gainBoost || 1;
		this.tag = member.tag || user.tag || '';
		this.games = {
			guessAnime: {
				winPrice: 10,
			},
		};
	}

	addGuild() {}

	marry() {}

	divorce() {}
}

module.exports = UsersManager;
