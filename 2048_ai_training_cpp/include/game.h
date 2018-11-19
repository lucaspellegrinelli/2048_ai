#ifndef GAME_2048_GAME_H
#define GAME_2048_GAME_H

#include <cstdlib>
#include <iomanip>
#include <iostream>

#include "grid.h"

class Game{
public:
  bool done, moved;
  int score;
  Grid grid;

  Game();
  void restart();
  void resetTileLock();
  void addRandomTile();
  bool canMove();
  bool testAdd(int x, int y, int v);
  void moveVertical(int x, int y, int d);
  void moveHorizontal(int x, int y, int d);
  void move(int d);

  Game copy();
};

#endif
