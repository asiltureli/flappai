var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade:  {
            gravity: {y : 500},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('pipe', 'assets/pipe-green.png');
    this.load.image('bird', 'assets/redbird.png');
}

function create ()
{

    this.add.image(0,0, 'sky').setOrigin(0,0);
    this.add.image(50, 300, 'bird');

    pipes = this.physics.add.staticGroup();
}

function update ()
{
}