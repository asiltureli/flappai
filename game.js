var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade:  {
            gravity: {y : 0},
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
    this.load.image('pipe_top', 'assets/pipe_top.png');
    this.load.image('pipe_bottom', 'assets/pipe_bottom.png');
    this.load.image('bird', 'assets/redbird.png');
}

function create ()
{
    // Create Starting Images
    this.add.image(0,0, 'sky').setOrigin(0,0);

    // Create Random Generated Pipes
    pipes = this.physics.add.staticGroup();

    for(var x_pos = 300; x_pos < 748; x_pos += 175)
    {
        var top_int = Math.floor(Math.random()*400) + 100;
        var bottom_int = 600 - top_int - 100;
        pipes.create(x_pos, top_int/2, 'pipe_top').setScale(1, top_int/320).refreshBody();
        pipes.create(x_pos, 600-bottom_int/2, 'pipe_bottom').setScale(1,bottom_int/320).refreshBody();
    }
   // Create Bird Object 
   bird = this.physics.add.sprite(50, 300, 'bird');
   bird.setCollideWorldBounds(true);
   bird.body.setGravityY(500);

   // Add Collider
   this.physics.add.collider(bird, pipes);

}

function update ()
{
    // Bird can be controlled with space key
    cursors = this.input.keyboard.createCursorKeys();

    if (cursors.space.isDown)
    {
        bird.setVelocityY(-300);
    }
}