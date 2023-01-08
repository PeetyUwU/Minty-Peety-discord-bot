const EventEmitter = require('events');

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
	}

	/**
	 *
	 * @param {Object} member
	 * @param {Object} [opts]
	 */
	add(member, opts = {}) {
		let user = new User(member.user.id, member.guild, opts);
		this.users.push(user);
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
	constructor(id, guild, opts = {}) {
		if (!id) throw 'Missing parameters';

		this.id = id;
		this.marry = '';
		this.guilds = [];
		this.nyanlings = 0;
		this.games = {
			guessAnime: {
				win: 0,
				loose: 0,
				winPrice: 10,
			},
		};
	}

	addGuild() {}

	marry() {}

	divorce() {}
}

module.exports = UsersManager;
