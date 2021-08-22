/* what the hell am i doing */
import Doodoo from './dist/doodoo/doodoo.js';

const title = document.getElementById('title');
function loadingAnimation() {
	let t = '~' + title.textContent + '~';
	title.textContent = t;
}

let loadingInterval = setInterval(loadingAnimation, 1000 / 12);

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
	// debug: true,
	// stats: true,
	suspend: true,
	events: isMobile ? ['touch'] : ['keyboard', 'mouse'],
	scenes: ['game', 'splash', 'loading'],
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
	sprites: 'data/sprites.json',
	ui: 'data/ui.json',
}, false);

let pilgrim, sfx = [];
let charon;
let userStarted = false;
let halfHeight, halfWidth; // update on size change ...

function loadSound() {
	gme.scenes.current = 'loading';
	// https://stackoverflow.com/questions/31060642/preload-multiple-audio-files
	const audioFiles = [
		'foot_steps/forest-1.mp3',
		'foot_steps/forest-2.mp3',
		'foot_steps/forest-3.mp3',
		'foot_steps/forest-4.mp3',
		'foot_steps/forest-5.mp3',
		'foot_steps/forest-6.mp3',
		'foot_steps/grass-0.mp3',
		'foot_steps/grass-1.mp3',
		'foot_steps/grass-5.mp3',
		'foot_steps/grass-6.mp3',
		'foot_steps/grass-7.mp3',
		'foot_steps/grass-8.mp3',
		'foot_steps/grass-9.mp3',
		'foot_steps/ice-1.mp3',
		'foot_steps/ice-2.mp3',
		'foot_steps/ice-3.mp3',
		'foot_steps/ice-4.mp3',
		'foot_steps/ice-5.mp3',
		'foot_steps/mud-1.mp3',
		'foot_steps/mud-2.mp3',
		'foot_steps/mud-3.mp3',
		'foot_steps/mud-4.mp3',
		'foot_steps/mud-5.mp3',
		'foot_steps/mud-6.mp3',
		'foot_steps/mud-7.mp3',
		'foot_steps/road-1.mp3',
		'foot_steps/road-2.mp3',
		'foot_steps/road-3.mp3',
		'foot_steps/road-4.mp3',
		'foot_steps/road-5.mp3',
		'foot_steps/sand-1.mp3',
		'foot_steps/sand-2.mp3',
		'foot_steps/sand-3.mp3',
		'foot_steps/sand-4.mp3',
		'foot_steps/sand-5.mp3',
		'foot_steps/water-1.mp3',
		'foot_steps/water-2.mp3',
		'foot_steps/water-3.mp3',
		'foot_steps/water-4.mp3',
		'foot_steps/water-5.mp3',
		'foot_steps/wind-1.mp3',
		'foot_steps/wind-2.mp3',
		'foot_steps/wind-3.mp3',
		'foot_steps/wind-4.mp3',
		'foot_steps/wind-5.mp3',
		'foot_steps/wind-6.mp3',
		'paddles/paddle-1.mp3',
		'paddles/paddle-2.mp3',
		'paddles/paddle-3.mp3',
		'paddles/paddle-4.mp3',
		'paddles/paddle-5.mp3',
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
	    // if (loaded === audioFiles.length) userStart();
	}

	for (let i = 0; i < audioFiles.length; i++) {
		preloadAudio(`./sfx/${audioFiles[i]}`);
	}

	let doodooLoaded = false;
	let doodoo = new Doodoo({
		tonic: 'C4', 
		parts: [
			'C4', null, 'E3', 'F3', 'G3', null, 'D3', 'E3', 
			'D3', 'F3', 'E3', 'D3', 'F3', 'E3', 'D3', 'F3', 
		]},
		function() {
			doodooLoaded = true;
		}
	);

	const loader = setInterval(() => {
		if (loaded === audioFiles.length && doodooLoaded) {
			clearInterval(loader);
			userStart();
		}
	}, 1000 / 30);
}

function userStart() {
	userStarted = true;
	if (sfx.length) {
		pilgrim.addSFX(sfx);
		charon.addSFX(sfx);
	}
	gme.scenes.current = 'game';
}

window.start = function() {

	halfHeight = Math.round(gme.view.height / 2);
	halfWidth = Math.round(gme.view.width / 2);

	// done loading, show start/sound buttons
	// document.getElementById('sound-splash').style.display = 'block';
	document.getElementById('splash').remove();
	clearInterval(loadingInterval);
	
	let splash = new UI({
		x: 0.5,
		y: isMobile ? 128 : 0.25,
		animation: gme.anims.ui.start,
	});
	gme.scenes.splash.addToDisplay(splash);

	let loading = new UI({
		x: 0.5,
		y: 0.5,
		animation: gme.anims.ui.loading,
	});
	gme.scenes.loading.addToDisplay(loading);

	let desktop = new UI({
		x: 0.5,
		y: isMobile ? 128 : 0.25,
		animation: gme.anims.ui.desktopInstructions,
	});
	desktop.isActive = false;
	gme.scenes.splash.addToDisplay(desktop);

	let mobile = new UI({
		x: 0.5,
		y: isMobile ? 128 : 0.25,
		animation: gme.anims.ui.mobileInstructions,
	});
	mobile.isActive = false;
	gme.scenes.splash.addToDisplay(mobile);

	gme.scenes.splash.addUI(new UI({
		x: isMobile ? 0.5 : 0.3,
		y: isMobile ? -256 - 64 : 0.6,
		isButton: true,
		animation: gme.anims.ui.wSound,
		onClick: loadSound,
	}));
	
	gme.scenes.splash.addUI(new UI({
		x: isMobile ? 0.5 : 0.7,
		y: isMobile ? -64 - 128 : 0.6,
		animation: gme.anims.ui.woutSound,
		isButton: true,
		onClick: userStart,
	}));

	let isWhat = false;
	gme.scenes.splash.addUI(new UI({
		x: 0.5,
		y: isMobile ? -64 : 0.9,
		animation: gme.anims.ui.what,
		isButton: true,
		onClick: () => {
			if (isWhat) {
				splash.isActive = true;
				if (isMobile) mobile.isActive = false;
				else desktop.isActive = false;
			} else {
				splash.isActive = false;
				if (isMobile) mobile.isActive = true;
				else desktop.isActive = true;
			}
			isWhat = !isWhat;

		},
	}));

	gme.scenes.current = 'splash';

	pilgrim = new Pilgrim(gme.anims.sprites.pilgrim, gme.view.halfWidth, gme.view.halfHeight);
	charon = new Charon(-halfWidth, 300, gme.anims.sprites.charon);

	gme.bounds.top += Math.round(gme.halfHeight + pilgrim.height / 2);
	gme.bounds.left += Math.round(gme.halfWidth + pilgrim.width);

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
};

window.update = function(timeElapsed) {
	pilgrim.checkBounds(gme.bounds, halfHeight, halfWidth);
	pilgrim.update(timeElapsed / gme.dps);

	const offset = [gme.view.width - pilgrim.mapPosition[0], gme.view.height - pilgrim.mapPosition[1]];
	gme.scenes.current.update(offset, [pilgrim.mapPosition[0] - pilgrim.width / 2, pilgrim.mapPosition[1] - pilgrim.height / 2]);

	charon.checkBounds(gme.bounds, halfWidth);
	if (gme.scenes.currentName === 'game') charon.update(offset, timeElapsed / gme.dps);
};

window.draw = function() {
	gme.scenes.current.display();
	if (gme.scenes.currentName === 'game') {
		charon.display();
		pilgrim.display();
	}
};

/* events */
window.keyDown = function(key) {
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
};

window.keyUp = function(key) {
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
};

window.mouseMoved = function(x, y) {
	if (gme.scenes.currentName === 'splash') {
		gme.scenes.current.mouseMoved(x, y);
	}
};

window.mouseDown = function(x, y, button) {
	if (gme.scenes.currentName === 'splash') {
		gme.scenes.current.mouseDown(x, y);
	}
	if (button === 3) blurHandler();
};


window.mouseUp = function(x, y) {
	if (gme.scenes.currentName === 'splash') {
		gme.scenes.current.mouseUp(x, y);
	}
};

/* mobile */
var startX, startY, startTime;
const swipeTime = 200;
const threshold = 30, restraint = 100;

window.touchStart = function(ev) {
	const touchobj = ev.changedTouches[0];
	startX = touchobj.pageX;
	startY = touchobj.pageY;

	if (gme.scenes.currentName === 'splash') {
		gme.scenes.current.mouseDown(startX, startY);
		return;
	}

	startTime = performance.now();
};

window.touchMove = function(ev) {
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
};

window.touchEnd = function(ev) {

	if (gme.scenes.currentName === 'splash') {
		gme.scenes.current.mouseUp(startX, startY);
		return;
	}

	pilgrim.inputKey('left', false);
	pilgrim.inputKey('up', false);
	pilgrim.inputKey('right', false);
	pilgrim.inputKey('down', false);
};

// stop walking when user leaves
function blurHandler() {
	for (const k in pilgrim.input) {
		pilgrim.input[k] = false;
	}
}

window.addEventListener('blur', blurHandler);