#include "game.h"

#include <iostream>

Game::Game(int size){
  this->size = size;
  this->startTiles = 2;
  this->setup();
}

void Game::restart(){
  this->setup();
}

bool Game::isGameTerminated(){
  return this->over;
}

void Game::setup(){
  this->grid = Grid(this->size);
  this->score = 0;
  this->over = false;
  this->won = false;
  this->addStartTiles();
}

void Game::addStartTiles(){
  for(int i = 0; i < this->startTiles; i++){
    this->addRandomTile();
  }
}

void Game::addRandomTile(){
  if(this->grid.cellsAvailable()){
    int value = RandomUtil::random() < 0.9 ? 2 : 4;
    Tile tile = Tile(this->grid.randomAvailableCell(), value);

    this->grid.insertTile(tile);
  }
}

void Game::prepareTiles(){
  for(int i = 0; i < this->grid.size; i++){
    for(int j = 0; j < this->grid.size; j++){
      Tile tile = this->grid.cells[i][j];
      if(tile.value != 0){
        tile.mergedFrom = std::make_pair("", "");
        tile.savePosition();
      }
    }
  }
}

void Game::moveTile(Tile tile, Position cell){
  this->grid.cells[tile.position.x][tile.position.y] = Tile(tile.position, 0);
  this->grid.cells[cell.x][cell.y] = Tile(cell, tile.value);
}

void Game::move(int direction){
  if(this->isGameTerminated()) return;
  Position cell = Position(-1, -1);
  Tile tile = Tile();
  Position vector = this->getVector(direction);
  std::pair<std::vector<int>, std::vector<int>> traversals = this->buildTraversals(vector);
  bool moved = false;

  this->prepareTiles();

  for(int x : traversals.first){
    for(int y : traversals.second){
      cell = Position(x, y);
      tile = this->grid.cellContent(cell);

      if(tile.value > 0){
        std::pair<Position, Position> positions = this->findFarthestPosition(cell, vector);
        Tile next = this->grid.cellContent(positions.second);

        if(next.value > 0 && next.value == tile.value && next.isMergeEqual(std::make_pair("", ""))){
          Tile merged = Tile(positions.second, tile.value * 2);
          merged.mergedFrom = std::make_pair(tile.serialize(), next.serialize());
          this->grid.insertTile(merged);
          this->grid.removeTile(tile);
          tile.updatePosition(positions.second);
          this->score += merged.value;
          if(merged.value == 2048) this->won = true;
        }else{
          this->moveTile(tile, positions.first);
          tile.updatePosition(positions.first);
        }

        if(cell.x != tile.position.x || cell.y != tile.position.y) moved = true;
      }
    }
  }

  if(moved){
    this->addRandomTile();

    if(!this->movesAvailable()){
      this->over = true;
    }
  }
}

Position Game::getVector(int direction){
  if(direction == 0) return Position(0, -1);
  else if(direction == 1) return Position(1, 0);
  else if(direction == 2) return Position(0, 1);
  else return Position(-1, 0);
}

std::pair<std::vector<int>, std::vector<int>> Game::buildTraversals(Position vector){
  std::pair<std::vector<int>, std::vector<int>> traversals;

  for(int pos = 0; pos < this->size; pos++){
    traversals.first.push_back(pos);
    traversals.second.push_back(pos);
  }

  if(vector.x == 1) std::reverse(traversals.first.begin(), traversals.first.end());
  if(vector.y == 1) std::reverse(traversals.second.begin(), traversals.second.end());

  return traversals;
}

std::pair<Position, Position> Game::findFarthestPosition(Position cell, Position vector){
  Position previous(-1, -1);

  do{
    previous = cell;
    cell = Position(previous.x + vector.x, previous.y + vector.y);
  }while(this->grid.withinBounds(cell) && this->grid.cellAvailable(cell));

  return std::make_pair(previous, cell);
}

bool Game::movesAvailable(){
  return this->grid.cellsAvailable() || this->tileMatchesAvailable();
}

bool Game::tileMatchesAvailable(){
  Tile tile = Tile(Position(-1, -1), -1);

  for(int i = 0; i < this->size; i++){
    for(int j = 0; j < this->size; j++){
      tile = this->grid.cellContent(Position(i, j));

      if(tile.value > 0){
        for(int direction = 0; direction < 4; direction++){
          Position vector = this->getVector(direction);
          Position cell = Position(i + vector.x, j + vector.y);

          Tile other = this->grid.cellContent(cell);

          if(other.value > 0 && other.value == tile.value){
            return true;
          }
        }
      }
    }
  }

  return false;
}

bool Game::positionsEqual(Position first, Position second){
  return first.x == second.x && first.y == second.y;
}

Game Game::copy(){
  Game newGame = Game(this->size);
  newGame.grid = this->grid.clone();
  return newGame;
}
