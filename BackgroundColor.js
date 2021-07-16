/*
	manages changing background color
*/

function BackgroundColor(canvas, width, height) {

	let x, y; // current cell indexes
	let r = 255, g = 255, b = 255;
	let cellSize = [width / 16, height / 16];
	let halfWidth = width / 2, halfHeight = height / 2;

	this.update = function(position) {
		// get map cell

		// console.log(halfWidth, position[0], (halfWidth - position[0]) / 16)
		const x_ = Math.floor((halfWidth - position[0]) / cellSize[0]);
		const y_ = Math.floor((halfHeight - position[1]) / cellSize[1]);

		if (x_ === x && y_ === y) return; // same cell

		x = x_;
		y = y_;

		console.log(x, y);		

	};
}