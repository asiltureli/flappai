var config = {
    type: Phaser.AUTO,
    width: 400,
    height: 400,
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
        update: update,
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
    for(var bird_num = 0; bird_num < 1; bird_num ++)
    {
        this.BirdGroup.add(new Bird(this, bird_num), true);
    }
    this.BirdGroup.getChildren().forEach(element => element.setCollideWorldBounds(true));
    this.BirdGroup.getChildren().forEach(element => element.setGravityY(800));
    // Create Random Generated Pipes
    this.PipeGroup = this.physics.add.group({classType: Pipe, runChildUpdate: true});
    for(var x_pos = 200; x_pos < 800; x_pos += 150)
    {
        create_pairs(this, x_pos);
    }
    
    this.reset_idx = 0;  // Index of the pipe to reset
    this.target_idx = 0; // Index of next closest pipe
    this.pipe_objects = this.PipeGroup.getChildren(); // Array of pipe objects
    this.bird_objects = this.BirdGroup.getChildren(); // Array of bird objects

    this.score = 0;
    this.generation = 0;
    this.alive_num = bird_num;

    this.PipeGroup.getChildren().forEach(element => element.velocity(-50));
    // Add Collider
    this.physics.add.overlap(this.BirdGroup, this.PipeGroup, () => { this.scene.restart });

    // Info texts
    this.score_text = this.add.text(20, 0, 'Score: ' + this.score, { fontSize: '16px', fontFamily: 'Arial' });
    this.alive_text = this.add.text(150, 0, 'Alive: ' + this.alive_num, { fontSize: '16px', fontFamily: 'Arial' });
    this.generation_text = this.add.text(260, 0, 'Generation: ' + this.generation, { fontSize: '16px', fontFamily: 'Arial' });
}

function update ()
{
    cursors = this.input.keyboard.createCursorKeys();
    if (cursors.space.isDown)
    {
        this.BirdGroup.getChildren().forEach(element => element.flap());
    }
    // Calculate fitness for each bird
    var fitness = 0;
    for(var loop = 0; loop < this.bird_objects.length; loop++)
    {
        fitness = this.bird_objects[loop].score * 150 + (this.bird_objects[loop].x - this.pipe_objects[this.target_idx].x + 150);
        console.log(fitness);
    }
    // Rotation of the bird body depending on velocity

    /*
    for(var loop = 0; loop < this.bird_objects.length; loop++)
    {
        if(this.bird_objects[loop].velocity > 0)
        {
            this.bird_objects[loop].body.angle =  this.bird_objects[loop].velocity * 45/200
        }
        else
        {
            this.bird_objects[loop].body.angle =  this.bird_objects[loop].velocity * 45/800
        }
    }
    */

    // Reset the pipes out of the boundaries
    if(this.pipe_objects[this.reset_idx].x < -100)
    {
        y = Math.floor(Math.random()*200) + 100;
        
        this.pipe_objects[this.reset_idx].reset(y, 0);
        this.pipe_objects[this.reset_idx+1].reset(y, 1);
        this.reset_idx += 2;
        this.reset_idx = this.reset_idx % 8;
    }

    // Update score and target index
    if(this.pipe_objects[this.target_idx].x < 10)
    {
        this.target_idx += 2;
        this.target_idx = this.target_idx % 8;
        this.score ++;
        this.score_text.setText('Score: ' + this.score);
    }
    this.bird_objects[0].score = this.score;
}
// Create pipe pairs
function create_pairs(scene, x)
{
    let top_y = Math.floor(Math.random()*200) + 100;
    let bottom_y = 400 - top_y - 200;

    scene.PipeGroup.add(new Pipe(scene, x, bottom_y/2, 180));

    scene.PipeGroup.add(new Pipe(scene, x, 500 - top_y/2, 0));
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
    velocity(vel)
    {
        this.setVelocityX(vel);
    }
    scale()
    {
        this.setScale(1, this.y/320);
    }
    reset(y, direction) // Direction 1 = Top Pipe, Direction = 0 Bottom Pipe
    {
        this.x += 600;
        var top_y = y;
        if(direction)
        {
            this.y = 500 - top_y/2;
        }
        else
        {
            var bottom_y = 400 - top_y - 200;
            this.y = bottom_y/2;
        }  
    }  
}    

class Bird extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, index)
    {
        super(scene, 50, 300,'bird');
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.score = 0;
        this.index = index;
    }
    flap()
    {
        this.body.setVelocityY(-200);
    }
}