class Pilgrim extends Sprite {
	constructor(animation, x, y, debug) {
		super(x, y);
		// this.mapPosition = new Cool.Vector(Math.round(x), Math.round(y));
		this.mapPosition = [Math.round(x), Math.round(y)];
		this.center = true; /* need better name */
		
		this.debug = debug || false;
		this.speed = [8, 8];
		
		this.addAnimation(animation);
		this.animation.state = 'idle';

		this.input = { right: false, up: false, left: false, down: false };
		this.inBounds = [true, true];
	}

	inputKey(key, state) {
		this.input[key] = state;
	}

	checkBounds(bounds, halfHeight, halfWidth) {
		this.inBounds = [true, true];

		if (this.mapPosition[1] <= bounds.top && this.position[1] <= halfHeight) {
			this.inBounds[1] = false;

			if (this.position[1] < -halfHeight) {
				this.position[1] = halfHeight * 3;
				this.mapPosition[1] = bounds.bottom;
			}
		}

		if (this.mapPosition[1] >= bounds.bottom && this.position[1] >= halfHeight) {
			this.inBounds[1] = false;

			if (this.position[1] > halfHeight * 3) {
				this.position[1] = -halfHeight;
				this.mapPosition[1] = bounds.top;
			}
		}

		if (this.inBounds[1] && this.position[1] !== halfHeight) {
			this.position[1] = halfHeight;
		}

		if (this.mapPosition[0] <= bounds.left && this.position[0] <= halfWidth) {
			this.inBounds[0] = false;

			if (this.position[0] < -halfWidth) {
				this.position[0] = halfWidth * 3;
				this.mapPosition[0] = bounds.right;
			}
		}

		if (this.mapPosition[0] >= bounds.right && this.position[0] >= halfWidth) {
			this.inBounds[0] = false;

			if (this.position[0] > halfWidth * 3) {
				this.position[0] = -halfWidth;
				this.mapPosition[0] = bounds.left;
			}
		}

		if (this.inBounds[0] && this.position[0] !== halfWidth) {
			this.position[0] = halfWidth;
		}
	}

	update(time) {
		let state = this.animation.stateName.includes('idle') ?
			this.animation.state :
			Cool.random(['idle', 'idle_2', 'idle_3', 'idle_1']);

		const speed = [0, 0];

		// if (Object.values(this.input).filter(v => v).length > 2) return;
		// let inputCount = 0;
		// restrict three inputs?

		if (this.input.up) {
			speed[1] = -this.speed[1];
			if (this.input.left || this.input.right) speed[1] *= 0.71;
			
			if (this.input.left) state = 'up-left';
			else if (this.input.right) state = 'up-right';
			else state = 'up';
		}

		if (this.input.down) {
			speed[1] = this.speed[1];
			if (this.input.left || this.input.right) speed[1] *= 0.71;
			
			if (this.input.left) state = 'down-left';
			else if (this.input.right) state = 'down-right';
			else state = 'down';
		}

		if (this.input.left) {
			speed[0] = -this.speed[0];
			if (this.input.up || this.input.down) speed[0] *= 0.71;
			if (!this.input.up && !this.input.down) state = 'left';
		}


		if (this.input.right) {
			speed[0] = this.speed[0];
			if (this.input.up || this.input.down) speed[0] *= 0.71;
			if (!this.input.up && !this.input.down) state = 'right';
		}

		if (this.inBounds[0]) this.mapPosition[0] += Math.floor(speed[0] * time);
		else this.position[0] += Math.floor(speed[0] * time);

		if (this.inBounds[1]) this.mapPosition[1] += Math.floor(speed[1] * time);
		else this.position[1] += Math.floor(speed[1] * time);
		
		
		this.animation.state = state;
	}
}