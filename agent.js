// AI Agent for playing Flappy Bird

function Population(population_number, pick_best_n)
{
    
    this.pick_best_n = pick_best_n;             // Number of Agents to use for mutation
    this.population_amount = population_amount; // Amount of population to create

    this.Agents = [];                           // Array of agents

}

Population.prototype
{
    // Initial creation of the population
    function createAgents()
    {
        this.Agents.splice(0, this.Agents.length); // Clear all existing agents

        const NEURONS = 6;

        // Create fresh model for each Agent
        // Network: 1 -> 6 -> 1
        for(i = 0; i < this.population_amount; i++)
        { 
            var model = tf.sequential();

            var hidden_layer = tf.layers.dense({
            units: NEURONS,
            inputShape: [1],
            activation: 'sigmoid',
            kernelInitializer: 'leCunNormal',
            useBias: true,
            biasInitializer: 'randomNormal',
            });
        
            var output_layer = tf.layers.dense({units: 1});

            model.add(hidden_layer);
            model.add(output_layer);

            this.Agents.push(model);
        }
    }
    // Forward propagates the birds for decisions
    function forward(bird, next_target)
    {
        // Calculate the height difference between the bird and the pipe hole
        var dist = next_target.y - bird.y;

        // Forward propagation of the network with the given distance
        var decision = this.Agents[bird.index](dist);

        if(decision > 0.5)
        {
            bird.flap();
        }
    }

}