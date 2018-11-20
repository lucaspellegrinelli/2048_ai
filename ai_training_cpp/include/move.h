#ifndef GAME_2048_MOVE_H
#define GAME_2048_MOVE_H

class Move{
public:
  int index;
  double heuristicValue;

  Move();
  Move(int index, double heuristicValue);
};

#endif
