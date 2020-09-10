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
    this.BirdGroup = this.physics.add.group({classType: Bird, runChildUpdate: true});
    //this.test = new Bird(this);
    for(var bird_num = 0; bird_num < 1; bird_num ++)
    {
        this.BirdGroup.add(new Bird(this), true);
        //bird_array.push(new Bird(this));
    }
    
    this.BirdGroup.getChildren().forEach(element => element.setCollideWorldBounds(true));
    this.BirdGroup.getChildren().forEach(element => element.setGravityY(800));
    // Create Random Generated Pipes
    this.PipeGroup = this.physics.add.group({classType: Pipe_pair, runChildUpdate: true});
    for(var x_pos = 300; x_pos < 1200; x_pos += 175)
    {
        this.PipeGroup.add(new Pipe_pair(this,x_pos), true);
    }
    this.nextPair = this.PipeGroup.getFirst(x=150);
    this.PipeGroup.getChildren().forEach(element => element.velocity(-50));
    var top_pipes = this.PipeGroup.getChildren(element => element.top_pipe);
    var bot_pipes = this.PipeGroup.getChildren(element => element.bottom_pipe);
    // Add Collider
    //this.PipeGroup.getChildren().forEach(element => this.physics.add.collider(this.BirdGroup, element));
    
}

function update ()
{
    cursors = this.input.keyboard.createCursorKeys();
    if (cursors.space.isDown)
    {
        this.BirdGroup.getChildren().forEach(element => element.flap());
        //this.bird_array.forEach(element => flap());
        //this.test.flap();
    }
    this.PipeGroup.getChildren().forEach(element => element.reset());
    this.PipeGroup.getChildren().forEach(element => element.targetPair());
    console.log(this.nextPair)
    //this.physics.add.collider(this.BirdGroup, targetPipe);
    //this.BirdGroup.getChildren().forEach(element => element.collideCheck(targetPipe));
    

}


// Creating a pipe pair since pipes consist of two parts
class Pipe_pair extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x)
    {
        super(scene, x);
        this.top_y = Math.floor(Math.random()*300) + 100;
        this.bottom_y = 600 - this.top_y - 100;

        this.bottom_pipe = new Pipe(scene, x, this.bottom_y/2, 180);
        this.bottom_pipe.setScale(1, this.bottom_y/320);

        this.top_pipe = new Pipe(scene, x, 600-this.top_y/2, 0);
        this.top_pipe.setScale(1,this.top_y/320);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
    velocity(vel)
    {
        this.top_pipe.setVelocityX(vel);
        this.bottom_pipe.setVelocityX(vel);
    }
    reset()
    {
        if(this.top_pipe.x < -100)
        {
            this.top_pipe.x += 1050;
            this.bottom_pipe.x += 1050;

            var top_y = Math.floor(Math.random()*300) + 100;
            var bottom_y = 600 - top_y - 100;

            this.bottom_pipe.y = bottom_y/2;
            this.bottom_pipe.setScale(1, bottom_y/320);

            this.top_pipe.y = 600-top_y/2;
            this.top_pipe.setScale(1,top_y/320);
        }
    }
    targetPair()
    {
        if(this.top_pipe.x > 15 && this.top_pipe.x < 175)
        {
            if(this != game.nextPair)
            {      
                game.nextPair = this;
            }
        }
    }
}

class Pipe extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, angle)
    {
        super(scene, x, y,'pipe_bottom');
        scene.physics.add.existing(this);
        scene.add.existing(this);
        this.setActive(true);
        this.body.allowGravity = false;
        this.angle = angle;
    }
}    

class Bird extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene)
    {
        super(scene, 50, 300,'bird');
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
    }
    flap()
    {
        this.body.setVelocityY(-200);
    }
    collideCheck(targetPair)
    {
        if(this.x < targetPair.top_pipe.x + 20 && this.x > targetPair.top_pipe.x - 20 && this.y < targetPair.bottom_y && this.y > targetPair.top_y)
        {
            game.scene.restart()
        }
    }
}