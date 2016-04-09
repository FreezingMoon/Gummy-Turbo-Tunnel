var game = new Phaser.Game(64, 64, Phaser.CANVAS, 'BattleGum', { preload: preload, create: create, update: update, render : render });

function preload() {

	game.stage.backgroundColor = '#000';

	game.load.image('background', './sprites/background.png');
	game.load.image('heart', './sprites/heart.png');
	game.load.image('Gumble', './sprites/Gumble.png');
	game.load.image('wall', './sprites/wall.png');

}

var cursors;

function create() {

	//  Modify the world and camera bounds
	game.world.setBounds(0, 0, 6400, 64);

	var player = game.add.sprite(0, 40, "Gumble");
	player.fixedToCamera = true;

	cursors = game.input.keyboard.createCursorKeys();

}

function update() {
	game.camera.x += 10;
	if (cursors.up.isDown) {
		player.y -= 4;
	}
	else if (cursors.down.isDown) {
		player.y += 4;
	}
}

function render() {

    //game.debug.cameraInfo(game.camera, 32, 32);

}
