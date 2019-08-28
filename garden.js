Game.sprites = {};
Game.ui = {};
Game.scenes = []; /* should these be defaults? */
Game.init({
	canvas: "lines",
	width: window.innerWidth,
	height: window.innerHeight,
	lps: 12,
	mixedColors: true
});

Game.load({ ui: "/data/ui.json", sprites: "/data/sprites.json" }, { ui: UI, scenery: Item, textures: Texture }, Game.start);

let player;

function start() {
	Game.scene = 'game';
	player = new Player('/drawings/players/pilgrim.json', Game.width/2, Game.height/2);
}

function update() {

	if (Game.scene == 'game') 
		player.update();

	const offset = {
		x: Game.width - player.x,
		y: Game.height - player.y
	};

	for (const type in Game.sprites) {
		for (const key in Game.sprites[type]) {
			if (Game.sprites[type][key].scenes.includes(Game.scene))
				Game.sprites[type][key].update(offset);
		}
	}
}

function draw() {

	if (Game.scene == 'game')
		player.display();

	for (const type in Game.sprites) {
		for (const key in Game.sprites[type]) {
			if (Game.sprites[type][key].scenes.includes(Game.scene))
				Game.sprites[type][key].display();
		}
	}

	for (const key in Game.ui) {
		if (Game.ui[key].scenes.includes(Game.scene)) 
			Game.ui[key].display();
	}
}

/* events */
function keyDown(key) {
	switch (key) {
		case 'a':
		case 'left':
			player.inputKey('left', true);
			break;
		case 'w':
		case 'up':
			player.inputKey('up', true);
			break;
		case 'd':
		case 'right':
			player.inputKey('right', true);
			break;
		case 's':
		case 'down':
			player.inputKey('down', true);
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
			player.inputKey('left', false);
			break;
		case 'w':
		case 'up':
			player.inputKey('up', false);
			break;
		case 'd':
		case 'right':
			player.inputKey('right', false);
			break;
		case 's':
		case 'down':
			player.inputKey('down', false);
			break;

		case 'e':
			// socket.emit('key interact', false);
			break;
	}
}