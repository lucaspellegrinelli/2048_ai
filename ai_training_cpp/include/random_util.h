#ifndef GAME_2048_RANDOM_UTIL_H
#define GAME_2048_RANDOM_UTIL_H

#include <cstdlib>
#include <time.h>
#include <math.h>

class RandomUtil{
public:
  static void initializeRand();
  static double random();
  static double random(double min, double max);
};

#endif
