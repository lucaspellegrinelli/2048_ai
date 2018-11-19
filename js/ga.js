function GA(numberOfIndividuals, tournamentSize, mutationRate){
	this.numberOfIndividuals = numberOfIndividuals;
	this.tournamentSize = tournamentSize;
	this.mutationRate = mutationRate;
}

GA.prototype.generateStartPopulation = function(defaults = []){
	let population = [];

	for(let i = 0; i < this.numberOfIndividuals - defaults.length; i++){
		population.push(new AI(this.rFloat(-1.0, 1.0), this.rFloat(-1.0, 1.0), this.rFloat(-1.0, 1.0),
			this.rFloat(-1.0, 1.0),	this.rFloat(-1.0, 1.0),	this.rFloat(-1.0, 1.0),	this.rFloat(-1.0, 1.0)));
	}

	for(let i = 0; i < defaults.length; i++){
		population.push(defaults[i]);
	}

	return population;
}

GA.prototype.generateNewGeneration = function(oldPopulation){
	let newPopulation = [];

	let fittestIndividual = this.getFittestIndividual(oldPopulation);
	newPopulation.push(fittestIndividual);

	for(let i = 1; i < oldPopulation.length; i++){
		let firstIndv = this.tournamentSelection(oldPopulation);
		let secondIndv = this.tournamentSelection(oldPopulation);
		let newIndiv = this.crossoverIndividuals(firstIndv, secondIndv);
		newPopulation.push(newIndiv);
	}

	for (let i = 1; i < newPopulation.length; i++) {
		newPopulation[i] = this.mutate(newPopulation[i], mutationRate);
  }

  return newPopulation;
}

GA.prototype.tournamentSelection = function(population){
	let tournamentPopulation = [];

	for (let i = 0; i < this.tournamentSize; i++) {
    let index = Math.trunc(Math.random() * population.length);
    tournamentPopulation.push(population[index]);
  }

	let fittest = this.getFittestIndividual(tournamentPopulation);
	return fittest;
}

GA.prototype.crossoverIndividuals = function(first, second){
	let priorityCrossed = (Math.random() <= 0.5) ? first.priorityWeight : second.priorityWeight;
  let adjecentXCrossed = (Math.random() <= 0.5) ? first.adjacentXWeight : second.adjacentXWeight;
	let adjecentYCrossed = (Math.random() <= 0.5) ? first.adjacentYWeight : second.adjacentYWeight;
  let maxTileCrossed = (Math.random() <= 0.5) ? first.maxTileWeight : second.maxTileWeight;
  let openTilesCrossed = (Math.random() <= 0.5) ? first.openTilesWeight : second.openTilesWeight;
  let averageCrossed = (Math.random() <= 0.5) ? first.averageWeight : second.averageWeight;
  let randomTileCrossed = (Math.random() <= 0.5) ? first.randomTiles : second.randomTiles;

  return new AI(priorityCrossed, adjecentXCrossed, adjecentYCrossed, maxTileCrossed, openTilesCrossed, averageCrossed, randomTileCrossed);
}

GA.prototype.mutate = function(individual){
	let priority = (Math.random() <= this.mutationRate) ? this.mutationFunction(individual.priorityWeight) : individual.priorityWeight;
	let adjecentX = (Math.random() <= this.mutationRate) ? this.mutationFunction(individual.adjacentXWeight) : individual.adjacentXWeight;
	let adjecentY = (Math.random() <= this.mutationRate) ? this.mutationFunction(individual.adjacentYWeight) : individual.adjacentYWeight;
	let maxTile = (Math.random() <= this.mutationRate) ? this.mutationFunction(individual.maxTileWeight) : individual.maxTileWeight;
	let openTiles = (Math.random() <= this.mutationRate) ? this.mutationFunction(individual.openTilesWeight) : individual.openTilesWeight;
	let average = (Math.random() <= this.mutationRate) ? this.mutationFunction(individual.averageWeight) : individual.averageWeight;
	let randomTile = (Math.random() <= this.mutationRate) ? this.mutationFunction(individual.randomTiles) : individual.randomTiles;

	return new AI(priority, adjecentX, adjecentY, maxTile, openTiles, average, randomTile);
}

GA.prototype.mutationFunction = function(oldValue){
	return this.rFloat(-1.0, 1.0);
}

GA.prototype.getFittestIndividual = function(population){
	let bestScore = 0;
	let bestScoreIndex = -1;

	for(let i = 0; i < population.length; i++){
		if(population[i].score > bestScore){
			bestScore = population[i].score;
			bestScoreIndex = i;
		}
	}

	return population[bestScoreIndex];
}

GA.prototype.rFloat = function(min, max) {
  return Math.random() * (max - min) + min;
}
