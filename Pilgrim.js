class Pilgrim extends Sprite {
	constructor(animation, x, y, debug) {
		super(x, y);
		this.mapPosition = new Cool.Vector(Math.round(x), Math.round(y));
		// {
		// 	x: Math.round(x),
		// 	y: Math.round(y)
		// };
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

	update(time) {
		let state = this.animation.stateName.includes('idle') ?
			this.animation.state :
			Cool.random(['idle', 'idle_2', 'idle_3', 'idle_1']);

		const speed = new Cool.Vector();

		if (Object.values(this.input).filter(v => v).length > 2) return;
			
		if (this.input.up) {
			if (this.mapPosition.y > gme.bounds.top) speed.y = -this.speed.y;
			if (this.input.left || this.input.right) speed.y *= 0.71;
			
			if (this.input.left) state = 'up-left';
			else if (this.input.right) state = 'up-right';
			else state = 'up';
		}

		if (this.input.down) {
			if (this.mapPosition.y > gme.bounds.top) speed.y = this.speed.y;
			if (this.input.left || this.input.right) speed.y *= 0.71;
			
			if (this.input.left) state = 'down-left';
			else if (this.input.right) state = 'down-right';
			else state = 'down';
		}

		if (this.input.left) {
			if (this.mapPosition.x < gme.bounds.right) speed.x = -this.speed.x;
			if (this.input.up || this.input.down) speed.x *= 0.71;
			if (!this.input.up && !this.input.down) state = 'left';
		}


		if (this.input.right) {
			if (this.mapPosition.x < gme.bounds.right) speed.x = this.speed.x;
			if (this.input.up || this.input.down) speed.x *= 0.71;
			if (!this.input.up && !this.input.down) state = 'right';
		}
		
		this.mapPosition.add(speed.multiply(time));
		this.animation.state = state;
	}
}