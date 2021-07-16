/* what the hell am i doing */

const gme = new Game({
	dps: 24,
	lineWidth: 1,
	zoom: 1.5,
	width: window.innerWidth,
	height: window.innerHeight,
	multiColor: true,
	checkRetina: true,
	debug: true,
	stats: true,
	suspend: true,
	scenes: ['game'],
	bounds: {
		left: -5000,
		top: -4000,
		right: 5000,
		bottom: 10000,
	}
});

gme.load({ 
	scenery: 'data/scenery.json',
	textures: 'data/textures.json',
	sprites: 'data/sprites.json'
}, false);

let pilgrim;
let userStarted = false;


const wSoundBtn = document.getElementById('with')
wSoundBtn.addEventListener('click', userStart);
const wOutSoundBtn = document.getElementById('out')
wOutSoundBtn.addEventListener('click', userStart);

let halfHeight, halfWidth; // update on size change ...
let bg = new BackgroundColor(gme.canvas, gme.bounds.right - gme.bounds.left, gme.bounds.bottom - gme.bounds.top);

function userStart() {
	userStarted = true;
	wSoundBtn.removeEventListener('click', userStart);
	wOutSoundBtn.removeEventListener('click', userStart);
	document.getElementById('splash').remove();
}

function start() {

	// done loading, show start/sound buttons
	document.getElementById('sound-splash').style.display = 'block';
	document.getElementById('title').textContent = '~~~ start garden ~~~';

	pilgrim = new Pilgrim(gme.anims.sprites.pilgrim, gme.view.halfWidth, gme.view.halfHeight);

	gme.bounds.top += Math.round(gme.halfHeight + pilgrim.height / 2);
	gme.bounds.left += Math.round(gme.halfWidth + pilgrim.width / 2);

	gme.scenes.game = new SHGScene(gme.bounds, gme.width, gme.height);

	for (const key in gme.data.scenery.entries) {
		const data = gme.data.scenery.entries[key];
		const s = new Entity({ 
			x: data.x, 
			y: data.y,
			animation: gme.anims.scenery[key],
			play: true,
		});
		gme.scenes.game.addSprite(s);
	}

	for (const key in gme.data.textures.entries) {
		const data = gme.data.textures.entries[key];
		// gme.scenes.add(new Texture({
		// 	animation: gme.anims.textures[key],
		// 	locations: data.locations,
		// 	frame: 'index'
		// }), data.scenes);
		for (let i = 0; i < data.locations.length; i++) {
			if (i <= gme.anims.textures[key].endFrame) {

				gme.scenes.game.addSprite(new TextureEntity({
					x: data.locations[i].x,
					y: data.locations[i].y,
					animation: gme.anims.textures[key],
					stateIndex: i,
				}));
			}
		}
	}


	halfHeight = Math.round(gme.view.height / 2);
	halfWidth = Math.round(gme.view.width / 2);
}

function sizeCanvas() {
	halfHeight = Math.round(gme.view.height / 2);
	halfWidth = Math.round(gme.view.width / 2);

	// update grid scene
}

function update(timeElapsed) {
	if (!userStarted) return;
	// console.log(timeElapsed / gme.dps); // how much more time has elapsed

	pilgrim.checkBounds(gme.bounds, halfHeight, halfWidth);
	pilgrim.update(timeElapsed / gme.dps);

	const offset = [gme.view.width - pilgrim.mapPosition[0], gme.view.height - pilgrim.mapPosition[1]];
	gme.scenes.current.update(offset, [pilgrim.mapPosition[0] - pilgrim.width / 2, pilgrim.mapPosition[1] - pilgrim.height / 2]);
}

function draw() {
	if (!userStarted) return;
	gme.scenes.current.display();
	pilgrim.display();
	bg.update(pilgrim.mapPosition);
}

/* events */
function keyDown(key) {
	switch (key) {
		case 'a':
		case 'left':
			pilgrim.inputKey('left', true);
			break;
		case 'w':
		case 'up':
			pilgrim.inputKey('up', true);
			break;
		case 'd':
		case 'right':
			pilgrim.inputKey('right', true);
			break;
		case 's':
		case 'down':
			pilgrim.inputKey('down', true);
			break;

		case 'g':
			if (!userStarted) userStart();
		break;
	}
}

function keyUp(key) {
	switch (key) {
		case 'a':
		case 'left':
			pilgrim.inputKey('left', false);
			break;
		case 'w':
		case 'up':
			pilgrim.inputKey('up', false);
			break;
		case 'd':
		case 'right':
			pilgrim.inputKey('right', false);
			break;
		case 's':
		case 'down':
			pilgrim.inputKey('down', false);
			break;
	}
}