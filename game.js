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
    this.BirdGroup.addMultiple(new Bird({scene:this}));
    // Create Random Generated Pipes
    this.PipeGroup = this.physics.add.group({classType: Pipe_pair});
    for(var x_pos = 300; x_pos < 748; x_pos += 175)
    {
        this.PipeGroup.addMultiple(this,x_pos);
    }

    this.BirdGroup.setVisible(true);
    this.PipeGroup.setVisible(true);
   // Add Collider
   this.physics.add.collider(this.BirdGroup, this.PipeGroup);

}

function update ()
{
 
}


// Creating a pipe pair since pipes consist of two parts
class Pipe_pair extends Phaser.Physics.Arcade.Group
{
    constructor(config, x)
    {
        super(config.scene, x, config.y);
        var top_y = Math.floor(Math.random()*400) + 100;
        var bottom_y = 600 - top_y - 100;

        this.bottom_pipe = new Pipe(config.scene, x, bottom_y/2, 180);
        this.bottom_pipe.Scale = (1, top_y/320);

        this.top_pipe = new Pipe(config.scene, x, 600-bottom_y/2, 0);
        this.top_pipe.Scale = (1,bottom_y/320);
        config.scene.add.existing(this);
        config.scene.GameObjects.Group.add.existing(this);
    }
}

// Creating pipe class inherited from Sprite
class Pipe extends Phaser.Physics.Arcade.Sprite
{
    constructor(config, x, y, angle)
    {
        super({scene:config.scene, x:x, y:y, key:'pipe_top', angle: angle});
    }

    
}

class Bird extends Phaser.Physics.Arcade.Sprite
{
    constructor(config)
    {
        super(config.scene, 50, 300, 'bird');
        config.scene.physics.add.existing(this);
        config.scene.add.existing(this);
        this.setCollideWorldBounds(true);
        
        this.body.setGravityY(500);
    }
    update(config)
    {
        // Bird can be controlled with space key
        cursors = config.scene.input.keyboard.createCursorKeys();

        if (cursors.space.isDown)
        {
            this.jump();
        }
    }
    jump()
    {
        this.setVelocityY(-300);
    }
}