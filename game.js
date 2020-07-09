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
    // Create Birds
    this.BirdGroup = this.physics.add.group({classType: Bird, runChildrenUpdate: true});
    this.BirdGroup.addMultiple(new Bird(this));
    // Create Random Generated Pipes
    this.PipeGroup = this.physics.add.group({classType: Pipe_pair, runChildrenUpdate: true});
    for(var x_pos = 300; x_pos < 748; x_pos += 175)
    {
        this.PipeGroup.addMultiple(new Pipe_pair(this,x_pos));
    }

    this.BirdGroup.setVisible(true);
    this.PipeGroup.setVisible(true);
   // Add Collider
   this.physics.add.collider(this.BirdGroup, this.PipeGroup);

}

function update ()
{
    cursors = this.input.keyboard.createCursorKeys();
    if (cursors.space.isDown)
    {
        this.BirdGroup.getChildren().forEach(element => flap());
    }
}


// Creating a pipe pair since pipes consist of two parts
class Pipe_pair extends Phaser.Physics.Arcade.Group
{
    constructor(scene, x)
    {
        super(scene, x, config.y);
        var top_y = Math.floor(Math.random()*400) + 100;
        var bottom_y = 600 - top_y - 100;

        this.bottom_pipe = new Pipe(scene, x, bottom_y/2, 180);
        this.bottom_pipe.setScale(1, bottom_y/320);

        this.top_pipe = new Pipe(scene, x, 600-top_y/2, 0);
        this.top_pipe.setScale(1,top_y/320);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
}

// Creating pipe class inherited from Physics Arcade Sprite
class Pipe extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, angle)
    {
        super(scene, x, y,'pipe_bottom');
        scene.physics.add.existing(this);
        scene.add.existing(this);
        this.setActive(true);
        this.angle = angle;
    }
}

class Bird extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene)
    {
        super(scene, 50, 300, 'bird');
        scene.physics.add.existing(this);
        scene.add.existing(this);
        this.setCollideWorldBounds(true);
        this.body.setGravityY(500);
    }
    flap()
    {
        this.body.setVelocityY(-300);
    }
}