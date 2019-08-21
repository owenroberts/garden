class Player extends Sprite {
	constructor(src, x, y, debug) {
		super(x, y);
		this.x = x;
		this.y = y;
		this.center = true; /* need better name */
		
		// this.position.x += Game.width/2;
		// this.position.y += Game.height/2;

		this.debug = debug || false;
		this.speed = new Cool.Vector(5, 5);
		
		this.addAnimation(src, () => {
			this.animation.states = {
				"idle": { "start": 0, "end": 4 },
				"right": { "start": 4, "end": 8 },
				"left": { "start": 8, "end": 12 },
				"down": { "start": 12, "end": 14 },
				"up": { "start": 14, "end": 16 },
				"flower": { "start": 16, "end": 19 },
				"skull": { "start": 19, "end": 23 },
				"apple-x": { "start": 23, "end": 27 },
				"heart": { "start": 27, "end": 32 },
				"wave": { "start": 32, "end": 36 },
				"drop-heart": { "start": 36, "end": 40 },
				"drop-flower": { "start": 40, "end": 43 },
				"drop-skull": { "start": 43, "end": 46 }
			}; /* obvi needs to be in data */
			this.animation.state = 'idle';
		});

		this.input = { right: false, up: false, left: false, down: false };
	}

	inputKey(key, state) {
		this.input[key] = state;
	}

	update() {
		let state = 'idle';
		if (this.input.up) {
			if (this.y > Game.bounds.top)
				this.y -= this.speed.y;
			state = 'up';
		}
		if (this.input.down) {
			if (this.y < Game.bounds.bottom)
				this.y += this.speed.y;
			state = 'down';
		}
		if (this.input.right) {
			if (this.x < Game.bounds.right)
				this.x += this.speed.x;
			state = 'right';
		}
		if (this.input.left) {
			if (this.x > Game.bounds.left)
				this.x -= this.speed.x;
			state = 'left';
		}
		this.animation.setState(state);
	}
}