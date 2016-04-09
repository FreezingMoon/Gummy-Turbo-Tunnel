var game = new Phaser.Game("100", "100", Phaser.CANVAS, 'BattleGum', { preload: preload, create: create, update: update, render : render });
var scrollSpeed = 10;
var velocity = 200;
var jumpVelocity = 500;
var lane = [0, -85, -30, 20];
var boundary = {up:225, down:370};
var heart_x = [10, 110, 210];
var heart_y = 10;
function randomNumber(a, b){
	return Math.floor((Math.random() * b) + a);
}

function preload() {

	game.stage.backgroundColor = '#000';

	game.load.image('background', './sprites/background.png');
	game.load.image('heart', './sprites/heart.png');
	game.load.image('Gumble', './sprites/Gumble.png');
	game.load.image('wall', './sprites/wall.png');
	game.load.image('mushroom', 'sprites/mushroom2.png');

}

var cursors;
var player;
var wall = new Array();
var hearts = new Array();
function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.world.setBounds(0, 0, 64000, 640);

	background = game.add.tileSprite(0,0, 64000, 64, 'background');
	background.scale.setTo(10);
	game.physics.arcade.enable(background);
	background.body.colliderWorldBounds = true;
	background.body.setSize(64000, 30);
	//background.body.bounce.set(1);

	player = game.add.sprite(0, game.world.centerY, "Gumble");
	player.scale.setTo(6);
	game.physics.arcade.enable(player);
	player.body.colliderWorldBounds = true;
	game.camera.follow(player);
	game.camera.deadzone = new Phaser.Rectangle(0, game.world.centerY, 100, "100");
	for (var i = 0; i < 100; i++)
	{
			laneNumber = randomNumber(1,3);
			wall.push (game.add.sprite(game.world.randomX, game.world.centerY+lane[laneNumber], 'wall'));
			wall[wall.length-1].scale.setTo(6);
			game.physics.arcade.enable(wall[wall.length-1]);
			wall[wall.length-1].body.colliderWorldBounds=true;
	}
	for (heart=0;heart<3;heart++){
			hearts.push(game.add.sprite(heart_x[heart], heart_y,"heart"));
			hearts[hearts.length-1].scale.setTo(10);
			hearts[hearts.length-1].fixedToCamera = true;
	}


	cursors = game.input.keyboard.createCursorKeys();

}

function update() {
	player.body.x +=scrollSpeed;

	if (cursors.up.isDown)
	{
		player.body.acceleration.y = -velocity;
	}
	else if (cursors.down.isDown && player.y<boundary["down"])
	{
			player.body.acceleration.y = velocity;
	} else if (!cursors.up.isDown && !cursors.down.isDown){
			player.body.acceleration.setTo(0);
	}

}

function render() {
		//game.debug.spriteInfo(player, 640, 32);
		game.debug.bodyInfo(background, 32, 32);
		game.debug.bodyInfo(player, 32, 300);
		game.debug.body(background);
		game.debug.body(player);
		for (wallNum in wall){
			game.debug.body(wall[wallNum]);
		}
    //game.debug.cameraInfo(game.camera, 32, 32);

}
