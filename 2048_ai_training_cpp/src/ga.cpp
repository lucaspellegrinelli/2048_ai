#include "ga.h"

GA::GA(int numberOfIndividuals, int tournamentSize, double mutationRate){
  this->numberOfIndividuals = numberOfIndividuals;
  this->minRandom = -1.0;
  this->maxRandom = 1.0;
  this->tournamentSize = tournamentSize;
  this->mutationRate = mutationRate;
}

std::vector<AI> GA::generateStartPopulation(){
  std::vector<AI> population;

  for(int i = 0; i < this->numberOfIndividuals; i++){
    AI ai(rFloat(this->minRandom, this->maxRandom),
          rFloat(this->minRandom, this->maxRandom),
          rFloat(this->minRandom, this->maxRandom),
          rFloat(this->minRandom, this->maxRandom),
          rFloat(this->minRandom, this->maxRandom),
          rFloat(this->minRandom, this->maxRandom),
          rFloat(this->minRandom, this->maxRandom));

    population.push_back(ai);
  }

  return population;
}

std::vector<AI> GA::generateStartPopulation(std::vector<AI> defaults){
  std::vector<AI> population;

  for(int i = 0; i < (int)defaults.size(); i++){
    population.push_back(defaults[i]);
  }

  for(int i = 0; i < (int)(this->numberOfIndividuals - defaults.size()); i++){
    AI ai(rFloat(this->minRandom, this->maxRandom),
          rFloat(this->minRandom, this->maxRandom),
          rFloat(this->minRandom, this->maxRandom),
          rFloat(this->minRandom, this->maxRandom),
          rFloat(this->minRandom, this->maxRandom),
          rFloat(this->minRandom, this->maxRandom),
          rFloat(this->minRandom, this->maxRandom));

    population.push_back(ai);
  }

  return population;
}

std::vector<AI> GA::generateNewGeneration(std::vector<AI> oldPopulation){
  std::vector<AI> newPopulation;

  AI fittestIndividual = getFittestIndividual(oldPopulation);
  newPopulation.push_back(fittestIndividual);

  for(int i = 1; i < (int)oldPopulation.size(); i++){
		AI firstIndv = tournamentSelection(oldPopulation);
		AI secondIndv = tournamentSelection(oldPopulation);
		AI newIndiv = crossoverIndividuals(firstIndv, secondIndv);
		newPopulation.push_back(newIndiv);
	}

	for (int i = 1; i < (int)newPopulation.size(); i++) {
		newPopulation[i] = mutate(newPopulation[i]);
  }

  return newPopulation;
}

AI GA::tournamentSelection(std::vector<AI> population){
	std::vector<AI> tournamentPopulation;

	for (int i = 0; i < this->tournamentSize; i++) {
    int index = std::trunc((rand() / (RAND_MAX + 1.0)) * population.size());
    tournamentPopulation.push_back(population[index]);
  }

	AI fittest = getFittestIndividual(tournamentPopulation);
	return fittest;
}

AI GA::crossoverIndividuals(AI first, AI second){
    double priorityCrossed = ((rand() / (RAND_MAX + 1.0)) <= 0.5) ? first.priorityWeight : second.priorityWeight;
    double adjecentXCrossed = ((rand() / (RAND_MAX + 1.0)) <= 0.5) ? first.adjacentXWeight : second.adjacentXWeight;
		double adjecentYCrossed = ((rand() / (RAND_MAX + 1.0)) <= 0.5) ? first.adjacentYWeight : second.adjacentYWeight;
    double maxTileCrossed = ((rand() / (RAND_MAX + 1.0)) <= 0.5) ? first.maxTileWeight : second.maxTileWeight;
    double openTilesCrossed = ((rand() / (RAND_MAX + 1.0)) <= 0.5) ? first.openTilesWeight : second.openTilesWeight;
    double averageCrossed = ((rand() / (RAND_MAX + 1.0)) <= 0.5) ? first.averageWeight : second.averageWeight;
    double randomTileCrossed = ((rand() / (RAND_MAX + 1.0)) <= 0.5) ? first.randomTiles : second.randomTiles;

    AI ai(priorityCrossed, adjecentXCrossed, adjecentYCrossed, maxTileCrossed, openTilesCrossed, averageCrossed, randomTileCrossed);
    return ai;
}

AI GA::mutate(AI individual){
	double priority = ((rand() / (RAND_MAX + 1.0)) <= mutationRate) ? mutationFunction(individual.priorityWeight) : individual.priorityWeight;
	double adjecentX = ((rand() / (RAND_MAX + 1.0)) <= mutationRate) ? mutationFunction(individual.adjacentXWeight) : individual.adjacentXWeight;
	double adjecentY = ((rand() / (RAND_MAX + 1.0)) <= mutationRate) ? mutationFunction(individual.adjacentYWeight) : individual.adjacentYWeight;
	double maxTile = ((rand() / (RAND_MAX + 1.0)) <= mutationRate) ? mutationFunction(individual.maxTileWeight) : individual.maxTileWeight;
	double openTiles = ((rand() / (RAND_MAX + 1.0)) <= mutationRate) ? mutationFunction(individual.openTilesWeight) : individual.openTilesWeight;
	double average = ((rand() / (RAND_MAX + 1.0)) <= mutationRate) ? mutationFunction(individual.averageWeight) : individual.averageWeight;
	double randomTile = ((rand() / (RAND_MAX + 1.0)) <= mutationRate) ? mutationFunction(individual.randomTiles) : individual.randomTiles;

	AI ai(priority, adjecentX, adjecentY, maxTile, openTiles, average, randomTile);
  return ai;
}

double GA::mutationFunction(double oldValue){
  // oldValue += this->rFloat(-0.3, 0.3);
  //
	// if(oldValue > 1) return 1;
	// else if(oldValue < -1) return -1;
	// else return oldValue;

  return this->rFloat(this->minRandom, this->maxRandom);
}

AI GA::getFittestIndividual(std::vector<AI> population){
  double bestScore = 0;
	double bestScoreIndex = -1;

	for(int i = 0; i < (int)population.size(); i++){
		if(population[i].score > bestScore){
			bestScore = population[i].score;
			bestScoreIndex = i;
		}
	}

	return population[bestScoreIndex];
}

double GA::rFloat(double min, double max){
  double zeroOne = rand() / (RAND_MAX + 1.0);
  return zeroOne * (max - min) + min;
}
