class Pilgrim extends Sprite {
	constructor(animation, x, y, debug) {
		super(x, y);
		this.mapPosition = {
			x: Math.round(x),
			y: Math.round(y)
		};
		this.center = true; /* need better name */
		
		// this.position.x += Game.width/2;
		// this.position.y += Game.height/2;

		this.debug = debug || false;
		this.speed = new Cool.Vector(8, 8);
		
		this.addAnimation(animation);
		this.animation.state = 'idle';

		this.input = { right: false, up: false, left: false, down: false };
	}

	inputKey(key, state) {
		this.input[key] = state;
	}

	update() {
		let state = this.animation.stateName.includes('idle') ?
			this.animation.state :
			Cool.random(['idle', 'idle_2', 'idle_3', 'idle_1']);
			
		if (this.input.up) {
			if (this.mapPosition.y > gme.bounds.top)
				this.mapPosition.y -= this.speed.y;
			state = 'up';
		}
		if (this.input.down) {
			if (this.mapPosition.y < gme.bounds.bottom)
				this.mapPosition.y += this.speed.y;
			state = 'down';
		}
		if (this.input.right) {
			if (this.mapPosition.x < gme.bounds.right)
				this.mapPosition.x += this.speed.x;
			state = 'right';
		}
		if (this.input.left) {
			if (this.mapPosition.x > gme.bounds.left)
				this.mapPosition.x -= this.speed.x;
			state = 'left';
		}
		this.animation.state = state;
	}
}