#include "grid.h"

Grid::Grid(){
  for(int i = 0; i < 4; i++){
    for(int j = 0; j < 4; j++){
      this->cells[i][j] = Tile(0);
    }
  }
}

Grid Grid::clone(){
  Grid newGrid;

  for(int i = 0; i < 4; i++){
    for(int j = 0; j < 4; j++){
      newGrid.cells[i][j] = Tile(this->cells[i][j].value);
    }
  }

  return newGrid;
}

bool Grid::isGridEqual(Grid other){
  for(int i = 0; i < 4; i++){
    for(int j = 0; j < 4; j++){
      if(other.cells[i][j].value != this->cells[i][j].value)
        return false;
    }
  }
  return true;
}

bool Grid::withinBounds(int x, int y){
  return x >= 0 && x < 4 && y >= 0 && y < 4;
}
