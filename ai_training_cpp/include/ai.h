#ifndef GAME_2048_AI_H
#define GAME_2048_AI_H

#include <cstdlib>
#include <math.h>

#include "game.h"
#include "move.h"

class AI{
private:
  int searchDepth;

public:
  double priorityWeight;
  double adjacentXWeight;
  double adjacentYWeight;
  double maxTileWeight;
  double openTilesWeight;
  double averageWeight;
  double randomTiles;
  int score;

  int priorityMatrix[4][4] = {
    {15, 14, 13, 12},
    {8,   9, 10, 11},
    {7,   6,  5,  4},
    {0,   1,  2,  3}
  };

  AI();
  AI(double pri, double adjX, double adjY, double maxT, double openT, double avg, double random);

  Move getNextMove(Game snapshot);
  Move getNextMove(Game snapshot, int depth);
  double getGridScore(Grid grid);
};

#endif
