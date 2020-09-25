// AI Agent for playing Flappy Bird

Agent(population_number, pick_best_n)
{
    
    this.pick_best_n = pick_best_n;             // Number of Agents to use for mutation
    this.population_amount = population_amount; // Amount of population to create

    this.Agents = [];                           // Array of agents

}

Agent.prototype.createAgents = function()
{
    this.Agents.splice(0, this.Agents.length); // Clear all existing agents

    const NEURONS = 6;

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