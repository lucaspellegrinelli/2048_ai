#include "tile.h"

#include <iostream>

Tile::Tile(){
  this->position = Position(-1, -1);
  this->value = 0;

  this->previousPosition = Position(-1, -1);
  this->mergedFrom = std::make_pair("", "");
}

Tile::Tile(Position position, int value){
  this->position = position;
  this->value = value;

  this->previousPosition = Position(-1, -1);
  this->mergedFrom = std::make_pair("", "");
}

void Tile::savePosition(){
  this->previousPosition = Position(this->position.x, this->position.y);
}

void Tile::updatePosition(Position position){
  this->position = position;
}

bool Tile::isMergeEqual(std::pair<std::string, std::string> merged){
  return this->mergedFrom.first == merged.first && this->mergedFrom.second == merged.second;
}

std::string Tile::serialize(){
  return std::to_string(this->position.x) + "-" + std::to_string(this->position.y) + "-" + std::to_string(this->value);
}
