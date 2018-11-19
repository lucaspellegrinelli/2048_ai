#include "game.h"

Game::Game(){
  this->done = false;
  this->moved = true;
  this->score = 0;
  this->grid = Grid();
  addRandomTile();
}

void Game::restart(){
  this->done = false;
  this->moved = true;
  this->score = 0;
  this->grid = Grid();
  addRandomTile();
}

void Game::resetTileLock(){
  for(int y = 0; y < 4; y++){
    for(int x = 0; x < 4; x++){
      this->grid.cells[x][y].blocked = false;
    }
  }
}

void Game::addRandomTile(){
  for(int y = 0; y < 4; y++){
    for(int x = 0; x < 4; x++){
      if(!this->grid.cells[x][y].value){
        unsigned int a, b;
        do{
          a = rand() % 4;
          b = rand() % 4;
        }while(this->grid.cells[a][b].value);

        int s = rand() % 100;
        if(s > 89){
          this->grid.cells[a][b].value = 4;
        }else{
          this->grid.cells[a][b].value = 2;
        }

        if(canMove()) return;
      }
    }
  }

  this->done = true;
}

void Game::move(int d){
  switch(d){
    case 0: // Up
    for(int x = 0; x < 4; x++){
      int y = 1;
      while(y < 4){
        if(this->grid.cells[x][y].value) moveVertical(x, y, -1);
        y++;
      }
    }
    break;

    case 2: // Down
    for(int x = 0; x < 4; x++){
      int y = 2;
      while(y >= 0){
        if(this->grid.cells[x][y].value) moveVertical(x, y, 1);
        y--;
      }
    }
    break;

    case 3: // Left
    for(int y = 0; y < 4; y++){
      int x = 1;
      while(x < 4){
        if(this->grid.cells[x][y].value) moveHorizontal(x, y, -1);
        x++;
      }
    }
    break;

    case 1: // Right
    for(int y = 0; y < 4; y++){
      int x = 2;
      while(x >= 0){
        if(this->grid.cells[x][y].value) moveHorizontal(x, y, 1);
        x--;
      }
    }
  }
}

bool Game::canMove(){
  for(int y = 0; y < 4; y++){
    for(int x = 0; x < 4; x++){
      if(!this->grid.cells[x][y].value) return true;
    }
  }

  for(int y = 0; y < 4; y++){
    for(int x = 0; x < 4; x++){
      if(testAdd(x + 1, y, this->grid.cells[x][y].value)) return true;
      if(testAdd(x - 1, y, this->grid.cells[x][y].value)) return true;
      if(testAdd(x, y + 1, this->grid.cells[x][y].value)) return true;
      if(testAdd(x, y - 1, this->grid.cells[x][y].value)) return true;
    }
  }

  return false;
}

bool Game::testAdd(int x, int y, int v){
  if(x < 0 || x > 3 || y < 0 || y > 3) return false;
  return this->grid.cells[x][y].value == v;
}

void Game::moveVertical(int x, int y, int d){
  if(this->grid.cells[x][y + d].value != 0 && this->grid.cells[x][y + d].value == this->grid.cells[x][y].value && !this->grid.cells[x][y].blocked && !this->grid.cells[x][y + d].blocked){
    this->grid.cells[x][y].value = 0;
    this->grid.cells[x][y + d].value *= 2;
    this->score += this->grid.cells[x][y + d].value;
    this->grid.cells[x][y + d].blocked = true;
    this->moved = true;
  }else if(this->grid.cells[x][y + d].value == 0 && this->grid.cells[x][y].value != 0){
    this->grid.cells[x][y + d].value = this->grid.cells[x][y].value;
    this->grid.cells[x][y].value = 0;
    this->moved = true;
  }

  if(d > 0){
    if(y + d < 3) moveVertical(x, y + d,  1);
  }else{
    if(y + d > 0) moveVertical(x, y + d, -1);
  }
}

void Game::moveHorizontal(int x, int y, int d){
  if(this->grid.cells[x + d][y].value != 0 && this->grid.cells[x + d][y].value == this->grid.cells[x][y].value && !this->grid.cells[x][y].blocked && !this->grid.cells[x + d][y].blocked){
    this->grid.cells[x][y].value = 0;
    this->grid.cells[x + d][y].value *= 2;
    this->score += this->grid.cells[x + d][y].value;
    this->grid.cells[x + d][y].blocked = true;
    this->moved = true;
  }else if(this->grid.cells[x + d][y].value == 0 && this->grid.cells[x][y].value != 0){
    this->grid.cells[x + d][y].value = this->grid.cells[x][y].value;
    this->grid.cells[x][y].value = 0;
    this->moved = true;
  }

  if(d > 0){
    if(x + d < 3) moveHorizontal(x + d, y,  1);
  }else{
    if(x + d > 0) moveHorizontal(x + d, y, -1);
  }
}

Game Game::copy(){
  Game copied;
  copied.grid = this->grid.clone();
  return copied;
}
