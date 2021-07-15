class Pilgrim extends Sprite {
	constructor(animation, x, y, debug) {
		super(x, y);
		this.mapPosition = new Cool.Vector(Math.round(x), Math.round(y));
		this.center = true; /* need better name */
		
		this.debug = debug || false;
		this.speed = new Cool.Vector(8, 8);
		
		this.addAnimation(animation);
		this.animation.state = 'idle';

		this.input = { right: false, up: false, left: false, down: false };
		this.inBounds = {
			x: true,
			y: true,
		};

	}

	inputKey(key, state) {
		this.input[key] = state;
	}

	checkBounds(bounds, halfHeight, halfWidth) {
		this.inBounds.y = true;
		this.inBounds.x = true;

		if (this.mapPosition.y <= bounds.top && this.position.y <= halfHeight) {
			this.inBounds.y = false;

			if (this.position.y < -halfHeight) {
				this.position.y = halfHeight * 3;
				this.mapPosition.y = bounds.bottom;
			}
		}

		if (this.mapPosition.y >= bounds.bottom && this.position.y >= halfHeight) {
			this.inBounds.y = false;

			if (this.position.y > halfHeight * 3) {
				this.position.y = -halfHeight;
				this.mapPosition.y = bounds.top;
			}
		}

		if (this.inBounds.y && this.position.y !== halfHeight) {
			this.position.y = halfHeight;
		}

		if (this.mapPosition.x <= bounds.left && this.position.x <= halfWidth) {
			this.inBounds.x = false;

			if (this.position.x < -halfWidth) {
				this.position.x = halfWidth * 3;
				this.mapPosition.x = bounds.right;
			}
		}

		if (this.mapPosition.x >= bounds.right && this.position.x >= halfWidth) {
			this.inBounds.x = false;

			if (this.position.x > halfWidth * 3) {
				this.position.x = -halfWidth;
				this.mapPosition.x = bounds.left;
			}
		}

		if (this.inBounds.x && this.position.x !== halfWidth) {
			this.position.x = halfWidth;
		}

	}

	update(time) {
		let state = this.animation.stateName.includes('idle') ?
			this.animation.state :
			Cool.random(['idle', 'idle_2', 'idle_3', 'idle_1']);

		const speed = new Cool.Vector();

		// if (Object.values(this.input).filter(v => v).length > 2) return;
		// let inputCount = 0;
		// restrict three inputs?

		if (this.input.up) {
			speed.y = -this.speed.y;
			if (this.input.left || this.input.right) speed.y *= 0.71;
			
			if (this.input.left) state = 'up-left';
			else if (this.input.right) state = 'up-right';
			else state = 'up';
		}

		if (this.input.down) {
			speed.y = this.speed.y;
			if (this.input.left || this.input.right) speed.y *= 0.71;
			
			if (this.input.left) state = 'down-left';
			else if (this.input.right) state = 'down-right';
			else state = 'down';
		}

		if (this.input.left) {
			speed.x = -this.speed.x;
			if (this.input.up || this.input.down) speed.x *= 0.71;
			if (!this.input.up && !this.input.down) state = 'left';
		}


		if (this.input.right) {
			speed.x = this.speed.x;
			if (this.input.up || this.input.down) speed.x *= 0.71;
			if (!this.input.up && !this.input.down) state = 'right';
		}
		

		if (this.inBounds.x && this.inBounds.y) this.mapPosition.add(speed.multiply(time)).round();
		else if (!this.inBounds.x && !this.inBounds.y) this.position.add(speed.multiply(time)).round();
		else if (this.inBounds.x) {
			this.mapPosition.x += Math.floor(speed.x * time);
			this.position.y += Math.floor(speed.y * time);
		} else if (this.inBounds.y) {
			this.position.x += Math.floor(speed.x * time);
			this.mapPosition.y += Math.floor(speed.y * time);
		}
		
		this.animation.state = state;
	}
}