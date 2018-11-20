#include "grid.h"

#include <iostream>

Grid::Grid(){
  this->size = 0;
  this->cells = this->empty();
}

Grid::Grid(int size){
  this->size = size;
  this->cells = this->empty();
}

Grid::Grid(int size, std::vector<std::vector<Tile>> previousState){
  this->size = size;
  this->cells = this->fromState(previousState);
}

std::vector<std::vector<Tile>> Grid::empty(){
  std::vector<std::vector<Tile>> emptyGrid;

  for(int i = 0; i < this->size; i++){
    std::vector<Tile> row;
    for(int j = 0; j < this->size; j++){
      row.push_back(Tile(Position(i, j), 0));
    }

    emptyGrid.push_back(row);
  }

  return emptyGrid;
}

std::vector<std::vector<Tile>> Grid::fromState(std::vector<std::vector<Tile>> state){
  std::vector<std::vector<Tile>> emptyGrid;
  for(int i = 0; i < this->size; i++){
    std::vector<Tile> row;
    for(int j = 0; j < this->size; j++){
      Tile tile = state[i][j];
      row.push_back(Tile(tile.position, tile.value));
    }

    emptyGrid.push_back(row);
  }

  return emptyGrid;
}

Position Grid::randomAvailableCell(){
  std::vector<Position> cells = this->availableCells();

  if(cells.size() > 0){
    return cells[std::floor(RandomUtil::random() * cells.size())];
  }

  return Position(-1, -1);
}

std::vector<Position> Grid::availableCells(){
  std::vector<Position> cells;

  for (int x = 0; x < this->size; x++) {
    for (int y = 0; y < this->size; y++) {
      if(this->cells[x][y].value == 0) cells.push_back(Position(x, y));
    }
  }

  return cells;
}

bool Grid::cellsAvailable(){
  return this->availableCells().size() > 0;
}

bool Grid::cellAvailable(Position cell){
  return !this->cellOccupied(cell);
}

bool Grid::cellOccupied(Position cell){
  return this->cellContent(cell).value > 0;
}

Tile Grid::cellContent(Position cell){
  if(this->withinBounds(cell)){
    return this->cells[cell.x][cell.y];
  }else{
    return Tile(Position(-1, -1), -1);
  }
}

void Grid::insertTile(Tile tile){
  this->cells[tile.position.x][tile.position.y] = Tile(Position(tile.position.x, tile.position.y), tile.value);
}

void Grid::removeTile(Tile tile){
  this->cells[tile.position.x][tile.position.y] = Tile(Position(tile.position.x, tile.position.y), 0);
}

bool Grid::withinBounds(Position position){
  return position.x >= 0 && position.x < this->size &&
         position.y >= 0 && position.y < this->size;
}

Grid Grid::clone(){
  Grid newGrid = Grid(this->size);

  for(int i = 0; i < this->size; i++){
    for(int j = 0; j < this->size; j++){
      int thisCellValue = this->cells[i][j].value;
      if(thisCellValue > 0) newGrid.insertTile(Tile(Position(i, j), thisCellValue));
    }
  }

  return newGrid;
}

bool Grid::isGridEqual(Grid other){
  for(int i = 0; i < this->size; i++){
    for(int j = 0; j < this->size; j++){
      int cellValue = this->cells[i][j].value;
      int otherCellValue = other.cells[i][j].value;

      if(cellValue != otherCellValue) return false;
    }
  }

  return true;
}

int Grid::getMaxTile(){
  int maxTile = 0;
  for(int i = 0; i < this->size; i++){
    for(int j = 0; j < this->size; j++){
      int thisCellValue = this->cells[i][j].value;
      if(thisCellValue > maxTile) maxTile = thisCellValue;
    }
  }

  return maxTile;
}

void Grid::print(){
  for(int i = 0; i < this->size; i++){
    for(int j = 0; j < this->size; j++){
      int thisCellValue = this->cells[j][i].value;
      std::cout << thisCellValue << "\t|";
    }
    std::cout << std::endl;
  }
}
