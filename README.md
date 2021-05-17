# FlappAI
Flappy Bird Agent based on Artificial Neural Networks and trained with Genetic Algorithms

2 -> 6 -> 1 neural network takes the y Coordinate of the bird and y Coordinate of the pipe hole to generate a decision.   
  
As an exploitation step, after each generation a bias mutation is applied to the most succesful agents to generate a certain amount of new agents. 

A certain amount of random agents are generated in each iteration to replace the worst performing ones to increase exploration. Unsuccesful agents (those can not make the first hole pass) extinct.  


![](flappai.gif)
