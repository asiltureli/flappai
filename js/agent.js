// AI Agent for playing Flappy Bird
class Agent
{
    constructor(idx)
    { 
        
        this.fitness   = 5;
        this.score     = 1;
        this.index     = idx;
        this.isWinner  = false;
        
        // Network: 2 -> 6 -> 1
        
        this.model = tf.sequential();
        const NEURONS = 6; // Number of neurons in hidden layer
        var hidden_layer = tf.layers.dense({
            units: NEURONS,
            inputShape: [2],
            activation: 'sigmoid',
            kernelInitializer: 'leCunNormal',
            useBias: true,
            biasInitializer: 'randomNormal',
            });
        
            var output_layer = tf.layers.dense({units: 1, activation: 'sigmoid'});
    
            this.model.add(hidden_layer);
            this.model.add(output_layer);
    }
    setFitness(fitness)
    {
        this.fitness = fitness;
    }
}