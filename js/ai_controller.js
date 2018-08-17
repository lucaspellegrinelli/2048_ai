let learn = false;

let gameManager = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
gameManager.keepPlaying = true;

let aiPlaying = false;

let refreshInterval;

function toggleAI(){
	aiPlaying = !aiPlaying;

	if(aiPlaying)
		letAIPlay();
	else
		stopAI();
}

function stopAI(){
	if(refreshInterval){
		clearInterval(refreshInterval);
	}
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let provenAI = [];

// Over night best mutated
//provenAI.push(new AI(-0.8711921590439076, 0.39602991479771893, 0.39046268707728027, 0.9813589516515352, 0.7733441697745813, -0.6312702324925917));

// THIS BOY MADE 130K
//provenAI.push(new AI(-0.8711921590439076, 0.2615793667670596, 0.39046268707728027, 1, 0.9357274105521438, -0.6312702324925917));

// Test
provenAI.push(new AI(1, 0.35, 0.4, 0.1, 0.08, 0));

let population;
if(learn){
	population = generateStartPopulation(provenAI);
}

let currentPlayer = 0;
let currentGeneration = 0;

let bestScoreSoFar = 0;
let configBestScore = {priority: 1, adjacentX: -1, adjacentY: -1, maxTile: 0, openTile: 0, average: 0, randomTiles: 0.17, priorityMatrix: [[-2,-1,0,1],[-1,0,1,4],[0,1,4,5],[1,4,5,6]]};

let lastChosen = -1;
let repeatCount = 0;

let generationAverage = 0;
let genAverages = [];

function letAIPlay(){
	refreshInterval = setInterval(function(){
		if(!aiPlaying) return;

		if(gameManager.over){
			if(learn){
				if(gameManager.score > bestScoreSoFar){
		  			bestScoreSoFar = gameManager.score;
		  			configBestScore = {
		  				priority: population[currentPlayer].priorityWeight,
		  				adjacentX: population[currentPlayer].adjacentXWeight,
							adjacentY: population[currentPlayer].adjacentYWeight,
		  				maxTile: population[currentPlayer].maxTileWeight,
		  				openTile: population[currentPlayer].openTilesWeight,
		  				average: population[currentPlayer].averageWeight,
		  				randomTiles: population[currentPlayer].randomTiles
		  			};
		  		}

		  		generationAverage += gameManager.score;

		  		console.log("Individual #" + currentPlayer + " made " + gameManager.score + " points");
		  		console.log("----------------- // ------------------");

				gameManager.restart();

				currentPlayer++;

				if(currentPlayer >= population.length){
					currentPlayer = 0;
					currentGeneration++;
					population = generateNewGeneration(population);

					console.log("GENERATION AVERAGE = " + (generationAverage / population.length));
					genAverages.push((generationAverage / population.length));
					console.log(genAverages);
					generationAverage = 0;

					bestScoreSoFar = 0;
					configBestScore = {priority: 1, adjacent: -1, maxTile: 0, openTile: 0, average: 0, randomTiles: 0.17, priorityMatrix: [[-2,-1,0,1],[-1,0,1,4],[0,1,4,5],[1,4,5,6]]};
				}

				console.log("Individual #" + currentPlayer + ", Generation #" + currentGeneration);
				console.log("Best Individual in Generation (" + bestScoreSoFar + "):");
				console.log(configBestScore);
				//var code = [];
				//code.push("provenAI.push(new AI(" + configBestScore.priority + "," + configBestScore.adjacent + "," + configBestScore.maxTile + "," + configBestScore.openTile + "," + configBestScore.average + "," + configBestScore.randomTiles + "));");
				//console.log(code);
				repeatCount = 0;
				lastChosen = -1;
			}
		}else{
	  		if(learn){
	  			let result = population[currentPlayer].getNextMove(gameManager.copyToSimplified());

		  		if(result.index == lastChosen){
		  			repeatCount++;
		  		}else{
		  			repeatCount = 0;
		  		}

		  		if(repeatCount > 100){
		  			gameManager.restart();
		  			repeatCount = 0;
		  			lastChosen = -1;
		  		}else{
			  		lastChosen = result.index;

			  		gameManager.move(result.index);
			  		population[currentPlayer].score = gameManager.score;
		  		}
	  		}else{
	  			let result = provenAI[0].getNextMove(gameManager.copyToSimplified());

	  			gameManager.move(result.index);
	  		}
	  	}
	}, 1);
}
