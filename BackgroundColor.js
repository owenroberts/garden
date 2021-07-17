/*
	manages changing background color
*/

function BackgroundColor(canvas, bounds) {

	let x, y; // current cell indexes
	let r = 255, g = 255, b = 255;

	let top = Math.abs(bounds.top),
		left = Math.abs(bounds.left),
		bottom = Math.abs(bounds.bottom),
		right = Math.abs(bounds.right);

	this.update = function(position) {
		// get map cell

		const y_ = position[1] > 0 ? 
			Math.floor((position[1] / bounds.top) * 16) :
			Math.floor((position[1] / bounds.bottom) * 16);


		// if (x_ === x && y_ === y) return; // same cell
		if (y_ === y) return; // same cell

		// x = x_;
		y = y_;


		r = Math.round(
				position[1] > 0 ? 
					Cool.map(position[1], 0, bounds.bottom, 255, 220) :
					Cool.map(Math.abs(position[1]), 0, Math.abs(bounds.top), 255, 220)
			);

		g = Math.round(
				position[1] > 0 ?
					Cool.map(position[1], 0, bounds.bottom, 255, 220) :
					Cool.map(Math.abs(position[1]), 0, Math.abs(bounds.top), 255, 220)
			);

		b = Math.round(
				position[1] > 0 ?
					Cool.map(position[1], 0, bounds.bottom, 255, 200) :
					Cool.map(Math.abs(position[1]), 0, Math.abs(bounds.top), 255, 250)
			);

		console.log(r, g, b);
		canvas.style.backgroundColor = `rgb(${r},${g},${b}`;

	};
}