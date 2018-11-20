#include "move.h"

Move::Move(){
  this->index = -1;
  this->heuristicValue = 0;
}

Move::Move(int index, double heuristicValue){
  this->index = index;
  this->heuristicValue = heuristicValue;
}
