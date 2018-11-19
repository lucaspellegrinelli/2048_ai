CC := g++
SRCDIR := src
BUILDDIR := build
TARGET := main
CFLAGS := -g -Wall -O3 -std=c++11 -I include/
RM := rm

all: main

game:
	@mkdir -p build/game/
	$(CC) $(CFLAGS) -c src/tile.cpp -o build/tile.o
	$(CC) $(CFLAGS) -c src/grid.cpp -o build/grid.o
	$(CC) $(CFLAGS) -c src/move.cpp -o build/move.o
	$(CC) $(CFLAGS) -c src/ai.cpp -o build/ai.o
	$(CC) $(CFLAGS) -c src/game.cpp -o build/game.o
	$(CC) $(CFLAGS) -c src/ga.cpp -o build/ga.o

main: game
	$(CC) $(CFLAGS) build/*.o src/main.cpp -o main

clean:
	$(RM) -r $(BUILDDIR)/* $(TARGET)
