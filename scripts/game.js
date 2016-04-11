var game = new Phaser.Game(512, 512, Phaser.CANVAS, 'BattleGum', { preload: preload, create: create, update: update, render : render });
var blinkDefaultCounter = 10;
var blinkDefaultDelay = 0.25;
var blinkCounterStart = blinkDefaultCounter;
var blinkDelayStart = blinkDefaultDelay;
var blinkCounter = blinkDefaultCounter;
var blinkDelay = blinkDefaultDelay;
var boundary = { up: 288, down: 432 };
var debug = false;
var gameRunning = false;
var gameScreen;
var hearts_x = [8, 104, 200, 296, 392]; // TODO: deprecate this
var jumpVelocity = 500;
var lanesX = [433, 433];
var lanesY = [176, 272];
var lastWallSpawnTime = 0;
var lastWallSpawned = 0;
var level = 0;
var lives = 1;
var menuScreen;
var menuScreenIsActive = true;
var scrollSpeed = 8;
var scale = 8;
var speed = 10;
var walls = new Array();
var wallStatus = [false, false];
var wallSpawnInAction = false;
var wallSpawnDelay = 1;

function preload() {
	game.stage.smoothed = false;
	game.stage.backgroundColor = 'black';
	game.load.image('tutorial', './sprites/tutorial.png');
	game.load.image('Gumble-menu', './sprites/Gumble-menu.png');
	game.load.image('press-start', './sprites/press-start.png');

	game.load.image('roadmap', './sprites/roadmap.png');
	game.load.image('heart', './sprites/heart.png');
	game.load.image('life', './sprites/life.png');
	game.load.image('warning', './sprites/warning.png');

	game.load.image('gummy-green', './sprites/gummy-worm-green.png');
	game.load.image('gummy-blue', './sprites/gummy-worm-blue.png');
	game.load.image('gummy-yellow', './sprites/gummy-worm-yellow.png');
	game.load.image('gummy-red', './sprites/gummy-worm-red.png');
	game.load.image('gummy-ball', 'sprites/gummy-ball.png');
	game.load.image('stick-gum', 'sprites/stick-gum.png');

	game.load.image('Gumble', './sprites/Gumble.png');
	game.load.image('wall', './sprites/wall.png');
}

var player;
var cursors;
	var keys= new Array();
var hearts = new Array();
var wall = new Array();

function create() {
	gameScreen = game.add.group();
	gameWorld = game.add.group();
	menuScreen = game.add.group();
	onTop = game.add.group();

	gameWorld.visible = false;
	onTop.visible = false;

	var tutorial = game.add.sprite(scale, scale, 'tutorial');
	tutorial.scale.setTo(scale);
	menuScreen.add(tutorial);

	var gumbleMenu = game.add.sprite(7 * scale, 17 * scale, 'Gumble-menu');
	gumbleMenu.scale.setTo(scale);
	menuScreen.add(gumbleMenu);

	var pressStart = game.add.sprite(3 * scale, 56 * scale, 'press-start');
	pressStart.scale.setTo(scale);
	menuScreen.add(pressStart);
	
	menuScreen.visible = true;

	game.renderer.renderSession.roundPixels = true;
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.world.setBounds(0, 0, 512, 512);
	game.world.enableBody = true;

	roadmap = game.add.sprite(scale, scale, 'roadmap');
	onTop.add(roadmap);
	roadmap.scale.setTo(scale);

	greenGummy = game.add.tileSprite(0, 15 * scale, 32000, 0, 'gummy-green');
	gameScreen.add(greenGummy);
	gameWorld.add(greenGummy);
	greenGummy.scale.setTo(scale);
	greenGummy.height = 15;

	backDecoration = game.add.tileSprite(0, 32 * scale, 32000, 0, 'gummy-ball');
	gameScreen.add(backDecoration);
	gameWorld.add(backDecoration);
	backDecoration.scale.setTo(scale);
	backDecoration.height = 6;

	var road = game.add.tileSprite(0, 38 * scale, 32000, 0, 'stick-gum');
	gameScreen.add(road);
	gameWorld.add(road);
	game.physics.arcade.enable(road);
	road.height = 19;
	road.scale.setTo(scale);
	road.body.colliderWorldBounds = true;

	for (wallNum = 0; wallNum < 2; wallNum++) {
		walls.push(game.add.sprite(lanesX[wallNum], lanesY[wallNum], 'wall'));
		walls[wallNum].scale.setTo(scale);
		game.physics.arcade.enable(walls[wallNum]);
		walls[wallNum].body.colliderWorldBounds = true;
		walls[wallNum].body.setSize(10, 9, 0, 114);
		walls[wallNum].visible = false;
	}

	frontDecoration = game.add.tileSprite(0, 54 * scale, 32000, 0, 'gummy-ball');
	gameScreen.add(frontDecoration);
	gameWorld.add(frontDecoration);

	// TODO: Make player show behind these
	frontDecoration.scale.setTo(scale);
	frontDecoration.height = 10;

	player = game.add.sprite(16, 368, "Gumble");
	gameScreen.add(player);
	onTop.add(player);
	game.camera.follow(player);
	game.camera.deadzone = new Phaser.Rectangle(0, game.world.centerY, 10, "100");

	game.physics.arcade.enable(player);
	player.body.colliderWorldBounds = true;
	player.body.setSize(20, 3, 0, 0);
	player.scale.setTo(scale);
	player.anchor.setTo(0, 1);

	for (i = 0; i < 5; i++) {
		addHeart();
	}

	cursors = game.input.keyboard.createCursorKeys();
	// Enable extra keys to move
	keys = {
		W: this.input.keyboard.addKey(Phaser.Keyboard.W),
		S: this.input.keyboard.addKey(Phaser.Keyboard.S)
	};
}

function update() {
// TODO: add pink dot on the roadmap
// TODO: have functional lives
// TODO: add checkpoints
	if (gameRunning) {
		gameWorld.x -= scrollSpeed;
		//onTop.sort('y', Phaser.Group.SORT_ASCENDING); // TODO: fix group sorting
		for (wall = 0; wall < wallStatus.length; wall++) {
			if (wallStatus[wall]) {
				walls[wall].x -= scrollSpeed;
				if (walls[wall].x <- 256) {
					wallStatus[wall] = false;
					walls[wall].x = lanesX[wall];
					walls[wall].visible = false;
					lastWallSpawned = otherWall();
					wallSpawnInAction = false;
					lastWallSpawnTime = game.time.totalElapsedSeconds();
				}
			}
		}
		if ((cursors.up.isDown || keys.W.isDown) && player.y > boundary["up"]) {
			player.y -= speed;
		} else if ((cursors.down.isDown || keys.S.isDown) && player.y < boundary["down"]) {
			player.y += speed;
		}
		if (game.time.totalElapsedSeconds() - lastWallSpawnTime>=(Number(wall) + Number(1)) * wallSpawnDelay && !wallSpawnInAction) {
			wallSpawnInAction = true;
			spawnWall();
		}

	} else if (menuScreenIsActive) {
		// TODO: change spacebar to any key
		if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			menuScreenIsActive = false;
			menuScreen.visible = false;
			gameRunning = true;
			gameScreen.visible = true;
			gameWorld.visible = true;
			onTop.visible = true;
			roundStartTime = game.time.totalElapsedSeconds();
		}
	}
}

function render() {
	if (debug && gameRunning) {
		game.debug.spriteInfo(player, 32, 32);

		game.debug.body(player);
		for (wallNum in wall) {
			game.debug.body(wall[wallNum]);
		}
	}
}

function addHeart() {	
		console.log(hearts_x.length);
		hearts.push(game.add.sprite(hearts_x[hearts.length], 3 * scale, "heart"));
		hearts[hearts.length-1].scale.setTo(scale);
		onTop.add(hearts[hearts.length-1]);
		hearts[hearts.length-1].fixedToCamera = true;
		if (hearts.length > 1) {
			//hearts[hearts.length-1].visible = false
		}
}

function blinkWall() {
	if (blinkDelay < 0.125 && walls[lastWallSpawned].visible) {
		blinkCounter = blinkDefaultCounter;
		blinkDelay = blinkDefaultDelay;
		wallStatus[lastWallSpawned] = true;
		return;
	} else if (blinkCounter === 0) {
		blinkCounter = blinkCounterStart; // *1.5;
		blinkDelay = blinkDelayStart * 0.5;
		blinkDelayStart = blinkDelay;
	}

	walls[lastWallSpawned].visible = !walls[lastWallSpawned].visible;
	blinkCounter--;
	game.time.events.add(Phaser.Timer.SECOND * blinkDelay, blinkWall, this);
}

function loadMenu() {
	menuScreen.visible = true;
	menuScreenIsActive = true;
}

function otherWall () {
	if (lastWallSpawned === 0) {
		return 1;
	} else if (lastWallSpawned === 1) {
		return 0;
	}
}
function randomNumber(a, b) {
	return Math.floor((Math.random() * b) + a);
}

function spawnWall() {
	game.time.events.add(Phaser.Timer.SECOND * blinkDelay, blinkWall, this);
}
