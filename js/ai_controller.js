aiController = new AIController(false, true);

function AIController(learn, log){
	this.log = log;
	this.learn = learn;
	this.gameManager = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);

	this.aiPlaying = false;
	this.refreshInterval;
	this.refreshDelay = 1;

	this.preTrainedAI = [
		new AI([0.55, -0.82, 0.61, 0.73, -0.34, 0.00])
	];

	this.gaConfig = {
		populationSize: 32,
		tournamentSize: 4,
		mutationRate: 0.05
	};

	this.ga = new GA(this.gaConfig.populationSize, this.gaConfig.tournamentSize, this.gaConfig.mutationRate);

	this.gaData = {
		population: this.ga.generateStartPopulation(),
		currentPlayer: 0,
		currentGeneration: 0,
		record: {
			bestGenerationScore: 0,
			bestGenerationScoreMaxTile: 0,
			configBestGenerationScore: {
				weights: []
			},
			currentGenerationAverage: 0,
			generationsAverages: [],
			bestAllTimeScore: 0,
			bestAllTimeScoreMaxTile: 0,
			configBestAllTimeScore: {
				weights: []
			}
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
				weights: []
			},
			currentGenerationAverage: 0,
			generationsAverages: [],
			bestAllTimeScore: 0,
			bestAllTimeScoreMaxTile: 0,
			configBestAllTimeScore: {
				weights: []
			}
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

AIController.prototype.playerDropdown = function(text, player){
	let indv_vars = "";

	let weightsLabels = ["Priority", "Adjacent X", "Adjacent Y", "Max Tile",
											"Open Tiles", "Average"];

	for(let i = 0; i < player.weights.length; i++){
		let val = player == undefined ? "None" : player.weights[i].toFixed(5);
		indv_vars += '<p><b>' + weightsLabels[i] + ':</b> ' + val + '</p>';
	}

	return '<div class="dropdown"><span>' + text + '</span><div class="dropdown-content">' + indv_vars + '</div></div>';
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
	  			context.gaData.record.configBestGenerationScore.weights = context.gaData.population[context.gaData.currentPlayer].weights;

					context.gaData.record.bestGenerationScoreMaxTile = context.gameManager.grid.getMaxTile();

					if(context.gameManager.score > context.gaData.record.bestAllTimeScore){
						context.gaData.record.bestAllTimeScore = context.gameManager.score;
						context.gaData.record.bestAllTimeScoreMaxTile = context.gameManager.grid.getMaxTile();
						context.gaData.record.configBestAllTimeScore.weights = context.gaData.population[context.gaData.currentPlayer].weights;
					}
	  		}

		  	context.gaData.record.currentGenerationAverage += context.gameManager.score;

				if(context.log){
					let curr_indv_info = context.playerDropdown("Individual <b>#" +
							(context.gaData.currentPlayer + 1) + "/" + context.gaConfig.populationSize +
							"</b>", context.gaData.population[context.gaData.currentPlayer], true);

					document.getElementById("gaProgress").innerHTML = curr_indv_info +
						" [Generation <b>#" + context.gaData.currentGeneration + "</b>] got <b>"
						+ context.gameManager.score + " pts</b> and the <b>" +
							context.gameManager.grid.getMaxTile() + " tile</b>";
				}

				context.gameManager.restart();

				context.gaData.currentPlayer++;

				if(context.gaData.currentPlayer >= context.gaData.population.length){
					context.gaData.currentPlayer = 0;
					context.gaData.currentGeneration++;
					context.gaData.population = context.ga.generateNewGeneration(context.gaData.population);

					let averageScore = context.gaData.record.currentGenerationAverage / context.gaConfig.populationSize;

					context.gaData.record.generationsAverages.push(averageScore);

					if(context.log){
						document.getElementById("genAvg").innerHTML = "Last generation (<b>#" +
							(context.gaData.currentGeneration - 1) + "</b>) had an average score of <b>" +
							averageScore + " pts</b>"
					}

					console.log("All generations average scores:");
					console.log(context.gaData.record.generationsAverages);
					console.log("");

					context.gaData.record.currentGenerationAverage = 0;
					context.gaData.record.bestGenerationScore = 0;
					context.gaData.record.configBestGenerationScore.weights = undefined;
				}

				if(context.log){
					let best_indv_info = context.playerDropdown("Best individual [Generation <b>#" +
							context.gaData.currentGeneration + "</b>]", context.gaData.record.configBestGenerationScore);

					let all_best_indv_info = context.playerDropdown("All time best individual",
																													context.gaData.record.configBestAllTimeScore);

					document.getElementById("gaTop").innerHTML = best_indv_info + " got <b>" +
						context.gaData.record.bestGenerationScore + " pts</b> and the <b>" +
						context.gaData.record.bestGenerationScoreMaxTile + " tile</b>";

					document.getElementById("gaAllTimeTop").innerHTML = all_best_indv_info +
						" <b>" + context.gaData.record.bestAllTimeScore + " pts</b> and the <b>" +
						context.gaData.record.bestAllTimeScoreMaxTile + " tile</b>";
				}
			}else{
				context.toggleAIPlay();
			}
		}else{
	  		if(context.learn){
	  			let aiResponse = context.gaData.population[context.gaData.currentPlayer].getNextMove(context.gameManager.copyToSimplified());

					let thisMoves = context.gameManager.copyToSimplified();
					thisMoves.move(aiResponse.index);

		  		if(thisMoves.grid.isGridEqual(context.gameManager.grid)){
		  			context.gameManager.restart();
		  		}else{
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
