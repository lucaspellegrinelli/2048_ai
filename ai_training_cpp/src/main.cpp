#include <vector>
#include <iostream>

#include "random_util.h"
#include "game.h"
#include "ai.h"
#include "ga.h"

#define POPULATION_SIZE 64
#define TOURNAMENT_SIZE 4
#define MUTATION_RATE 0.05

void letAIPlay();

int main(){
  RandomUtil::initializeRand();
  letAIPlay();
}

void letAIPlay(){
  Game game = Game(4);

  GA ga = GA(POPULATION_SIZE, TOURNAMENT_SIZE, MUTATION_RATE);

  std::vector<AI> population = ga.generateStartPopulation();
  int currentPlayer = 0;
  int currentGeneration = 0;

  int bestGenerationScore = 0;
  int bestGenerationScoreMaxTile = 0;
  double configBestGenerationScore[7] = {0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0};

  int bestAllTimeScore = 0;
  int bestAllTimeScoreMaxTile = 0;
  double configBestAllTimeScore[7] = {0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0};

  double currentGenerationAverage = 0.0;
  std::vector<double> generationsAverages;

  int lastChosen = -1;
  int repeatCount = 0;

  for(;;){
    if(game.over){
      if(game.score > bestGenerationScore){
        bestGenerationScore = game.score;
        configBestGenerationScore[0] = population[currentPlayer].priorityWeight;
        configBestGenerationScore[1] = population[currentPlayer].adjacentXWeight;
        configBestGenerationScore[2] = population[currentPlayer].adjacentYWeight;
        configBestGenerationScore[3] = population[currentPlayer].maxTileWeight;
        configBestGenerationScore[4] = population[currentPlayer].openTilesWeight;
        configBestGenerationScore[5] = population[currentPlayer].averageWeight;
        configBestGenerationScore[6] = population[currentPlayer].randomTiles;

        bestGenerationScoreMaxTile = game.grid.getMaxTile();

        if(game.score > bestAllTimeScore){
          bestAllTimeScore = game.score;
          bestAllTimeScoreMaxTile = game.grid.getMaxTile();
          configBestAllTimeScore[0] = population[currentPlayer].priorityWeight;
          configBestAllTimeScore[1] = population[currentPlayer].adjacentXWeight;
          configBestAllTimeScore[2] = population[currentPlayer].adjacentYWeight;
          configBestAllTimeScore[3] = population[currentPlayer].maxTileWeight;
          configBestAllTimeScore[4] = population[currentPlayer].openTilesWeight;
          configBestAllTimeScore[5] = population[currentPlayer].averageWeight;
          configBestAllTimeScore[6] = population[currentPlayer].randomTiles;
        }
      }

      currentGenerationAverage += game.score;

      std::cout << "Individual #" << (currentPlayer + 1) << "/" << POPULATION_SIZE << " [Generation #" << currentGeneration << "] got " << game.score << " pts and the " << game.grid.getMaxTile() << " tile" << std::endl;

      game.restart();

      currentPlayer++;

      if(currentPlayer >= (int)population.size()){
        currentPlayer = 0;
        currentGeneration++;
        population = ga.generateNewGeneration(population);

        double averageScore = currentGenerationAverage / POPULATION_SIZE;
        generationsAverages.push_back(averageScore);

        std::cout << "Last generation (#" << (currentGeneration - 1) << ") had an average score of " << averageScore << " pts" << std::endl;

        currentGenerationAverage = 0;
        bestGenerationScore = 0;
        configBestGenerationScore[0] = 1;
        configBestGenerationScore[1] = -1;
        configBestGenerationScore[2] = -1;
        configBestGenerationScore[3] = 0;
        configBestGenerationScore[4] = 0;
        configBestGenerationScore[5] = 0;
        configBestGenerationScore[6] = 0.17;
      }

      std::cout << "Best individual [Generation #" << currentGeneration << "] got " <<	bestGenerationScore << " pts and the " << bestGenerationScoreMaxTile << " tile" << std::endl;
      std::cout << "  priorityWeight: " << configBestGenerationScore[0] << std::endl;
      std::cout << "  adjacentXWeight: " << configBestGenerationScore[1] << std::endl;
      std::cout << "  adjacentYWeight: " << configBestGenerationScore[2] << std::endl;
      std::cout << "  maxTileWeight: " << configBestGenerationScore[3] << std::endl;
      std::cout << "  openTilesWeight: " << configBestGenerationScore[4] << std::endl;
      std::cout << "  averageWeight: " << configBestGenerationScore[5] << std::endl;
      std::cout << "  randomTiles: " << configBestGenerationScore[6] << std::endl << std::endl;

      std::cout << "All time best individual got " << bestAllTimeScore << " pts and the " <<	bestAllTimeScoreMaxTile << " tile" << std::endl;
      std::cout << "  priorityWeight: " << configBestAllTimeScore[0] << std::endl;
      std::cout << "  adjacentXWeight: " << configBestAllTimeScore[1] << std::endl;
      std::cout << "  adjacentYWeight: " << configBestAllTimeScore[2] << std::endl;
      std::cout << "  maxTileWeight: " << configBestAllTimeScore[3] << std::endl;
      std::cout << "  openTilesWeight: " << configBestAllTimeScore[4] << std::endl;
      std::cout << "  averageWeight: " << configBestAllTimeScore[5] << std::endl;
      std::cout << "  randomTiles: " << configBestAllTimeScore[6] << std::endl << std::endl;

      std::cout << "------------------- // -------------------" << std::endl;

      repeatCount = 0;
      lastChosen = -1;
    }else{
      Move aiResponse = population[currentPlayer].getNextMove(game.copy());

      if(aiResponse.index == lastChosen) repeatCount++;
      else repeatCount = 0;

      if(repeatCount > 6){
        game.restart();
        repeatCount = 0;
        lastChosen = -1;
      }else{
        lastChosen = aiResponse.index;
        game.move(aiResponse.index);
        population[currentPlayer].score = game.score;
      }
    }
  }
}
