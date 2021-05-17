// Population with multiple Agents
class Population
{
    // Initial creation of the population
    constructor(population_amount, pick_best_n)
    {
        this.Agents         = []; // Array of agents

        this.Agents.splice(0, this.Agents.length); // Clear all existing agents

        this.pick_best_n       = pick_best_n;       // Number of Agents to use for mutation
        this.population_amount = population_amount; // Amount of population to create
    
        this.best_score     = 0; // Best score among population
        this.best_fitness   = 0; // Best fitness score among population
        this.mutation_rate  = 1; // Mutation rate
        this.generation     = 1; // Current generation
        this.best_unit      = 0; // Index of best unit
        // Create fresh model for each Agent
        // Network: 1 -> 6 -> 1
        for(var i = 0; i < this.population_amount; i++)
        { 
            this.Agents.push(new Agent(i));
        }
    }
    new_population()
    {
        // Create new population
        this.Agents.splice(0, this.Agents.length); // Clear all existing agents
        console.log(this.Agents);
        for(var i = 0; i < this.population_amount; i++)
        { 
            this.Agents.push(new Agent(i));
        }
    }
    // Forward propagates the birds for decisions
    forward(bird, next_target_y, idx)
    {
        // Forward propagation of the network with the bird.y and height of pipe hole
        var tens_data = this.Agents[idx].model.predict(tf.tensor([[next_target_y, bird.y]]));
        var decision = tens_data.dataSync();
        if(decision > 0.5)
        {
            bird.flap();
        }
    }
    evolution()
    {
        // Apply selection and get best units
        var nextGen = this.selection();
        console.log(nextGen[0].fitness);
        if(nextGen[0].fitness < 1 )
        {
            this.new_population();
            return;
        }
        // Mutate
        for(var loop = this.pick_best_n; loop < this.population_amount; ++loop)
        {
            var rand1 = Math.floor(Math.random() * (this.pick_best_n - 1));
            var rand2 = Math.floor(Math.random() * (this.pick_best_n - 1));
            // Generate an unequal pair
            while(rand1 == rand2) var rand2 = Math.floor(Math.random() * (this.pick_best_n - 1));
            var offspring = tf.tidy(() =>
            {
                return offspring = this.crossover(nextGen[rand1].model, nextGen[rand2].model);
            });
            //console.log('offspring');
            //offspring = this.mutation(offspring);
            this.Agents[loop].model = offspring;
            console.log(this.Agents);
        }
        

    }
    selection()
    {
        // Sort the Units by their fitness score to pick the best ones
        var sortedPopulation = this.Agents.sort(
            (a, b) =>
            {
                return b.fitness - a.fitness;
            }
        );
        // Mark the top ones as winners
        for(var loop = 0; loop < this.pick_best_n; loop++)
        {
            this.Agents[loop].isWinner = true;
        }
        return sortedPopulation.slice(0, this.pick_best_n);
    }
    // Applies crossover to models
    crossover(a, b) {
        var biasA = a.layers[0].bias.read();
        var biasB = b.layers[0].bias.read();
        var randomNum = Math.floor(Math.random(0,2));
        var temp = this.set_bias(randomNum == 1 ? a : b, this.exchange_bias(biasA, biasB));
        return temp;
    }
    // Slices bias tensor into 2 and exchange the biases
    exchange_bias(tensor_a, tensor_b)
    {
        //const t_size = Math.ceil(tensor_a.size / 2);
        var cutPoint = Math.ceil(Math.random(0,tensor_a.size));
        return tf.tidy(() => 
        {
            const a = tensor_a.slice([0], [cutPoint]);
            const b = tensor_b.slice([cutPoint]);

            return a.concat(b);
        });
    }
    // Create a new object and set its new bias
    set_bias(model, bias)
    {
        return tf.tidy(() => 
        {
        var new_model = Object.assign({}, model);

        model.layers[0].bias.write(bias);
        new_model = model;
        return new_model;
        })
    }
    mutation(next_gen)
    {
        // mutate weights
        console.log(next_gen.getWeights());
        console.log(next_gen.layers);
        console.log(next_gen.layers[0]);
        console.log(next_gen.layers[0].getWeights()[0]);
        for(var loop_layers = 0; loop_layers < 2; loop_layers++)
        {
            next_gen.layers[loop_layers].setWeights(this.mutate(next_gen.layers[loop_layers].getWeights()))
        }
    }
    mutate(value)
    {
        if(Math.random() < this.mutation_rate)
        {
            var mutation_factor = 1 + (Math.random() - 0.5) + (Math.random() - 0.5);
            value *= mutation_factor;
        }
        console.log(value);
        return value
    }

}