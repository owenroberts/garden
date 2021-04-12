/* what the hell am i doing */
const gme = new Game({
	dps: 24,
	width: window.innerWidth,
	height: window.innerHeight,
	mixedColors: true,
	checkRetina: true,
	debug: true,
	stats: true,
	suspend: false,
	scenes: ['game']
});

gme.load({ 
	scenery: 'data/scenery.json',
	textures: 'data/textures.json',
	sprites: 'data/sprites.json'
}, false);

let pilgrim;

function start() {
	pilgrim = new Pilgrim(gme.anims.sprites.pilgrim, gme.width/2, gme.height/2);

	for (const key in gme.data.scenery.entries) {
		const data = gme.data.scenery.entries[key];
		const s = new Entity({ x: data.x, y: data.y });
		s.addAnimation(gme.anims.scenery[key]);
		gme.scenes.add(s, data.scenes);
		gme.updateBounds(s.position);
	}

	for (const key in gme.data.textures.entries) {
		const data = gme.data.textures.entries[key];
		gme.scenes.add(new Texture({
			animation: gme.anims.textures[key],
			locations: data.locations,
			frame: 'index'
		}), data.scenes);
		for (let i = 0; i < data.locations.length; i++) {
			gme.updateBounds(data.locations[i]);
		}
	}
}

function update(timeElapsed) {
	// console.log(timeElapsed / gme.dps); // how much more time has elapsed
	pilgrim.update(timeElapsed / gme.dps);
	const offset = new Cool.Vector(gme.width - pilgrim.mapPosition.x, gme.height - pilgrim.mapPosition.y)
	gme.scenes.current.update(offset);
}

function draw() {
	gme.scenes.current.display();
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

		case 'e':
			// socket.emit('key interact', true);
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

		case 'e':
			// socket.emit('key interact', false);
			break;
	}
}