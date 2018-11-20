#ifndef GAME_2048_GAME_H
#define GAME_2048_GAME_H

#include <utility>
#include <vector>
#include <algorithm>
#include <string>

#include "grid.h"

class Game{
private:
  int size;
  int startTiles;
  bool won;
  std::vector<std::pair<std::vector<int>, std::vector<int>>> traversals;

public:
  Grid grid;
  int score;
  bool over;

  Game(int size);
  void setup();
  void restart();
  bool isGameTerminated();
  void addStartTiles();
  void addRandomTile();
  void prepareTiles();
  void moveTile(Tile tile, Position cell);
  void move(int direction);
  Position getVector(int direction);
  void initializeTraversals();
  std::pair<std::vector<int>, std::vector<int>> buildTraversals(Position vector);
  std::pair<Position, Position> findFarthestPosition(Position cell, Position vector);
  bool movesAvailable();
  bool tileMatchesAvailable();
  bool positionsEqual(Position first, Position second);
  Game copy();
};

/*
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
*/

#endif
