var game = new Phaser.Game(512, 512, Phaser.CANVAS, 'BattleGum', { preload: preload, create: create, update: update, render : render });

var debug = true;
var scale = 8;
var menuScreen;
var menuScreenIsActive = true;
var gameScreen;
var gameRunning = false;
var gamePaused = false;

var scrollSpeed = 8;
var boundary = { up: 41 * scale, down: 57 * scale };
var lanesX = [433, 433];
var lanesY = [176, 272];
var speed = 10;
var jumpVelocity = 500;

var lives = 1;
var delayFromCheckpoint = 1;
var level = 0;
var checkpoint = 0;
var checkpointModifier = [1, .8, .6, .4, .2];

var walls = new Array();
var wallLines = new Array();
var wallStatus = [false, false];
var wallSpawnInAction = false;
var wallSpawnDelay=2;

var lastWallSpawnTime = 0;
var lastWallSpawned = 0;

var blinkDefaultCounter = 7;
var blinkDefaultDelay = 0.25;
var blinkCounterStart = blinkDefaultCounter;
var blinkDelayStart = blinkDefaultDelay;
var blinkCounter = blinkDefaultCounter;
var blinkDelay = blinkDefaultDelay;

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

	// TODO: use a single gummy worm, but change tints for other 3 colors
	// using this http://phaser.io/examples/v2/display/tint-sprite
	game.load.image('gummy-worm', './sprites/gummy-worm.png');
	game.load.image('gummy-blue', './sprites/gummy-worm-blue.png');
	game.load.image('gummy-yellow', './sprites/gummy-worm-yellow.png');
	game.load.image('gummy-red', './sprites/gummy-worm-red.png');
	game.load.image('gummy-ball', 'sprites/gummy-ball.png');
	game.load.image('stick-gum', 'sprites/stick-gum.png');

	game.load.image('Gumble', './sprites/Gumble.png');
	game.load.image('normal-wall', './sprites/normal-wall.png');
}

var player;
var playerLine;
var playerBeingHit=false;

var roadMarker;
var cursors;
var keys = new Array();
var lastHeart;
var hearts = new Array();
var normalWall = new Array();

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

	//game.world.enableBody = true;

	roadmap = game.add.sprite(scale, scale, 'roadmap');
	onTop.add(roadmap);
	roadmap.scale.setTo(scale);

	roadMarker = game.add.graphics(scale, scale);
	roadMarker.beginFill(0xcf3883 , 1);
	roadMarker.drawRect(0, 0, scale, scale);


	gummyWorm = game.add.tileSprite(0, 15 * scale, 0, 0, 'gummy-worm');
	gameWorld.add(gummyWorm);
	gummyWorm.scale.setTo(scale);
	gummyWorm.height = 15;

	backDecoration = game.add.tileSprite(0, 32 * scale, 0, 0, 'gummy-ball');
	gameWorld.add(backDecoration);
	backDecoration.scale.setTo(scale);
	backDecoration.height = 6;

	var road = game.add.tileSprite(0, 38 * scale, 0, 0, 'stick-gum');
	gameWorld.add(road);
	game.physics.arcade.enable(road);
	road.height = 19;
	road.scale.setTo(scale);
	road.body.colliderWorldBounds = true;

	for (wallNum = 0; wallNum < 2; wallNum++) {
		walls.push(game.add.sprite(lanesX[wallNum], lanesY[wallNum], 'normal-wall'));
		walls[wallNum].scale.setTo(scale);
		game.physics.arcade.enable(walls[wallNum]);
		walls[wallNum].body.setSize(10, 9, 0, 114);
		walls[wallNum].visible = false;
	}


	player = game.add.sprite(16, 368, "Gumble");
	onTop.add(player);
	game.camera.follow(player);
	game.camera.deadzone = new Phaser.Rectangle(0, game.world.centerY, 10, "100");

	game.physics.arcade.enable(player);
	player.body.colliderWorldBounds = true;
	player.body.setSize(20, 3, 0, 0);
	player.scale.setTo(scale);
	player.anchor.setTo(0, 1);


	frontDecoration = game.add.tileSprite(0, 54 * scale, 0, 0, 'gummy-ball');
	gameWorld.add(frontDecoration);
	frontDecoration.scale.setTo(scale);
	frontDecoration.height = 10;
	onTop.add(frontDecoration);

	lastHeart = game.add.sprite(scale, 3 * scale, "warning");
	lastHeart.scale.setTo(scale);
	lastHeart.visible=false;
	lastHeart.fixedtoCamera=true;
	for (i = 0; i < 5; i++) {
		addHeart();
	}

	gameWorld.autoCull=true;
	menuScreen.autoCull=true;
	frontDecoration.autoCull=true;
	cursors = game.input.keyboard.createCursorKeys();
	keys = {
		W: this.input.keyboard.addKey(Phaser.Keyboard.W),
		S: this.input.keyboard.addKey(Phaser.Keyboard.S)
	};
}

function update() {
// TODO: add checkpoints

	if (gameRunning && !gamePaused && !menuScreenIsActive) {

		if (gameWorld.x <- 1000 || playerBeingHit){
			gameWorld.x = 0;
			frontDecoration.x = 0;
			if (playerBeingHit){
				playerBeingHit=false;
				gamePaused=true;
				game.time.events.add(Phaser.Timer.SECOND * delayFromCheckpoint, unpauseGame, this);
			}

		}
		gameWorld.x -= scrollSpeed;
		frontDecoration.x -= scrollSpeed;
		//onTop.sort('y', Phaser.Group.SORT_ASCENDING); // TODO: fix group sorting
		for (wall = 0; wall < wallStatus.length; wall++) {
			if (wallStatus[wall]) {
				walls[wall].x -= scrollSpeed;


				if (walls[wall].x <- 256) {
					level++;
					if (level%20===0){
						checkpoint++;
						blinkDefaultCounter-=2;
					}
					roadMarker.x += .5;
					console.log("LEVEL:", level);
					resetWalls();
				}
			}
		}
		updateLines();

		if ((cursors.up.isDown || keys.W.isDown) && player.y > boundary["up"]) {
			player.y -= speed;
		} else if ((cursors.down.isDown || keys.S.isDown) && player.y < boundary["down"]) {
			player.y += speed;
		}
		if (game.time.totalElapsedSeconds() - lastWallSpawnTime>=(Number(wall) + Number(1)) * wallSpawnDelay && !wallSpawnInAction) {
			wallSpawnInAction = true;
			spawnWall();
		}

	} else if (!gameRunning && menuScreenIsActive) {
		game.input.keyboard.onDownCallback = function () {
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
		game.debug.body(player);
		game.debug.geom(playerLine, 'rgba(0, 0, 255,1)');
		for(wall in walls){
			game.debug.geom(wallLines[wall], 'rgba(255, 0, 0,1)');
		}
	}
}


function addHeart() {
		// TODO: have a bigger gap between lives and hearts, having one transition from one side to the other on gain/loss while fading between sprites
		// TODO: when no lives left, the left side gap will be filled with the warning sprite, meaning if you die it's game over

		hearts.push(game.add.sprite(scale+(94*(hearts.length)), 3 * scale, "heart"));
		hearts[hearts.length-1].scale.setTo(scale);
		onTop.add(hearts[hearts.length-1]);
		hearts[hearts.length-1].fixedToCamera = true;
		if (hearts.length > lives) {
			hearts[hearts.length-lives].visible = false
		}

}


function blinkWall() {

	if (blinkCounter <= 0 && walls[lastWallSpawned].visible) {

		blinkCounter = blinkDefaultCounter;
		blinkDelay = blinkDefaultDelay;
		wallStatus[lastWallSpawned] = true;
		return;
	}
	walls[lastWallSpawned].visible = !walls[lastWallSpawned].visible;
	blinkCounter--;
	game.time.events.add(Phaser.Timer.SECOND * blinkDelay, blinkWall, this);
}

function checkMenuTextAndUpdate(){
		roundTimer--;
		if (roundTimer===0){
			nextLevel();
		}
		roundTimeText.text = "Time: " + roundTimer;

		score += level;
		scoreText.text = "Score: " + score;
}

function displayText() {
	introText.text = preloadText.substr(0, numOfChars);
	numOfChars++;
	if (numOfChars===preloadText.length) {
		loadMenu();
	}
}
function gameOver(){
	gameRunning=false;
}

function loadMenu() {
	menuScreen.visible = true;
	menuScreenIsActive = true;
}

function nextLevel(){
	roundTimer=roundDefaultTimer;
	level++;
	levelCaptionText.text = "Level: " + level;
	scrollSpeed*=1.01;
	wallSpawnDelay*=.95;
	blinkDefaultCounter *= .99;
	blinkCounterStart = blinkDefaultCounter;
	blinkCounter = blinkDefaultCounter;
	blinkDefaultDelay *= .98;
	blinkDelayStart = blinkDefaultDelay
	blinkDelay = blinkDefaultDelay;
}

function otherWall (){
	if (lastWallSpawned===0){
		return 1;
	} else if (lastWallSpawned === 1) {
		return 0;
	}
}

function playerHit(){
	resetWalls();
	playerBeingHit=true;

	lives--;
	if (lives>=0){
		hearts[lives].visible=false;
		level=checkpoint*20;
		roadMarker.x=scale+(level*.5);
		if (lives===0){
			lastHeart.visible=true;
		}
	} else if (lives<0){
		gameOver();
	}

}

function randomNumber(a, b) {
	return Math.floor((Math.random() * b) + a);
}

function randomWall(){
	return (randomNumber(1,2)-1);
}

function resetWalls(){
	for (wallNumber=0;wallNumber<walls.length;wallNumber++){
		wallStatus[wallNumber] = false;
		walls[wallNumber].x = ((lanesX[wallNumber] - (player.x + player.width)) * checkpointModifier[checkpoint] + (player.x + player.width));
		walls[wallNumber].visible = false;
	}
		lastWallSpawned = randomWall();
		wallSpawnInAction = false;
		lastWallSpawnTime = game.time.totalElapsedSeconds();

}
function spawnWall() {
	game.time.events.add(Phaser.Timer.SECOND * blinkDelay, blinkWall, this);
}

function updateLines(){
	playerLine = new Phaser.Line(player.body.position.x,
		player.body.position.y + player.body.height,
		player.body.position.x + player.body.width,
		player.body.position.y);

	for (wall in walls){
		wallLines[wall] = new Phaser.Line(walls[wall].position.x,
			walls[wall].position.y + walls[wall].height-scale*scale,
			walls[wall].position.x + walls[wall].width,
			walls[wall].position.y + walls[wall].height);
		playerHitsWall = playerLine.intersects(wallLines[wall], true);
		if (wallStatus[wall] && playerHitsWall && !playerBeingHit){
				playerHit();
		} else if (wallStatus[wall] &&  !playerHitsWall && playerBeingHit){
			playerBeingHit=false;
		}

	}
}

function unpauseGame(){
	gamePaused=false;
}
