#ifndef GAME_2048_GRID_H
#define GAME_2048_GRID_H

#include "tile.h"

class Grid{
public:
  Tile cells[4][4];
  Grid();
  Grid clone();
  bool isGridEqual(Grid other);
  bool withinBounds(int x, int y);
};

#endif
