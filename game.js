var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render : render });

function preload() {

    game.stage.backgroundColor = '#007236';

    game.load.image('mushroom', 'mushroom2.png');
    game.load.image('sonic', 'sonic_havok_sanity.png');
    game.load.image('phaser', 'phaser1.png');

}

var cursors;
var logo1;
var logo2;

function create() {

    //  Modify the world and camera bounds
    game.world.setBounds(-1000, -500, 4000, 500);

    for (var i = 0; i < 200; i++)
    {
        game.add.sprite(game.world.randomX, game.world.randomY, 'mushroom');
    }



    var player = game.add.sprite(0,0, "sonic");
    player.fixedToCamera=true;





    cursors = game.input.keyboard.createCursorKeys();

}

function update() {
    game.camera.x +=10;
    if (cursors.up.isDown)
    {
        game.camera.y -= 4;
    }
    else if (cursors.down.isDown)
    {
        game.camera.y += 4;
    }

    if (cursors.left.isDown)
    {
        game.camera.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        game.camera.x += 4;
    }

}

function render() {

    //game.debug.cameraInfo(game.camera, 32, 32);

}
