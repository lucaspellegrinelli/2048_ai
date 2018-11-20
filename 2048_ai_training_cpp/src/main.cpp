#include <time.h>
#include <cstdlib>
#include <vector>
#include <iostream>

#include "game.h"
#include "ai.h"
#include "ga.h"

#define POPULATION_SIZE 64
#define TOURNAMENT_SIZE 4
#define MUTATION_RATE 0.05

void letAIPlay();

int main(){
  srand(static_cast<unsigned int>(time(NULL)));
  letAIPlay();
}

void letAIPlay(){
  int currentPlayer = 0;
  int currentGeneration = 0;

  int bestScoreSoFar = 0;
  double configBestScore[7] = {0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0};
  int bestScoreMaxTile = 0;

  int allTimeBestScore = 0;
  double configAllTimeBestScore[7] = {0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0};
  int allTimeMaxTile = 0;

  int lastChosen = -1;
  int repeatCount = 0;

  double generationAverage = 0.0;
  std::vector<double> genAverages;

  Game game;

  GA ga(POPULATION_SIZE, TOURNAMENT_SIZE, MUTATION_RATE);

  std::vector<AI> population = ga.generateStartPopulation();

  for(;;){
    if(game.done){
      if(game.score > bestScoreSoFar){
        bestScoreSoFar = game.score;
        configBestScore[0] = population[currentPlayer].priorityWeight;
        configBestScore[1] = population[currentPlayer].adjacentXWeight;
        configBestScore[2] = population[currentPlayer].adjacentYWeight;
        configBestScore[3] = population[currentPlayer].maxTileWeight;
        configBestScore[4] = population[currentPlayer].openTilesWeight;
        configBestScore[5] = population[currentPlayer].averageWeight;
        configBestScore[6] = population[currentPlayer].randomTiles;

        for(int i = 0; i < 4; i++){
          for(int j = 0; j < 4; j++){
            if(game.grid.cells[i][j].value > bestScoreMaxTile)
              bestScoreMaxTile = game.grid.cells[i][j].value;
          }
        }
      }

      if(game.score > allTimeBestScore){
        allTimeBestScore = game.score;
        configAllTimeBestScore[0] = population[currentPlayer].priorityWeight;
        configAllTimeBestScore[1] = population[currentPlayer].adjacentXWeight;
        configAllTimeBestScore[2] = population[currentPlayer].adjacentYWeight;
        configAllTimeBestScore[3] = population[currentPlayer].maxTileWeight;
        configAllTimeBestScore[4] = population[currentPlayer].openTilesWeight;
        configAllTimeBestScore[5] = population[currentPlayer].averageWeight;
        configAllTimeBestScore[6] = population[currentPlayer].randomTiles;

        for(int i = 0; i < 4; i++){
          for(int j = 0; j < 4; j++){
            if(game.grid.cells[i][j].value > allTimeMaxTile)
              allTimeMaxTile = game.grid.cells[i][j].value;
          }
        }
      }

      generationAverage += game.score;

      std::cout << "Individual #" << currentPlayer << " made " << game.score << " points" << std::endl;
      std::cout << std::endl << "----------------- // ------------------" << std::endl << std::endl;

      game.restart();

      currentPlayer++;

      if(currentPlayer >= (int)population.size()){
        currentPlayer = 0;
        currentGeneration++;
        population = ga.generateNewGeneration(population);

        std::cout << "GENERATION AVERAGE = " << (generationAverage / (double)population.size()) << std::endl;
        genAverages.push_back((generationAverage / (double)population.size()));

        std::cout << "Previous Generation Averages: " << std::endl;
        for(int i = 0; i < (int)genAverages.size(); i++){
          std::cout << "#" << i << " = " << genAverages[i] << std::endl;
        }

        std::cout << std::endl;

        std::cout << "Best Individual All Time (" << allTimeBestScore << " - " << allTimeMaxTile << "):" << std::endl;
        std::cout << "  priorityWeight: " << configAllTimeBestScore[0] << std::endl;
        std::cout << "  adjacentXWeight: " << configAllTimeBestScore[1] << std::endl;
        std::cout << "  adjacentYWeight: " << configAllTimeBestScore[2] << std::endl;
        std::cout << "  maxTileWeight: " << configAllTimeBestScore[3] << std::endl;
        std::cout << "  openTilesWeight: " << configAllTimeBestScore[4] << std::endl;
        std::cout << "  averageWeight: " << configAllTimeBestScore[5] << std::endl;
        std::cout << "  randomTiles: " << configAllTimeBestScore[6] << std::endl;

        std::cout << std::endl;

        generationAverage = 0;

        bestScoreSoFar = 0;
        configBestScore[0] = 1;
        configBestScore[1] = -1;
        configBestScore[2] = -1;
        configBestScore[3] = 0;
        configBestScore[4] = 0;
        configBestScore[5] = 0;
        configBestScore[6] = 0.17;
        bestScoreMaxTile = 0;
      }

      if(currentGeneration > 0) std::cout << "Last Generation Average: " << genAverages[genAverages.size() - 1] << std::endl;
      std::cout << "Individual #" << currentPlayer << ", Generation #" << currentGeneration << std::endl;
      std::cout << "Best Individual in Generation (" << bestScoreSoFar << " - " << bestScoreMaxTile << "):" << std::endl;
      std::cout << "  priorityWeight: " << configBestScore[0] << std::endl;
      std::cout << "  adjacentXWeight: " << configBestScore[1] << std::endl;
      std::cout << "  adjacentYWeight: " << configBestScore[2] << std::endl;
      std::cout << "  maxTileWeight: " << configBestScore[3] << std::endl;
      std::cout << "  openTilesWeight: " << configBestScore[4] << std::endl;
      std::cout << "  averageWeight: " << configBestScore[5] << std::endl;
      std::cout << "  randomTiles: " << configBestScore[6] << std::endl;

      repeatCount = 0;
      lastChosen = -1;
    }else{
      Move result = population[currentPlayer].getNextMove(game.copy());

      if(result.index == lastChosen) repeatCount++;
      else repeatCount = 0;

      if(repeatCount > 10){
        game.restart();
        repeatCount = 0;
        lastChosen = -1;
      }else{
        lastChosen = result.index;
        game.move(result.index);
        if(game.moved) game.addRandomTile();
        game.resetTileLock();
        population[currentPlayer].score = game.score;
      }
    }
  }
}
