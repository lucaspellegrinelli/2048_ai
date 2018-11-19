#ifndef GAME_2048_TILE_H
#define GAME_2048_TILE_H

class Tile{
public:
  int value;
  bool blocked;

  Tile();
  Tile(int value);
};

#endif
