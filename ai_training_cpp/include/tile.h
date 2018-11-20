#ifndef GAME_2048_TILE_H
#define GAME_2048_TILE_H

#include <utility>
#include <string>

#include "position.h"

class Tile{
public:
  Position position;
  int value;
  Position previousPosition;
  std::pair<std::string, std::string> mergedFrom;

  Tile();
  Tile(Position position, int value);
  void savePosition();
  void updatePosition(Position position);
  bool isMergeEqual(std::pair<std::string, std::string> merge);
  std::string serialize();
};

#endif
