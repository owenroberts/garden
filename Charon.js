/*
	sprite that moves
	not really entity bc that is just updated based on map movement ...
*/

class Charon extends Sprite {
	constructor(x, y, animation, debug) {
		super(x, y);
		this.speed = [7, 0];
		this.mapPosition = [x, y];
		this.addAnimation(animation, () => {
			this.animation.play();
		});

		
		this.center = true;
		this.hasSFX = false;
	}

	addSFX(sfx) {
		this.sfx = [];
		sfx.forEach(clip => {
			const f = clip.currentSrc.split('/').pop();
			const type = f.split('-').shift();
			if (type === 'paddle') this.sfx.push(clip);
		})
		this.sfxCount = 0;
		this.sfxInterval = 48; // 24 / 2 + 1
		this.hasSFX = true;
	}


	checkBounds(bounds, halfWidth) {
		if (this.mapPosition[0] >= bounds.right + charon.width) {
			this.mapPosition[0] = bounds.left - charon.width - halfWidth - halfWidth;

		}
	}

	update(offset, time) {
		this.mapPosition[0] += time * this.speed[0];
		this.position[0] = this.mapPosition[0] + offset[0];
		this.position[1] = this.mapPosition[1] + offset[1];

		if (this.isOnScreen() && this.hasSFX) this.playSFX();
	}

	playSFX() {
		if (this.sfxCount === 0) {
			let index = Math.floor(Math.random() * this.sfx.length);
			this.sfx[index].play();
			this.sfxCount++;
		} else if (this.sfxCount === this.sfxInterval) {
			this.sfxCount = 0;
		} else {
			this.sfxCount++;
		}
	}
}