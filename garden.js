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
});

gme.load({ 
	scenery: 'data/scenery.json',
	textures: 'data/textures.json',
	sprites: 'data/sprites.json'
}, false);

let pilgrim;
let userStarted = false;


// debug
let bounds = {
	top: -1000,
	bottom: 1000,
	right: 1000,
	left: -1000,
};

const wSoundBtn = document.getElementById('with')
wSoundBtn.addEventListener('click', userStart);
const wOutSoundBtn = document.getElementById('out')
wOutSoundBtn.addEventListener('click', userStart);

let halfHeight, halfWidth; // update on size change ...

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

	for (const key in gme.data.scenery.entries) {
		const { x, y } = gme.data.scenery.entries[key];
		gme.updateBounds({ x: x, y: y });
	}

	for (const key in gme.data.textures.entries) {
		const { locations } = gme.data.textures.entries[key];
		for (let i = 0; i < locations.length; i++) {
			gme.updateBounds(locations[i]);
		}
	}

	gme.bounds.top += Math.round(gme.view.height / 2);
	gme.bounds.bottom += Math.round(-gme.view.height / 2);
	gme.bounds.left += Math.round(gme.view.width / 2);
	gme.bounds.right += Math.round(-gme.view.width / 2);

	
	gme.scenes.game = new SHGScene(gme.bounds, gme.width, gme.height);


	pilgrim = new Pilgrim(gme.anims.sprites.pilgrim, gme.view.width / 2, gme.view.height / 2);

	for (const key in gme.data.scenery.entries) {
		const data = gme.data.scenery.entries[key];
		const s = new Entity({ x: data.x, y: data.y });
		s.addAnimation(gme.anims.scenery[key]);
		s.animation.play();
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
				gme.updateBounds(data.locations[i]);

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
}

function update(timeElapsed) {
	if (!userStarted) return;
	// console.log(timeElapsed / gme.dps); // how much more time has elapsed

	pilgrim.checkBounds(gme.bounds, halfHeight, halfWidth);
	pilgrim.update(timeElapsed / gme.dps);

	const offset = new Cool.Vector(gme.view.width - pilgrim.mapPosition.x, gme.view.height - pilgrim.mapPosition.y)
	gme.scenes.current.update(offset, [pilgrim.mapPosition.x - pilgrim.width / 2, pilgrim.mapPosition.y - pilgrim.height / 2]);
}

function draw() {
	if (!userStarted) return;
	gme.scenes.current.display([pilgrim.mapPosition.x - pilgrim.width / 2, pilgrim.mapPosition.y - pilgrim.height / 2]);
	pilgrim.display();
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