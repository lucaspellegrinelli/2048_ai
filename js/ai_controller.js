aiController = new AIController(false, true);

function AIController(learn, log){
	this.log = log;
	this.learn = learn;
	this.gameManager = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);

	this.aiPlaying = false;
	this.refreshInterval;
	this.refreshDelay = 1;

	this.preTrainedAI = [
		new AI(1, 0.35, 0.4, 0.1, 0.08, 0, 0.17)
	];

	this.gaConfig = {
		populationSize: 32,
		tournamentSize: 4,
		mutationRate: 0.05
	};

	this.ga = new GA(this.gaConfig.populationSize, this.gaConfig.tournamentSize, this.gaConfig.mutationRate);

	this.gaData = {
		population: this.ga.generateStartPopulation(), // this.ga.generateStartPopulation(preTrainedAI)
		currentPlayer: 0,
		currentGeneration: 0,
		record: {
			bestGenerationScore: 0,
			bestGenerationScoreMaxTile: 0,
			configBestGenerationScore: {
				priority: 1,
				adjacentX: -1,
				adjacentY: -1,
				maxTile: 0,
				openTile: 0,
				average: 0,
				randomTiles: 0.17
			},
			currentGenerationAverage: 0,
			generationsAverages: []
		},
		limits: {
			lastChosen: -1,
			repeatCount: 0
		}
	};
}

AIController.prototype.toggleLearn = function(){
	this.learn = !this.learn;

	this.pauseAIPlay();
	this.cleanLog();

	if(this.learn) this.turnOnLearn();
	else this.turnOffLearn();
}

AIController.prototype.turnOnLearn = function(){
	document.getElementById("toggleLearn").innerHTML = "Learning Mode";
	this.resetGAHistory();
	this.gameManager.restart();
}

AIController.prototype.turnOffLearn = function(){
	document.getElementById("toggleLearn").innerHTML = "Play Mode";
	this.gameManager.restart();
}

AIController.prototype.resetGAHistory = function(){
	this.gaData = {
		population: this.ga.generateStartPopulation(),
		currentPlayer: 0,
		currentGeneration: 0,
		record: {
			bestGenerationScore: 0,
			bestGenerationScoreMaxTile: 0,
			configBestGenerationScore: {
				priority: 1,
				adjacentX: -1,
				adjacentY: -1,
				maxTile: 0,
				openTile: 0,
				average: 0,
				randomTiles: 0.17
			},
			currentGenerationAverage: 0,
			generationsAverages: [],
			bestAllTimeScore: 0,
			bestAllTimeScoreMaxTile: 0,
			configBestAllTimeScore: {
				priority: 1,
				adjacentX: -1,
				adjacentY: -1,
				maxTile: 0,
				openTile: 0,
				average: 0,
				randomTiles: 0.17
			},
		},
		limits: {
			lastChosen: -1,
			repeatCount: 0
		}
	};
}

AIController.prototype.toggleAIPlay = function(){
	this.aiPlaying = !this.aiPlaying;

	if(this.aiPlaying) this.letAIPlay();
	else this.pauseAIPlay();
}

AIController.prototype.pauseAIPlay = function(){
	document.getElementById("toggleAI").innerHTML = "Start AI";

	if(this.refreshInterval){
		clearInterval(this.refreshInterval);
	}
}

AIController.prototype.cleanLog = function(){
	document.getElementById("gaProgress").innerHTML = "";
	document.getElementById("gaTop").innerHTML = "";
	document.getElementById("gaAllTimeTop").innerHTML = "";
	document.getElementById("genAvg").innerHTML = "";
}

AIController.prototype.letAIPlay = function(){
	document.getElementById("toggleAI").innerHTML = "Pause AI";

	context = this;
	this.refreshInterval = setInterval(function(){
		if(!context.aiPlaying) return;

		if(context.gameManager.over){
			if(context.learn){
				if(context.gameManager.score > context.gaData.record.bestGenerationScore){
	  			context.gaData.record.bestGenerationScore = context.gameManager.score;
	  			context.gaData.record.configBestGenerationScore = {
	  				priority: 	 context.gaData.population[context.gaData.currentPlayer].priorityWeight,
	  				adjacentX: 	 context.gaData.population[context.gaData.currentPlayer].adjacentXWeight,
						adjacentY: 	 context.gaData.population[context.gaData.currentPlayer].adjacentYWeight,
	  				maxTile: 		 context.gaData.population[context.gaData.currentPlayer].maxTileWeight,
	  				openTile: 	 context.gaData.population[context.gaData.currentPlayer].openTilesWeight,
	  				average: 		 context.gaData.population[context.gaData.currentPlayer].averageWeight,
	  				randomTiles: context.gaData.population[context.gaData.currentPlayer].randomTiles
	  			};

					let maxTile = 0;
					for(let i = 0; i < context.gameManager.grid.size; i++){
						for(let j = 0; j < context.gameManager.grid.size; j++){
							let thisCell = context.gameManager.grid.cells[i][j];
							let thisCellValue = thisCell ? thisCell.value : 0;
							if(thisCellValue > maxTile) maxTile = thisCellValue;
						}
					}

					context.gaData.record.bestGenerationScoreMaxTile = maxTile;

					if(context.gameManager.score > context.gaData.record.bestAllTimeScore){
						context.gaData.record.bestAllTimeScore = context.gameManager.score;
						context.gaData.record.bestAllTimeScoreMaxTile = maxTile;
						context.gaData.record.configBestAllTimeScore = {
		  				priority: 	 context.gaData.population[context.gaData.currentPlayer].priorityWeight,
		  				adjacentX: 	 context.gaData.population[context.gaData.currentPlayer].adjacentXWeight,
							adjacentY: 	 context.gaData.population[context.gaData.currentPlayer].adjacentYWeight,
		  				maxTile: 		 context.gaData.population[context.gaData.currentPlayer].maxTileWeight,
		  				openTile: 	 context.gaData.population[context.gaData.currentPlayer].openTilesWeight,
		  				average: 		 context.gaData.population[context.gaData.currentPlayer].averageWeight,
		  				randomTiles: context.gaData.population[context.gaData.currentPlayer].randomTiles
		  			};
					}
	  		}

		  	context.gaData.record.generationAverage += context.gameManager.score;

				if(context.log){
					document.getElementById("gaProgress").innerHTML = "Individual <b>#" + context.gaData.currentPlayer + "/" + context.gaConfig.populationSize +
						"</b> [Generation <b>#" + context.gaData.currentGeneration + "</b>] got <b>" + context.gameManager.score + " pts</b> and the <b>" + context.gaData.record.bestGenerationScoreMaxTile + " tile</b>";
				}

				console.log("Individual #" + context.gaData.currentPlayer + "/" + context.gaConfig.populationSize + " [Generation #" + context.gaData.currentGeneration + "] got " + context.gameManager.score + " pts and the " + context.gaData.record.bestGenerationScoreMaxTile + " tile");

				context.gameManager.restart();

				context.gaData.currentPlayer++;

				if(context.gaData.currentPlayer >= context.gaData.population.length){
					context.gaData.currentPlayer = 0;
					context.gaData.currentGeneration++;
					context.gaData.population = context.ga.generateNewGeneration(context.gaData.population);

					let averageScore = context.gaData.record.currentGenerationAverage / context.gaData.population.length;

					context.gaData.record.generationsAverages.push(averageScore);

					if(context.log){
						document.getElementById("genAvg").innerHTML = "Last generation (<b>#" + (context.gaData.currentGeneration - 1) + "</b>) had an average score of <b>" + averageScore + " pts</b>"
					}

					console.log("All generations average scores:");
					console.log(context.gaData.record.generationsAverages);
					console.log("");

					context.gaData.record.currentGenerationAverage = 0;
					context.gaData.record.bestGenerationScore = 0;
					context.gaData.record.configBestGenerationScore = {
						priority: 1,
						adjacentX: -1,
						adjacentY: -1,
						maxTile: 0,
						openTile: 0,
						average: 0,
						randomTiles: 0.17
					};
				}

				if(context.log){
					document.getElementById("gaTop").innerHTML = "Best individual [Generation <b>#" + context.gaData.currentGeneration + "</b>] got <b>" +
						context.gaData.record.bestGenerationScore + " pts</b> and the <b>" + context.gaData.record.bestGenerationScoreMaxTile + " tile</b>";

					document.getElementById("gaAllTimeTop").innerHTML = "All time best individual got <b>" + context.gaData.record.bestAllTimeScore + " pts</b> and the <b>" +
						context.gaData.record.bestAllTimeScoreMaxTile + " tile</b>";
				}

				console.log("Best individual [Generation #" + context.gaData.currentGeneration + "] got " +	context.gaData.record.bestGenerationScore + " pts and the " + context.gaData.record.bestGenerationScoreMaxTile + " tile")
				console.log(context.gaData.record.configBestGenerationScore);

				console.log("All time best individual got " + context.gaData.record.bestAllTimeScore + " pts and the " +	context.gaData.record.bestAllTimeScoreMaxTile + " tile")
				console.log(context.gaData.record.configBestAllTimeScore);
				console.log("---------------- // ------------------");

				context.gaData.limits.repeatCount = 0;
				context.gaData.limits.lastChosen = -1;
			}else{
				context.toggleAIPlay();
			}
		}else{
	  		if(context.learn){
	  			let aiResponse = context.gaData.population[context.gaData.currentPlayer].getNextMove(context.gameManager.copyToSimplified());

		  		if(aiResponse.index == context.gaData.limits.lastChosen) context.gaData.limits.repeatCount++;
		  		else context.gaData.limits.repeatCount = 0;

		  		if(context.gaData.limits.repeatCount > 6){
		  			context.gameManager.restart();
		  			context.gaData.limits.repeatCount = 0;
		  			context.gaData.limits.lastChosen = -1;
		  		}else{
			  		context.gaData.limits.lastChosen = aiResponse.index;
			  		context.gameManager.move(aiResponse.index);
			  		context.gaData.population[context.gaData.currentPlayer].score = context.gameManager.score;
		  		}
	  		}else{
	  			let aiResponse = context.preTrainedAI[0].getNextMove(context.gameManager.copyToSimplified());
	  			context.gameManager.move(aiResponse.index);
	  		}
	  	}
	}, this.refreshDelay);
}
