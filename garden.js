/* what the hell am i doing */

const isMobile = Cool.mobilecheck();
if (isMobile) document.body.classList.add('mobile');

const gme = new Game({
	dps: 24,
	lineWidth: 1,
	zoom: isMobile ? 1 : 1.5,
	width: window.innerWidth,
	height: window.innerHeight,
	multiColor: true,
	checkRetina: true,
	debug: true,
	stats: true,
	suspend: true,
	events: isMobile ? ['touch'] : ['keyboard'],
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

let pilgrim, sfx = [];
let charon;
let userStarted = false;

const wSoundBtn = document.getElementById('with');
wSoundBtn.addEventListener('click', loadSound);
const wOutSoundBtn = document.getElementById('out');
wOutSoundBtn.addEventListener('click', userStart);

let halfHeight, halfWidth; // update on size change ...
// let bg = new BackgroundColor(gme.canvas, gme.bounds);


// https://stackoverflow.com/questions/31060642/preload-multiple-audio-files
function loadSound() {
	const audioFiles = [
		'forest-1.mp3',
		'forest-2.mp3',
		'forest-3.mp3',
		'forest-4.mp3',
		'forest-5.mp3',
		'forest-6.mp3',
		'grass-0.mp3',
		'grass-1.mp3',
		'grass-2.mp3',
		'grass-3.mp3',
		'grass-4.mp3',
		'grass-5.mp3',
		'grass-6.mp3',
		'grass-7.mp3',
		'grass-8.mp3',
		'grass-9.mp3',
		'ice-1.mp3',
		'ice-2.mp3',
		'ice-3.mp3',
		'ice-4.mp3',
		'ice-5.mp3',
		'mud-1.mp3',
		'mud-2.mp3',
		'mud-3.mp3',
		'mud-4.mp3',
		'mud-5.mp3',
		'mud-6.mp3',
		'mud-7.mp3',
		'road-1.mp3',
		'road-2.mp3',
		'road-3.mp3',
		'road-4.mp3',
		'road-5.mp3',
		'sand-1.mp3',
		'sand-2.mp3',
		'sand-3.mp3',
		'sand-4.mp3',
		'sand-5.mp3',
		'water-1.mp3',
		'water-2.mp3',
		'water-3.mp3',
		'water-4.mp3',
		'water-5.mp3',

	];

	function preloadAudio(url) {
		var audio = new Audio();
		audio.addEventListener('canplaythrough', loadedAudio, false);
		audio.src = url;
		sfx.push(audio);
	}

	let loaded = 0;
	function loadedAudio() {
		loaded++;
	    if (loaded === audioFiles.length) userStart(sfx);
	}

	for (let i = 0; i < audioFiles.length; i++) {
		preloadAudio(`./sfx/foot_steps/${audioFiles[i]}`);
	}
}

function userStart() {
	userStarted = true;
	if (sfx.length) pilgrim.addSFX(sfx);
	wSoundBtn.removeEventListener('click', userStart);
	wOutSoundBtn.removeEventListener('click', userStart);
	document.getElementById('splash').remove();
}

function start() {

	halfHeight = Math.round(gme.view.height / 2);
	halfWidth = Math.round(gme.view.width / 2);

	// done loading, show start/sound buttons
	document.getElementById('sound-splash').style.display = 'block';
	document.getElementById('title').textContent = '~~~ start garden ~~~';

	pilgrim = new Pilgrim(gme.anims.sprites.pilgrim, gme.view.halfWidth, gme.view.halfHeight);
	charon = new Charon(-halfWidth, 300, gme.anims.sprites.charon);

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

	charon.checkBounds(gme.bounds, halfWidth);
	charon.update(offset, timeElapsed / gme.dps);

}

function draw() {
	if (!userStarted) return;
	gme.scenes.current.display();
	charon.display();
	pilgrim.display();
	// bg.update([pilgrim.mapPosition[0] - pilgrim.position[0], pilgrim.mapPosition[1] - pilgrim.position[1]]);
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
		case 'h':
			if (!userStarted) loadSound();
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

/* mobile */
var startX, startY, startTime;
const swipeTime = 200;
const threshold = 30, restraint = 100;

function touchStart(ev) {
	const touchobj = ev.changedTouches[0];
	startX = touchobj.pageX;
	startY = touchobj.pageY;
	startTime = performance.now();

	// console.log(startX, startY, startTime);
}

function touchMove(ev) {
	const touchobj = ev.changedTouches[0];

	const deltaX = startX - touchobj.pageX;
	const deltaY = startY - touchobj.pageY;

	if (Math.abs(deltaX) > threshold) {
		if (deltaX < 0) {
			pilgrim.inputKey('right', true);
			pilgrim.inputKey('left', false);
		}
		else {
			pilgrim.inputKey('left', true);
			pilgrim.inputKey('right', false);
		} 
	} else {
		pilgrim.inputKey('left', false);
		pilgrim.inputKey('right', false);
	}

	if (Math.abs(deltaY) > threshold) {
		if (deltaY < 0) {
			pilgrim.inputKey('down', true);
			pilgrim.inputKey('up', false);
		} else {
			pilgrim.inputKey('up', true);
			pilgrim.inputKey('down', false);
		}
	} else {
		pilgrim.inputKey('down', false);
		pilgrim.inputKey('up', false);
	}
}

function touchEnd(ev) {
	pilgrim.inputKey('left', false);
	pilgrim.inputKey('up', false);
	pilgrim.inputKey('right', false);
	pilgrim.inputKey('down', false);
}