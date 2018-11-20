#ifndef GAME_2048_GRID_H
#define GAME_2048_GRID_H

#include <math.h>
#include <vector>

#include "random_util.h"
#include "tile.h"

class Grid{
public:
  int size;
  std::vector<std::vector<Tile>> cells;

  Grid();
  Grid(int size);
  Grid(int size, std::vector<std::vector<Tile>> previousState);

  std::vector<std::vector<Tile>> empty();
  std::vector<std::vector<Tile>> fromState(std::vector<std::vector<Tile>> state);
  Position randomAvailableCell();
  std::vector<Position> availableCells();
  bool cellsAvailable();
  bool cellAvailable(Position cell);
  bool cellOccupied(Position cell);
  Tile cellContent(Position cell);
  void insertTile(Tile tile);
  void removeTile(Tile tile);
  bool withinBounds(Position position);
  Grid clone();
  bool isGridEqual(Grid other);
  int getMaxTile();
  void print();
};

#endif
