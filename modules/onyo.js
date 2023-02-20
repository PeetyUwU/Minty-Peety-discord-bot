const EventEmitter = require('events');

/**
 * @typedef {"patMoodBoost"| "patBoostReduce" | "moodChange" | "ready"} Events
 */

function delay(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

class Onyo extends EventEmitter {
	/**
	 *
	 * @param {Object} opts options
	 */
	static catCount = 0;
	//TODO: make names
	static names = [
		'Nyoop',
		'Saki',
		'Kirumi',
		'Banyanaa',
		'Bloopery',
		'Molly',
		'Viola',
		'Orion',
	];
	static greetings = ['Hi!'];
	static maxFeed = 3;
	static maxPetMood = 20;
	static moodLevels = {
		cheerfull: 100,
		happy: 75,
		neutral: 50,
		unhappy: 25,
		sad: 10,
		'very sad': 0,
	};

	static checkMood(mood) {
		let moodText = '';
		let moodLevels = Onyo.moodLevels;
		for (let m in moodLevels) {
			if (mood <= moodLevels[m]) {
				moodText = m;
			}
		}
		return moodText;
	}

	static randomName() {
		return Onyo.names[Math.floor(Math.random() * Onyo.names.length)];
	}

	constructor(name, opts = {}) {
		super();
		Onyo.catCount++;

		this.name = name || Onyo.randomName();
		this.mood = 100;
		this.patMoodBoost = 0;
		this.patMoodBoostTimer = false;

		this.on('patMoodBoost', async (v) => {
			if (this.patMoodBoostTimer) return;

			this.patMoodBoostTimer = true;
			while (this.patMoodBoost > 0) {
				//TODO: change to 7200000 instead of 2000
				await delay(2000);
				this.patMoodBoost--;
				this.emit('patBoostReduce', this.patMoodBoost);
			}
			this.patMoodBoostTimer = true;
		});

		this.on('ready', async () => {
			while (true) {
				await delay(1800000);
				this.mood--;
				this.emit('moodChange', this.mood);
			}
		});

		this.emit('ready');
	}

	greet() {
		return Onyo.greetings[
			Math.floor(Math.random() * Onyo.greetings.length)
		];
	}

	pat() {
		if (this.patMoodBoost == 3) return false;
		else {
			this.patMoodBoost++;
			this.mood = this.mood <= 95 ? (this.mood += 5) : this.mood;
			this.emit('patMoodBoost', this.patMoodBoost);
			this.emit('moodChange', this.mood);
			return true;
		}
	}

	play(toy) {}

	/**
	 * Registers a listener for a specific event.
	 *
	 * @param {Events} event - The name of the event to listen for.
	 * @param {Function} listener - The function to be called when the event is emitted.
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

let x = new Onyo();
x.on('patMoodBoost', (v) => {
	console.log(v);
});
x.on('patBoostReduce', (v) => {
	console.log(v);
});
x.on('moodChange', (v) => {
	console.log(v);
});

x.pat();
x.pat();
x.pat();
x.pat();
x.pat();

setTimeout(() => x.pat(), 3000);
