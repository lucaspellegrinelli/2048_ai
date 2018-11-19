#include "tile.h"

Tile::Tile(){
  this->value = 0;
  this->blocked = false;
}

Tile::Tile(int value){
  this->value = value;
  this->blocked = false;
}
