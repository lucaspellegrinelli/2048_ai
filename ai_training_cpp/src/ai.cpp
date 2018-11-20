#include "ai.h"

#define SEARCH_DEPTH 5

AI::AI(){
  this->searchDepth = SEARCH_DEPTH;
  this->score = 0;

  this->priorityWeight = 1.0;
  this->adjacentXWeight = -1.0;
  this->adjacentYWeight = -1.0;
  this->maxTileWeight = 0;
  this->openTilesWeight = 0;
  this->averageWeight = 0;
  this->randomTiles = 0.17;
}

AI::AI(double pri, double adjX, double adjY, double maxT, double openT, double avg, double random){
  this->searchDepth = SEARCH_DEPTH;
  this->score = 0;

  this->priorityWeight = pri;
  this->adjacentXWeight = adjX;
  this->adjacentYWeight = adjY;
  this->maxTileWeight = maxT;
  this->openTilesWeight = openT;
  this->averageWeight = avg;
  this->randomTiles = random;
}

Move AI::getNextMove(Game snapshot){
  return this->getNextMove(snapshot, this->searchDepth);
}

Move AI::getNextMove(Game snapshot, int depth){
  double bestHeuristic = -99999;
  int bestHeuristicIndex = -1;

  for(int i = 0; i <= 3; i++){
    Game thisMoves = snapshot.copy();
    thisMoves.move(i);

    if(thisMoves.grid.isGridEqual(snapshot.grid))
			continue;

    double heuristic = -1;

    for(int j = 0; j < std::floor(this->randomTiles * 6); j++) thisMoves.addRandomTile();

    heuristic = this->getGridScore(thisMoves.grid);

    if(depth > 0){
      Move resultHeuristic = this->getNextMove(thisMoves, depth - 1);
      heuristic += resultHeuristic.heuristicValue;
    }

    if(heuristic > bestHeuristic){
			bestHeuristic = heuristic;
			bestHeuristicIndex = i;
		}
  }

  if(bestHeuristicIndex == -1){
    Move m(rand() % 4, bestHeuristic);
    return m;
  }

  Move m(bestHeuristicIndex, bestHeuristic);
  return m;
}

double AI::getGridScore(Grid grid){
  double sumPriority = 0;
	double sumAdjacentX = 0;
	double sumAdjacentY = 0;
	double numberOpenTiles = 0;
	int maxTile = 0;
	double average = 0;
	double averageCount = 0;

	for(int x = 0; x < 4; x++){
		for(int y = 0; y < 4; y++){
			int thisCellValue = grid.cells[x][y].value;

			if(thisCellValue == 0){
				numberOpenTiles++;
			}else if(thisCellValue > maxTile){
				maxTile = thisCellValue;
			}

			if(thisCellValue > 0){
				average += thisCellValue;
				averageCount++;
			}

			//sumPriority += this.priorityMatrix[x][y] * thisCellValue;
			sumPriority += std::pow(this->priorityMatrix[x][y] * 2, 2) * thisCellValue;

			int vectors[4][2] = {
				{x - 1, y},
				{x + 1, y},
				{x, y - 1},
				{x, y + 1},
			};

			for(int i = 0; i < 4; i++){
				if(grid.withinBounds(Position(vectors[i][0], vectors[i][1]))){
					int thisLoopCellValue = grid.cells[vectors[i][0]][vectors[i][1]].value;

					if(i <= 1){
						sumAdjacentX += std::abs(thisLoopCellValue - thisCellValue);
					}else{
						sumAdjacentY += std::abs(thisLoopCellValue - thisCellValue);
					}
				}
			}
		}
	}

	average /= averageCount;

	return (average * this->averageWeight) + (sumPriority * this->priorityWeight) + (sumAdjacentX * this->adjacentXWeight) + (sumAdjacentY * this->adjacentYWeight) + (maxTile * this->maxTileWeight) + (numberOpenTiles * this->openTilesWeight);
}
