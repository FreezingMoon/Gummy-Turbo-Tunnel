var game = new Phaser.Game(512, 512, Phaser.CANVAS, 'BattleGum', { preload: preload, create: create, update: update, render : render });
var blinkDefaultCounter = 10;
var blinkDefaultDelay = .25;
var blinkCounterStart = blinkDefaultCounter;
var blinkDelayStart = blinkDefaultDelay;
var blinkCounter = blinkDefaultCounter;
var blinkDelay = blinkDefaultDelay;
var boundary = { up: 288, down: 432  };
var debug = false;
var gameRunning = false;
var gameScreen;
var health = 1;
var heart_x = [10, 110, 210, 310, 410];
var heart_y = 32;
var introText;
var jumpVelocity = 500;
var lanesX = [433, 433];
var lanesY = [180, 257];
var lastWallSpawnTime = 0;
var lastWallSpawned = 0;
var level=1;
var levelCaptionText;
var menuScreen;
var menuScreenIsActive = false;
var numOfChars = 1;
var roundDefaultTimer = 30;
var roundTimer = roundDefaultTimer;
var roundTime = 0;
var roundTimeText;
var roundStartTime;
var preloadText = 'CPU OK...\nRAM OK...\nDISK OK...\nSOUND OK...\nGUMBLE OK...\n';
var score = 0;
var scoreText;
var scrollSpeed = 8;
var speed = 10;
var straightToGame = true;
var walls = new Array();
var wallStatus = [false, false];
var wallSpawnInAction = false;
var wallSpawnDelay=2;
function preload() {
	game.stage.backgroundColor = 'black';
	game.load.image('gummy-blue', './sprites/gummy-worm-blue.png');
	game.load.image('gummy-green', './sprites/gummy-worm-green.png');
	game.load.image('gummy-yellow', './sprites/gummy-worm-yellow.png');
	game.load.image('gummy-red', './sprites/gummy-worm-red.png');
	game.load.image('gummy-ball', 'sprites/gummy-ball.png');
	game.load.image('stick-gum', 'sprites/stick-gum.png');
	game.load.image('level', 'sprites/level.png');
	game.load.image('heart', './sprites/heart.png');
	game.load.image('life', './sprites/life.png');
	game.load.image('Gumble', './sprites/Gumble.png');
	game.load.image('wall', './sprites/wall.png');
	game.load.image('gumble-menu', 'favicon.png');
}

var cursors;
var player;
var wall = new Array();
var hearts = new Array();
function create() {

	for (i=0;i<100;i++){
		//nextLevel();
		/*
		scrollSpeed*=1.02;
		wallSpawnDelay*=.95;
		blinkDefaultCounter *= .97;
		blinkDefaultDelay *= .99;
		*/
	}
	/*
	blinkDelay = blinkDefaultDelay;
	blinkDelayStart = blinkDefaultDelay;
	blinkCounter = blinkDefaultCounter;
	blinkCounterStart = blinkDefaultCounter;
*/
	gameScreen = game.add.group();
	gameWorld = game.add.group();
	menuScreen = game.add.group();
	onTop = game.add.group();

	introText = game.add.text(16, 16, '', { font: '30px Arial', fill: 'green' });
	if (!straightToGame) {
		game.time.events.repeat(Phaser.Timer.SECOND *.15, preloadText.length, displayText, this);
	} else if (straightToGame) {
		gameRunning = true;
	}

	var gumbleMenu = game.add.sprite(128, 128, 'gumble-menu');
	gumbleMenu.fixedToCamera = true;
	menuText = game.add.text(140, 450, "Press Spacebar", { font: '32px Arial', fill: 'white'});
	menuScreen.add(gumbleMenu);
	menuScreen.add(menuText);
	menuScreen.visible = false;

	game.stage.smoothed = false;
	game.renderer.renderSession.roundPixels = true;
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.world.setBounds(0, 0, 512, 512);
	game.world.enableBody = true;

	scoreText = game.add.text(10,5, "Score: " + score,	{ font: '20px Arial', fill: 'white'});
	roundTimeText = game.add.text(game.world.width-100,5, "Time: " + roundTimer,	{ font: '20px Arial', fill: 'white'});
	levelCaptionText = game.add.text(game.world.centerX-40, 5, "Level " + level,	{ font: '20px Arial', fill: 'white'});

	backDecoration = game.add.tileSprite(0, 240, 64000, 0, 'gummy-ball');
	gameScreen.add(backDecoration);
	gameWorld.add(backDecoration);
	backDecoration.scale.setTo(8);
	backDecoration.height = 5;
	backDecoration.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

	floor = game.add.tileSprite(0, 280, 64000, 0, 'stick-gum');
	gameScreen.add(floor);
	gameWorld.add(floor);
	game.physics.arcade.enable(floor);
	floor.height = 21;
	floor.scale.setTo(8);
	floor.body.colliderWorldBounds = true;
	floor.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

	for (wallNum=0;wallNum<2;wallNum++){
		walls.push(game.add.sprite(lanesX[wallNum], lanesY[wallNum], 'wall'));
		walls[wallNum].scale.setTo(7);
		game.physics.arcade.enable(walls[wallNum]);
		walls[wallNum].body.colliderWorldBounds = true;
		walls[wallNum].body.setSize(10, 9, 0, 114);
		walls[wallNum].visible=false;
	}




	frontDecoration = game.add.tileSprite(0, 512, 64000, 0, 'gummy-ball');
	gameScreen.add(frontDecoration);
	gameWorld.add(frontDecoration);
	frontDecoration.anchor.setTo(0, 1);
	frontDecoration.scale.setTo(8);
	frontDecoration.height = 12;
	frontDecoration.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;





	player = game.add.sprite(16, 368, "Gumble");
	gameScreen.add(player);
	onTop.add(player);
	game.camera.follow(player);
	game.camera.deadzone = new Phaser.Rectangle(0, game.world.centerY, 10, "100");

	game.physics.arcade.enable(player);
	player.body.colliderWorldBounds = true;
	player.body.setSize(20, 3, 0, 0);
	player.scale.setTo(8);
	player.anchor.setTo(0, 1);
	player.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;


	for (i=0;i<5;i++){
		addHeart();
	}
	if (!straightToGame) {
		gameScreen.visible = false;
		gameWorld.visible = false;
		onTop.visible=false;
	} else if (straightToGame){
		roundStartTime = game.time.totalElapsedSeconds();
		game.time.events.loop(Phaser.Timer.SECOND, checkMenuTextAndUpdate, this);
	}
	cursors = game.input.keyboard.createCursorKeys();
}

function update() {

	if (gameRunning) {
		gameWorld.x -= scrollSpeed;
		for (wall=0;wall<wallStatus.length;wall++){
			if (wallStatus[wall]){
				walls[wall].x-=scrollSpeed;
				if(walls[wall].x<-256){
					wallStatus[wall]=false;
					walls[wall].x = lanesX[wall];
					walls[wall].visible = false;
					lastWallSpawned=otherWall();
					wallSpawnInAction=false;
					lastWallSpawnTime=game.time.totalElapsedSeconds();
				}
			}
		}
		if (cursors.up.isDown && player.y > boundary["up"]) {
			player.y -= speed;
		} else if (cursors.down.isDown && player.y < boundary["down"]) {
			player.y += speed;
		}
			if (game.time.totalElapsedSeconds() - lastWallSpawnTime>=(Number(wall) + Number(1)) * wallSpawnDelay && !wallSpawnInAction){
				wallSpawnInAction=true;
				spawnWall();
			}

	} else if (menuScreenIsActive) {
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			menuScreenIsActive = false;
			menuScreen.visible = false;
			gameRunning = true;
			gameScreen.visible = true;
			gameWorld.visible = true;
			onTop.visible=true;
			roundStartTime = game.time.totalElapsedSeconds();
			game.time.events.loop(Phaser.Timer.SECOND, checkMenuTextAndUpdate, this);
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
		hearts.push(game.add.sprite(heart_x[hearts.length], heart_y, "heart"));
		hearts[hearts.length-1].scale.setTo(10);
		hearts[hearts.length-1].fixedToCamera = true;
		hearts[hearts.length-1].texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
		if (hearts.length>1){
			//hearts[hearts.length-1].visible=false
		}
}

function blinkWall(){
	if (blinkDelay<.1 && blinkCounter<=0 && walls[lastWallSpawned].visible){

		blinkCounter=blinkCounterStart;
		blinkDelay = blinkDelayStart;
		wallStatus[lastWallSpawned]=true;
		return;
	} else if (blinkDelay>.1 && blinkCounter<=0){
		blinkCounter=blinkCounterStart;//*1.5;
		blinkDelay = blinkDelayStart*.5;
		blinkDelayStart = blinkDelay;
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

function loadMenu() {
	introText.visible = false;
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
	} else if (lastWallSpawned===1){
		return 0;
	}
}
function randomNumber(a, b) {
	return Math.floor((Math.random() * b) + a);
}

function spawnWall(){
	game.time.events.add(Phaser.Timer.SECOND * blinkDelay, blinkWall, this);
}
