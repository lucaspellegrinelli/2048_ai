let numberOfIndividuals = 16;
let minRandom = -1.0;
let maxRandom = 1.0;

let tournamentSize = 4;
let mutationRate = 0.05;

function generateStartPopulation(defaults){
	let population = [];

	for(let i = 0; i < numberOfIndividuals - defaults.length; i++){
		population.push(new AI(rFloat(minRandom, maxRandom),
								rFloat(minRandom, maxRandom),
								rFloat(minRandom, maxRandom),
								rFloat(minRandom, maxRandom),
								rFloat(minRandom, maxRandom),
								rFloat(minRandom, maxRandom),
								rFloat(minRandom, maxRandom)));
	}

	for(let i = 0; i < defaults.length; i++){
		population.push(defaults[i]);
	}

	return population;
}

function generateNewGeneration(oldPopulation){
	let newPopulation = [];

	let fittestIndividual = getFittestIndividual(oldPopulation);
	newPopulation.push(fittestIndividual);

	for(let i = 1; i < oldPopulation.length; i++){
		let firstIndv = tournamentSelection(oldPopulation);
		let secondIndv = tournamentSelection(oldPopulation);
		let newIndiv = crossoverIndividuals(firstIndv, secondIndv);
		newPopulation.push(newIndiv);
	}

	for (let i = 1; i < newPopulation.length; i++) {
		newPopulation[i] = mutate(newPopulation[i], mutationRate);
  }

  return newPopulation;
}

function tournamentSelection(population) {
	let tournamentPopulation = [];

	for (let i = 0; i < tournamentSize; i++) {
    let index = Math.trunc(Math.random() * population.length);
    tournamentPopulation.push(population[index]);
  }

	let fittest = getFittestIndividual(tournamentPopulation);
	return fittest;
}

function crossoverIndividuals(firstIndividual, secondIndividual) {
    let priorityCrossed = (Math.random() <= 0.5) ? firstIndividual.priorityWeight : secondIndividual.priorityWeight;
    let adjecentXCrossed = (Math.random() <= 0.5) ? firstIndividual.adjacentXWeight : secondIndividual.adjacentXWeight;
		let adjecentYCrossed = (Math.random() <= 0.5) ? firstIndividual.adjacentYWeight : secondIndividual.adjacentYWeight;
    let maxTileCrossed = (Math.random() <= 0.5) ? firstIndividual.maxTileWeight : secondIndividual.maxTileWeight;
    let openTilesCrossed = (Math.random() <= 0.5) ? firstIndividual.openTilesWeight : secondIndividual.openTilesWeight;
    let averageCrossed = (Math.random() <= 0.5) ? firstIndividual.averageWeight : secondIndividual.averageWeight;
    let randomTileCrossed = (Math.random() <= 0.5) ? firstIndividual.randomTiles : secondIndividual.randomTiles;

    return new AI(priorityCrossed, adjecentXCrossed, adjecentYCrossed, maxTileCrossed, openTilesCrossed, averageCrossed, randomTileCrossed);
}

function mutate(indidual, mutation){
	let priority = (Math.random() <= mutationRate) ? mutationFunction(indidual.priorityWeight) : indidual.priorityWeight;
	let adjecentX = (Math.random() <= mutationRate) ? mutationFunction(indidual.adjacentXWeight) : indidual.adjacentXWeight;
	let adjecentY = (Math.random() <= mutationRate) ? mutationFunction(indidual.adjacentYWeight) : indidual.adjacentYWeight;
	let maxTile = (Math.random() <= mutationRate) ? mutationFunction(indidual.maxTileWeight) : indidual.maxTileWeight;
	let openTiles = (Math.random() <= mutationRate) ? mutationFunction(indidual.openTilesWeight) : indidual.openTilesWeight;
	let average = (Math.random() <= mutationRate) ? mutationFunction(indidual.averageWeight) : indidual.averageWeight;
	let randomTile = (Math.random() <= mutationRate) ? mutationFunction(indidual.randomTiles) : indidual.randomTiles;

	return new AI(priority, adjecentX, adjecentY, maxTile, openTiles, average, randomTile);
}

function mutateMatrix(matrix){
	for(let i = 0; i < matrix.length; i++){
		for(let j = 0; j < matrix[0].length; j++){
			matrix[i][j] += rFloat(-0.3, 0.3);

			if(matrix[i][j] > 1)
				matrix[i][j] = 1;
			else if(matrix[i][j] < -1)
				matrix[i][j] = -1
		}
	}

	return matrix;
}

function mutationFunction(oldValue){
	oldValue += rFloat(-0.3, 0.3);

	if(oldValue > 1)
		return 1;
	else if(oldValue < -1)
		return -1
	else return oldValue;
}

function getFittestIndividual(population){
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

function rFloat(min, max) {
  return Math.random() * (max - min) + min;
}
