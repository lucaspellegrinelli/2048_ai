# 2048 Artificial Intelligence

This is my take on making an artificial intelligence for the game 2048 made by Gabriele Cirulli (you can play the game [```here```](https://gabrielecirulli.github.io/2048/)).

This uses minimax and the fitness function is a mess. I defined loads of parameters from the game like number of blank spaces, biggest tile, how close it is to a tile configuration I said it's the optimal, average value of tiles... But instead of me saying how much each of these variables are worth, I have a Genetic Algorithm to check this for me.

The best tile it got was 16384 but only once ever. Someeeeetimes it gets 8192, 4092 is kinda common and 2048 is almost always. (I'm saying this about one of the trained AI's I had, if you put a random one to play it will obviously fail before 512).

To check the AI's parameters of some pre-trained bots, you can check the "ai_controller.js" file and on line ~31 I have some commented code with some of the AIs that did best overnight or something like that.

PS. IF YOU WANT TO TEST ONE PRE-TRAINED AI, SET THE VARIABLE "learn" IN ai_controller.js TO FALSE, OR ELSE IT WILL START TRAINING OTHER BOTS.
