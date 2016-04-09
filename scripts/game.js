var game = new Phaser.Game(512, 512, Phaser.CANVAS, 'BattleGum', { preload: preload, create: create, update: update, render : render });
var debug = true;
var scrollSpeed = 10;
var speed = 10;
var jumpVelocity = 500;
var lane = [0, -50, -103];
var boundary = {up:135, down:260};
var heart_x = [10, 110, 210];
var heart_y = 10;
var introText;
var gameRunning=false;
var preloadText = 'CPU OK...\nRAM OK...\nDISK OK...\nSOUND OK...\nGUMBLE OK...\n';
var numOfChars=1;
var gameScreen;
var menuScreen;
var menuScreenIsActive=false;
var straightToGame=true;
function preload() {

	game.stage.backgroundColor = 'black';
	game.load.image('blue-gummy', './sprites/gummy-worm-blue.png');
  game.load.image('green-gummy', './sprites/gummy-worm-green.png');
  game.load.image('yellow-gummy', './sprites/gummy-worm-yellow.png');
  game.load.image('red-gummy', './sprites/gummy-worm-red.png');
  game.load.image('gummy', 'sprites/gummy-ball.png');
  game.load.image('gum', 'sprites/stick-gum.png');
  game.load.image('level', 'sprites/level.png');
	game.load.image('heart', './sprites/heart.png');
	game.load.image('Gumble', './sprites/Gumble.png');
	game.load.image('wall', './sprites/wall.png');
  game.load.image('gumble', 'favicon.png');
}

var cursors;
var player;
var wall = new Array();
var hearts = new Array();
function create() {

  introText = game.add.text(16, 16 , '',
    { font: '30px Arial', fill: 'green'});
  if (!straightToGame){
  game.time.events.repeat(Phaser.Timer.SECOND *.15, preloadText.length, displayText, this);
} else if (straightToGame){
  gameRunning=true;
}

  var gumble = game.add.sprite(128, 128, 'gumble');
  gumble.fixedToCamera=true;
  menuText = game.add.text(140, 450, "Press Spacebar",
    { font: '32px Arial', fill: 'white'});
  menuScreen = game.add.group();
  menuScreen.add(gumble);
  menuScreen.add(menuText);
  menuScreen.visible=false;

  game.stage.smoothed=false;
  game.renderer.renderSession.roundPixels = true;
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.world.setBounds(0, 0, 512, 512);
  game.world.enableBody=true;



  gameScreen = game.add.group();
  gameWorld = game.add.group();
  backDecoration = game.add.tileSprite(0, 220, 64000, 0, 'gummy');
  gameScreen.add(backDecoration);
  gameWorld.add(backDecoration);
  backDecoration.scale.setTo(8);
  backDecoration.height=6;
  backDecoration.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;


  floor = game.add.tileSprite(0, 265, 64000, 0, 'gum');
  gameScreen.add(floor);
  gameWorld.add(floor);
  game.physics.arcade.enable(floor);
  floor.height=20.5;
  floor.scale.setTo(8);
	floor.body.colliderWorldBounds = true;
  floor.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;





  frontDecoration = game.add.tileSprite(0, 390, 64000, 0, 'gummy');
  gameScreen.add(frontDecoration);
  gameWorld.add(frontDecoration);
  frontDecoration.scale.setTo(8);
  frontDecoration.height=11;
  frontDecoration.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
/*
	for (var i = 0; i < 100; i++)
	{
			laneNumber = randomNumber(1,2);
			wall.push (game.add.sprite(game.world.randomX, game.world.centerY+lane[laneNumber], 'wall'));
			wall[wall.length-1].scale.setTo(8);
			game.physics.arcade.enable(wall[wall.length-1]);
			wall[wall.length-1].body.colliderWorldBounds=true;
      wall[wall.length-1].body.setSize(10,9,0,114);
      gameScreen.add(wall[wall.length-1]);
	}
*/
player = game.add.sprite(0, game.world.centerY, "Gumble");
gameScreen.add(player);
game.camera.follow(player);
game.camera.deadzone = new Phaser.Rectangle(0, game.world.centerY, 10, "100");


player.scale.setTo(8);
game.physics.arcade.enable(player);
player.body.colliderWorldBounds = true;
player.body.setSize(18,2,0,128);
player.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
  if (!straightToGame){
    gameScreen.visible=false;
  }
	cursors = game.input.keyboard.createCursorKeys();

}

function update() {
  if (gameRunning){
  	//player.body.x +=scrollSpeed;
    gameWorld.x-=scrollSpeed;
  	if (cursors.up.isDown && player.y>boundary["up"])
  	{
  		player.y -= speed;
  	}
  	else if (cursors.down.isDown && player.y<boundary["down"])
  	{
  			player.y += speed;
  	}
  } else if (menuScreenIsActive){
    if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
      menuScreenIsActive=false;
      menuScreen.visible=false;
      gameRunning=true;
      gameScreen.visible=true;

    }
  }
}

function render() {
  if (debug && gameRunning){
		game.debug.spriteInfo(player, 32, 32);

		//game.debug.bodyInfo(background, 32, 32);
		//game.debug.bodyInfo(player, 32, 300);
		game.debug.body(floor);
		game.debug.body(player);
		for (wallNum in wall){
			game.debug.body(wall[wallNum]);
		}
    //game.debug.cameraInfo(game.camera, 32, 32);
  }
}


function addHeart(){/*
      var heartNum = (hearts.length-1<0)
        ? 0
        : hearts.length-1;
      hearts.push(game.add.sprite(heart_x[heartNum], heart_y,"heart"));
      hearts[hearts.length-1].scale.setTo(10);
      hearts[hearts.length-1].fixedToCamera = true;
      hearts[hearts.length-1].texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
      */
}
function randomNumber(a, b){
	return Math.floor((Math.random() * b) + a);
}
function displayText(){
  introText.text = preloadText.substr(0, numOfChars);
  numOfChars++;
  if (numOfChars===preloadText.length){
    loadMenu();
  }
}
function loadMenu(){
  introText.visible=false;
  menuScreen.visible=true;
  menuScreenIsActive=true;
}
