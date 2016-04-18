var game = new Phaser.Game(512, 512, Phaser.CANVAS, 'BattleGum', { preload: preload, create: create, update: update, render : render });

var debug = true;
var scale = 8;
var menuScreen;
var menuScreenIsActive = true;
var gameScreen;
var gameRunning = false;
var gamePaused = false;

var scrollSpeed = 8;
var boundary = { up: scale * 41, down: scale * 57 };
var lanesX = [433, 433];
var lanesY = [176, 272];
var speed = 30;
var jumpDelay = .5
var jumpSpeed = 300;
var defaultGravity = 150;
var gravity = defaultGravity;

var lives = 1;
var delayFromCheckpoint = 1;
var level = 0;
var checkpoint = 0;
var checkpointModifier = [1, 0.8, 0.6, 0.4, 0.2];

var walls = new Array();
var wallLines = new Array();
var wallStatus = [false, false];
var wallSpawnInAction = false;
var wallSpawnDelay = 2;
var calmBeforeTheStorm = 3;

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
	game.load.image('gummy-ball', 'sprites/gummy-ball.png');
	game.load.image('stick-gum', 'sprites/stick-gum.png');

	game.load.image('Gumble', './sprites/Gumble.png');
	game.load.image('Gumble-jump', './sprites/Gumble-jump.png');
	game.load.image('normal-wall', './sprites/normal-wall.png');
}

var player;
var playerJumpPad;
var playerJumping = false;
var playerFalling = false;
var lastJumpLandedAt = 0;

var playerJumpY = 0;
var playerLine;
var playerBeingHit = false;

var roadMarker;
var roadMarkerLastMoved = 0;
var roadMarkerMoving = 0;

var cursors;
var keys = new Array();
var lastHeart;
var hearts = new Array();
var normalWall = new Array();

var gameOverText;
var winText;

function create() {
	gameScreen = game.add.group();
	gameWorld = game.add.group();
	menuScreen = game.add.group();
	onTop = game.add.group();

	gameWorld.visible = false;
	onTop.visible = false;
	gameOverText = game.add.text(scale * 8, scale * 16, "GAME\n OVER", { font:" 128px Arial", fill: "white", align: "center" }) // TODO: deprecate with pixel art graphic
	gameOverText.visible=false;
	winText = game.add.text(scale * 8, scale * 16, "YOU\n WIN!", { font: "128px Arial", fill: "white", align: "center" }) // TODO: deprecate with pixel art graphic
	winText.visible=false;

	var tutorial = game.add.sprite(scale, scale, 'tutorial');
	tutorial.scale.setTo(scale);
	menuScreen.add(tutorial);

	var gumbleMenu = game.add.sprite(scale * 7, scale * 17, 'Gumble-menu');
	gumbleMenu.scale.setTo(scale);
	menuScreen.add(gumbleMenu);

	var pressStart = game.add.sprite(scale * 3, scale * 56, 'press-start');
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

	gummyWorm = game.add.tileSprite(0, scale * 15, 0, 0, 'gummy-worm');
	gameWorld.add(gummyWorm);
	gummyWorm.scale.setTo(scale);
	gummyWorm.height = 15;

	backDecoration = game.add.tileSprite(0, scale * 32, 0, 0, 'gummy-ball');
	gameWorld.add(backDecoration);
	backDecoration.scale.setTo(scale);
	backDecoration.height = 6;

	game.physics.arcade.enable(backDecoration);
	backDecoration.body.setSize(512, 6, 0, 0);
	backDecoration.scale.setTo(scale);
	backDecoration.body.immovable = true;

	var road = game.add.tileSprite(0, scale * 38, 0, 0, 'stick-gum');
	gameWorld.add(road);
	road.height = 19;
	road.scale.setTo(scale);

	for (wallNum = 0; wallNum < 2; wallNum++) {
		walls.push(game.add.sprite(lanesX[wallNum], lanesY[wallNum], 'normal-wall'));
		walls[wallNum].scale.setTo(scale);
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

	playerJumpPad = game.add.sprite(16, 380, null);
	game.physics.arcade.enable(playerJumpPad);
	playerJumpPad.body.colliderWorldBounds = true;
	playerJumpPad.body.setSize(scale * 20, 3, 0, 0);
	playerJumpPad.body.immovable = true;

	frontDecoration = game.add.tileSprite(0, scale * 54, 0, 0, 'gummy-ball');
	gameWorld.add(frontDecoration);
	frontDecoration.scale.setTo(scale);
	frontDecoration.height = 10;
	onTop.add(frontDecoration);

	game.physics.arcade.enable(frontDecoration);
	frontDecoration.body.setSize(512, 100, 0, 25);
	frontDecoration.scale.setTo(scale);
	frontDecoration.body.immovable = true;

	lastHeart = game.add.sprite(scale, scale * 3, "warning");
	lastHeart.scale.setTo(scale);
	lastHeart.visible = false;
	lastHeart.fixedtoCamera = true;
	for (i = 0; i < 5; i++) {
		addHeart();
	}

	gameWorld.autoCull = true;
	menuScreen.autoCull = true;
	frontDecoration.autoCull = true;
	cursors = game.input.keyboard.createCursorKeys();
	keys = {
		W: this.input.keyboard.addKey(Phaser.Keyboard.W),
		S: this.input.keyboard.addKey(Phaser.Keyboard.S),
		Space: this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
	};
}

function update() {
// TODO: add checkpoints
	if (!playerJumping && !playerFalling) {
		game.physics.arcade.collide(player, frontDecoration);
		game.physics.arcade.collide(player, backDecoration);
	} else if (playerJumping) {
		player.body.acceleration.y =- jumpSpeed;
	}
	if (playerFalling) {
		player.body.gravity.y++;
		if (game.physics.arcade.collide(player, playerJumpPad)) {
			player.body.gravity.y = 0;
			playerFalling = false;
			lastJumpLandedAt = game.time.totalElapsedSeconds();
		}
	}
	if (gameRunning && !gamePaused && !menuScreenIsActive) {
		if (level != 0 && level % 20 === 0 && roadMarkerMoving === 0) {
			game.time.events.repeat(Phaser.Timer.SECOND, 3, moveRoadMarker, this);
		} else if (level % 20 != 0 && roadMarkerMoving != 0) {
			roadMarkerMoving=0;
		}
		if (gameWorld.x <- 1000 || playerBeingHit) {
			gameWorld.x = 0;
			frontDecoration.x = 0;
			if (playerBeingHit) {
				playerBeingHit = false;
				gamePaused = true;
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
					if (level >= 100) {
						gameRunning = false;
						winText.visible = true;
					} else if (level % 20 === 0) {
						checkpoint++;
						blinkDefaultCounter -= 2;
					}
					if (level % 2 === 0) {
						updateRoadMarker(false);
					}
					console.log("LEVEL:", level);
					resetWalls();
				}
			}
		}
		updateLines();
		if (!playerJumping && !playerFalling) {
			if (cursors.up.isDown || keys.W.isDown) { //&& player.y > boundary["up"]) {
				player.body.velocity.y -= speed;
			} else if ((cursors.down.isDown || keys.S.isDown)) { // && player.y < boundary["down"]) {
				player.body.velocity.y += speed;
			}
			if (keys.Space.isDown && game.time.totalElapsedSeconds() - lastJumpLandedAt > jumpDelay) {
				playerJumping = true;
				playerJumpPad.y = player.y;
				player.body.gravity.y = defaultGravity;

				game.time.events.add(Phaser.Timer.SECOND, stopJumping, this);
			}
		}
		if (((level % 20 === 0 && game.time.totalElapsedSeconds() - (lastWallSpawnTime+calmBeforeTheStorm) >= (Number(wall) + Number(1)) * wallSpawnDelay)
	    || (level % 20 != 0 && game.time.totalElapsedSeconds() - lastWallSpawnTime>=(Number(wall) + Number(1)) * wallSpawnDelay))
		  && !wallSpawnInAction) {
			wallSpawnInAction = true;
			spawnWall();
		}
	} else if (!gameRunning && menuScreenIsActive) {
		game.input.keyboard.onUpCallback = function () {
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
		/*
		game.debug.body(player);
		game.debug.body(playerJumpPad);
		game.debug.body(frontDecoration);
		game.debug.body(backDecoration);
		*/
		game.debug.geom(playerLine, 'rgba(0, 0, 255, 1)');
		for(wall in walls) {
			game.debug.geom(wallLines[wall], 'rgba(255, 0, 0, 1)');
		}
	}
}

function addHeart() {
		// TODO: have a bigger gap between lives and hearts, having one transition from one side to the other on gain/loss while fading between sprites
		// TODO: when no lives left, the left side gap will be filled with the warning sprite, meaning if you die it's game over

		hearts.push(game.add.sprite(scale + ((hearts.length) * 94), scale * 3, "heart"));
		hearts[hearts.length - 1].scale.setTo(scale);
		onTop.add(hearts[hearts.length - 1]);
		hearts[hearts.length - 1].fixedToCamera = true;
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

function checkMenuTextAndUpdate() {
		roundTimer--;
		if (roundTimer === 0) {
			nextLevel();
		}
		roundTimeText.text = "Time: " + roundTimer;

		score += level;
		scoreText.text = "Score: " + score;
}

function displayText() {
	introText.text = preloadText.substr(0, numOfChars);
	numOfChars++;
	if (numOfChars === preloadText.length) {
		loadMenu();
	}
}
function gameOver(){
	gameRunning = false;
	gameOverText.visible = true;
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

function playerHit() {
	resetWalls();
	playerBeingHit = true;
	lives--;
	if (lives >= 0) {
		hearts[lives].visible = false;
		level=checkpoint * 20;
		updateRoadMarker(true);
		if (lives === 0) {
			lastHeart.visible = true;
		}
	} else if (lives < 0) {
		gameOver();
	}
}

function randomNumber(a, b) {
	return Math.floor((Math.random() * b) + a);
}

function randomWall() {
	return (randomNumber(1, 2) - 1);
}

function resetWalls(checkpointReached) {
	for (wallNumber = 0; wallNumber < walls.length; wallNumber++) {
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

function stopJumping() {
	playerJumping = false;
	playerFalling = true;
	player.body.acceleration.y = 0;
}

function updateLines() {
	playerLine = new Phaser.Line(player.body.position.x,
		player.body.position.y + player.body.height,
		player.body.position.x + player.body.width,
		player.body.position.y);

	for (wall in walls) {
		wallLines[wall] = new Phaser.Line(walls[wall].position.x,
			walls[wall].position.y + walls[wall].height - scale * scale,
			walls[wall].position.x + walls[wall].width,
			walls[wall].position.y + walls[wall].height);
		playerHitsWall = playerLine.intersects(wallLines[wall], true);
		if (wallStatus[wall] && playerHitsWall && !playerBeingHit) {
				playerHit();
		} else if (wallStatus[wall] &&  !playerHitsWall && playerBeingHit) {
			playerBeingHit = false;
		}
	}
}

function unpauseGame() {
	gamePaused = false;
}

function moveRoadMarker() {
	if (game.time.totalElapsedSeconds() - roadMarkerLastMoved>1) { //&& game.time.totalElapsedSeconds() - roadMarkerLastMoved < 2) {
			roadMarker.x += scale;
			roadMarkerLastMoved = game.time.totalElapsedSeconds();
			roadMarkerMoving++;
	}
}

function updateRoadMarker(death) {
	if (death) {
		roadMarker.x = scale + scale * (level * .5) + (checkpoint * scale * 3);
	} else if (!death) {
		if (level < 21) {
			roadMarker.x = scale + scale * (level * .5);
		} else if (level >= 21) {
			roadMarker.x = scale + scale * (level * .5) + (checkpoint * scale * 3);
		}
	}
}
