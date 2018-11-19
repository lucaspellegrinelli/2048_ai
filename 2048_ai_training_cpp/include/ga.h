#ifndef GAME_2048_GA_H
#define GAME_2048_GA_H

#include <vector>

#include "ai.h"

class GA{
private:
  double minRandom;
  double maxRandom;
  int tournamentSize;
  double mutationRate;
  int numberOfIndividuals;

public:
  GA(int numberOfIndividuals, int tournamentSize, double mutationRate);
  std::vector<AI> generateStartPopulation();
  std::vector<AI> generateStartPopulation(std::vector<AI> defaults);
  std::vector<AI> generateNewGeneration(std::vector<AI> oldPopulation);
  AI tournamentSelection(std::vector<AI> population);
  AI crossoverIndividuals(AI first, AI second);
  AI mutate(AI individual);
  double mutationFunction(double oldValue);
  AI getFittestIndividual(std::vector<AI> population);
  double rFloat(double min, double max);
};

#endif
