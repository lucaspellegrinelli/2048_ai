function GA(numberOfIndividuals, tournamentSize, mutationRate){
	this.numberOfIndividuals = numberOfIndividuals;
	this.tournamentSize = tournamentSize;
	this.mutationRate = mutationRate;
}

GA.prototype.generateStartPopulation = function(defaults = []){
	let population = [];

	for(let i = 0; i < defaults.length; i++){
		population.push(defaults[i]);
	}

	for(let i = 0; i < this.numberOfIndividuals - defaults.length; i++){
		population.push(new AI());
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
		newPopulation[i] = this.mutate(newPopulation[i]);
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
	let newWeights = []

	for(let i = 0; i < first.weights.length; i++){
		newWeights.push((Math.random() <= 0.5) ? first.weights[i] : second.weights[i]);
	}

  return new AI(newWeights);
}

GA.prototype.mutate = function(individual){
	let newWeights = []

	for(let i = 0; i < individual.weights.length; i++){
		newWeights.push((Math.random() <= this.mutationRate) ? this.mutationFunction(individual.weights[i]) : individual.weights[i]);
	}

	return new AI(newWeights);
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
