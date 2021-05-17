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
    // Speed
    this.slider = document.getElementById("myRange");
    this.physics.world.timeScale = 1/this.slider.value;

    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
    this.game.scale.refresh();
    // Create Agents
    this.population_amount = 10;
    this.agents = new Population(this.population_amount,5);
    // Create Starting Images
    this.add.image(0,0, 'sky').setOrigin(0,0);

    // Create Birds and set properties
    this.BirdGroup = this.physics.add.group({classType: Bird, runChildUpdate: true});
    for(var bird_num = 0; bird_num < this.population_amount; bird_num ++)
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
    
    this.reset_idx      = 0;  // Index of the pipe to reset
    this.target_idx     = 0; // Index of next closest pipe

    this.max_score      = 0;
    this.score          = 0;
    this.generation     = 1;
    this.alive_num      = bird_num;

    this.PipeGroup.getChildren().forEach(element => element.velocity(-50));
    // Add Collider
    this.collide = new Array(this.population_amount).fill(false);
    this.BirdGroup.getChildren().forEach(bird => {
        if(bird.active)
        this.physics.add.overlap(bird, this.PipeGroup,()=> bird_dead(this,bird));
    })


    // Info texts
    this.score_text         = this.add.text(20, 0, 
                                            'Score: ' + this.score, 
                                            { fontSize: '16px', fontFamily: 'Arial' });
    this.alive_text         = this.add.text(150, 0, 
                                            'Alive: ' + this.alive_num, 
                                            { fontSize: '16px', fontFamily: 'Arial' });
    this.generation_text    = this.add.text(260, 0, 
                                            'Generation: ' + this.generation, 
                                            { fontSize: '16px', fontFamily: 'Arial' });
    this.max_score_text     = this.add.text(290, 380, 
                                            'Max Score: ' + this.max_score, 
                                            { fontSize: '16px', fontFamily: 'Arial' });
}

function update ()
{
    this.score_text.setText('Alive: ' + this.BirdGroup.countActive());
    this.alive_text.setText('Score: ' + this.score);
    this.generation_text.setText('Generation: ' + this.generation);
    this.max_score_text.setText('Max Score: ' + this.max_score);

    this.physics.world.timeScale = 1/this.slider.value;
    
    // Reset the pipes out of the boundaries
    if(this.PipeGroup.getChildren()[this.reset_idx].x < -100)
    {
        y = Math.floor(Math.random()*200) + 100;
        
        this.PipeGroup.getChildren()[this.reset_idx].reset(y, 0);
        this.PipeGroup.getChildren()[this.reset_idx+1].reset(y, 1);
        this.reset_idx += 2;
        this.reset_idx = this.reset_idx % 8;
    }

    // Update score and target index
    if(this.PipeGroup.getChildren()[this.target_idx].x < 10)
    {
        this.target_idx += 2;
        this.target_idx = this.target_idx % 8;
        this.score ++;
        if(this.score > this.max_score)
        {
            this.max_score = this.score;
        }
    }
    this.BirdGroup.getChildren()[0].score = this.score;


    cursors = this.input.keyboard.createCursorKeys();
    this.BirdGroup.getChildren().forEach(element => check_world_bound_collision(this, element));
    if(!this.BirdGroup.countActive())
    {
        this.agents.evolution();
        reset_game(this);
    }
    //this.physics.arcade.collide(bird, this.targetBarrier, this.bird_dead, null, this);
    this.BirdGroup.getChildren().forEach((bird) => {
        // calculate the current fitness and the score for this bird
        if(bird.active)
            {
            TargetPoint_x = this.PipeGroup.getChildren()[this.target_idx].x;
            TargetPoint_y = (this.PipeGroup.getChildren()[this.target_idx].y + this.PipeGroup.getChildren()[this.target_idx + 1].y) / 2;
            bird.fitness = (400 - Math.abs(bird.y - TargetPoint_y)) / 400;
            bird.score = this.score;
            
            
            // check if a bird passed through the gap of the target barrier
            if (bird.x > TargetPoint_x) isNextTarget = true;
            
            // check if a bird flies out of vertical bounds
            if (bird.y<0 || bird.y>610) this.bird_dead(bird);
            
            // Forward propagate
            this.agents.forward(bird, TargetPoint_y, bird.index);
            
            
        }
    }, this);
    for(var loop_dec = 0; loop_dec < this.population_amount; loop_dec++)
    {
        this.agents.forward(this.BirdGroup.getChildren()[loop_dec], 
                            this.PipeGroup.getChildren()[this.target_idx], 
                            loop_dec)
    }

    //for(var loop = 0; loop < this.bird_objects.length; loop++)
    //{
    //    this.agents[loop].fitness = this.bird_objects[loop].score * 150 + (this.bird_objects[loop].x - this.pipe_objects[this.target_idx].x + 150);
    //}
}
/*
/* Reset game except agents after all birds die
*/
function reset_game(scene)
{
    // Reset Pipes
    p_idx = 0;
    for(var x_pos = 200; x_pos < 800; x_pos += 150)
    {
        scene.PipeGroup.getChildren()[p_idx].x = x_pos;
        scene.PipeGroup.getChildren()[p_idx+1].x = x_pos;

        y = Math.floor(Math.random()*200) + 100;
        
        scene.PipeGroup.getChildren()[p_idx].reset_y(y, 0);
        scene.PipeGroup.getChildren()[p_idx+1].reset_y(y, 1);
        p_idx += 2;
    }
    scene.target_idx = 0;
    // Reset Birds
    scene.BirdGroup.getChildren().forEach(bird => bird.reset());

    scene.score = 0;
    scene.fitness = 0;

    scene.generation++;
}
function bird_dead(scene, bird)
{
    if(bird.active)
    {
        scene.agents.Agents[bird.index].score = bird.score;
        // Reward birds that are close to the pipe hole with ~1
        var hole_y = (scene.PipeGroup.getChildren()[scene.target_idx].y + scene.PipeGroup.getChildren()[scene.target_idx + 1].y) / 2
        var fit_y = (800 - bird.y - hole_y) / 800;
        // Reward birds that are close to the pipes with ~1
        var fit_x = (150 - (scene.PipeGroup.getChildren()[scene.target_idx].x - bird.x))/150;
        
        scene.agents.Agents[bird.index].setFitness(bird.score) + fit_x + fit_y;
        bird.death();
    }
}
// Create pipe pairs
function create_pairs(scene, x)
{
    let top_y = Math.floor(Math.random()*200) + 100;
    let bottom_y = 400 - top_y - 200;

    scene.PipeGroup.add(new Pipe(scene, x, bottom_y/2, 180));

    scene.PipeGroup.add(new Pipe(scene, x, 500 - top_y/2, 0));
}
function check_world_bound_collision(scene, bird)
{
    if(bird.y < 13 || bird.y > 387)
    {
        bird_dead(scene, bird)
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
    reset_y(y, direction)
    {
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
        this.fitness = 0;
        this.index = index;
        this.alpha = 1;
    }
    flap()
    {
        this.body.setVelocityY(-200);
    }
    death()
    {
        this.active = false;
        this.alpha = 0;
    }
    reset()
    {
        this.alpha = 1;
        this.active = true;
        this.score = 0;
        this.x = 50;
        this.y = 300;
    }
}