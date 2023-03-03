const fs = require('fs');
const EventEmitter = require('events');

/**
 * @typedef {"databaseChange"} EventList
 */

/**
 * @type {EventList}
 * @ignore
 */
const EventList = {
	DatabaseChange: 'databaseChange',
};

/**
 * @callback Callback
 * @param {Object} value
 */

class Bot extends EventEmitter {
	static managerCount = 0;

	/**
	 *
	 * @param {String} name name of the bot
	 * @param {Object} discordClient name of the bot
	 * @param {Object} [opts] options
	 * @param {Number} [opts.id] id for the bot
	 * @param {String} [opts.filePath] path for JSON file with managers of the bot
	 * @param {Number} [opts.max] number of max managers (if empty it's infinite)
	 */
	constructor(name, discordClient, opts = {}) {
		if (!name || !discordClient) throw 'Missing parameters';

		if (isNaN(opts.id) && opts.id) throw "Id isn't number";

		if (typeof opts.filePath != 'string' && opts.filePath)
			throw `FilePath is typeof ${typeof opts.filePath} not string`;
		if (!fs.existsSync(opts.filePath) && opts.filePath)
			throw `File path ${opts.filePath} doesn't exist!`;

		if (isNaN(opts.max) && opts.max) throw "Max isn't number";

		super();
		this.name = name;
		this.id = opts.id || Math.floor(Math.random() * 100000);
		this.filePath = opts.filePath || './database/botManagers.json';
		this.managers = JSON.parse(fs.readFileSync(this.filePath));
		this.max = opts.max || false;
		this.discordClient = discordClient;

		this.on('databaseChange', this.updateManagerList);

		this.checkManagers();
		this.watchDatabase();
	}

	checkMaxNumber() {
		if (this.max == false) return true;
		return this.max > Bot.managerCount;
	}

	checkManagers() {
		this.managers.forEach((m) => {
			if (typeof m != 'string') {
				console.log(
					'\x1b[31m',
					'\x1b[1m',
					'\x1b[40m',
					`Invalid manager trying to run fix manager: ${m}`,
					'\x1b[0m'
				);
				this.fixManager(m);
			}
		});
	}

	/**
	 *
	 * @param {Object} manager manager object
	 * @param {Number} manager.id manager id
	 * @param {String} manager.tag manager id

	 */
	fixManager(manager) {
		if (manager.id) {
			try {
				this.discordClient.users
					.fetch(manager.id, false)
					.then((user) => {
						user.send(
							`There was an error with database and I can't confirm that your account is correctly saved. Please check if information below is correct. If not please message <@676503697252941856>`
						);
					});
			} catch (err) {
				console.log('\x1b[31m', '\x1b[1m', '\x1b[40m', err, '\x1b[0m');
			}
		}
	}

	/**
	 *
	 * @emits Bot#databaseChange
	 */
	watchDatabase() {
		fs.watch('./database/botManagers.json', (event, filename) => {
			console.log(` \x1b[1m \x1b[32m  Event is: ${event} \x1b[0m`);
			if (filename) {
				console.log(
					`\x1b[1m \x1b[36m filename provided: ${filename} \x1b[0m`
				);
				this.emit('databaseChange');
			} else {
				console.log(`\x1b[1m \x1b[36m filename not provided \x1b[0m`);
			}
		});
		console.log(`\x1b[1m \x1b[36m Watching for database changes \x1b[0m`);
	}

	/**
	 * updates managers from database
	 * @returns {this} this
	 */
	updateManagerList() {
		this.managers = JSON.parse(fs.readFileSync(this.filePath));
		return this;
	}
	/**
	 *
	 * @param {String} manager managers id
	 * @returns {this} this
	 */
	addManager(manager) {
		if (!manager) throw 'Missing parameters';

		this.managers.forEach((m) => {
			if (m == manager) {
				throw 'Manager already exists';
			}
		});

		this.managers.push(manager);

		fs.writeFileSync(this.filePath, JSON.stringify(this.managers, null, 2));

		return this;
	}

	/**
	 *
	 * @param {String} managers managers id
	 * @returns {Object} this
	 */
	removeManager(manager) {}

	/**
	 *
	 * @param {String} managers managers id
	 * @returns {Boolean}
	 */
	getManager(manager) {
		if (this.managers.includes(manager)) {
			return true;
		} else {
			return false;
		}
	}
	/**
	 * Registers a listener for a specific event.
	 *
	 * @param {EventList} event - The name of the event to listen for.
	 * @param {Callback} listener - The function to be called when the event is emitted.
	 *
	 * @returns {EventEmitter} The instance of the event emitter, allowing chaining of calls.
	 */
	on(event, listener) {
		this.addListener(event, listener);
		return this;
	}
}

module.exports = { Bot, EventList };
