#include "random_util.h"

void RandomUtil::initializeRand(){
  srand(static_cast<unsigned int>(time(NULL)));
}

double RandomUtil::random(){
  return rand() / (RAND_MAX + 1.0);
}

double RandomUtil::random(double min, double max){
  return RandomUtil::random() * (max - min) + min;
}
