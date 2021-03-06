function Grid(size, previousState) {
  this.size = size;
  this.cells = previousState ? this.fromState(previousState) : this.empty();
}

// Build a grid of the specified size
Grid.prototype.empty = function () {
  var cells = [];

  for (var x = 0; x < this.size; x++) {
    var row = cells[x] = [];

    for (var y = 0; y < this.size; y++) {
      row.push(null);
    }
  }

  return cells;
};

Grid.prototype.fromState = function (state) {
  var cells = [];

  for (var x = 0; x < this.size; x++) {
    var row = cells[x] = [];

    for (var y = 0; y < this.size; y++) {
      var tile = state[x][y];
      row.push(tile ? new Tile(tile.position, tile.value) : null);
    }
  }

  return cells;
};

// Find the first available random position
Grid.prototype.randomAvailableCell = function () {
  var cells = this.availableCells();

  if (cells.length) {
    return cells[Math.floor(Math.random() * cells.length)];
  }
};

Grid.prototype.availableCells = function () {
  var cells = [];

  this.eachCell(function (x, y, tile) {
    if (!tile) {
      cells.push({ x: x, y: y });
    }
  });

  return cells;
};

// Call callback for every cell
Grid.prototype.eachCell = function (callback) {
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      callback(x, y, this.cells[x][y]);
    }
  }
};

// Check if there are any cells available
Grid.prototype.cellsAvailable = function () {
  return !!this.availableCells().length;
};

// Check if the specified cell is taken
Grid.prototype.cellAvailable = function (cell) {
  return !this.cellOccupied(cell);
};

Grid.prototype.cellOccupied = function (cell) {
  return !!this.cellContent(cell);
};

Grid.prototype.cellContent = function (cell) {
  if (this.withinBounds(cell)) {
    return this.cells[cell.x][cell.y];
  } else {
    return null;
  }
};

// Inserts a tile at its position
Grid.prototype.insertTile = function (tile) {
  this.cells[tile.x][tile.y] = tile;
};

Grid.prototype.removeTile = function (tile) {
  this.cells[tile.x][tile.y] = null;
};

Grid.prototype.withinBounds = function (position) {
  return position.x >= 0 && position.x < this.size &&
         position.y >= 0 && position.y < this.size;
};

Grid.prototype.serialize = function () {
  var cellState = [];

  for (var x = 0; x < this.size; x++) {
    var row = cellState[x] = [];

    for (var y = 0; y < this.size; y++) {
      row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
    }
  }

  return {
    size: this.size,
    cells: cellState
  };
};

Grid.prototype.clone = function(){
  var newGrid = new Grid(this.size, null);
  newGrid.empty();

  for(var i = 0; i < this.size; i++){
    for(var j = 0; j < this.size; j++){
      let thisCellValue = this.cells[i][j] ? this.cells[i][j].value : 0;

      if(thisCellValue > 0)
        newGrid.insertTile(new Tile({x: i, y: j}, thisCellValue));
    }
  }

  return newGrid;
}

Grid.prototype.print = function(){
  var str = "";

  for(var i = 0; i < this.size; i++){
    for(var j = 0; j < this.size; j++){
      let thisCellValue = this.cells[i][j] ? this.cells[i][j].value : 0;
      str += (thisCellValue + ", ");
    }
    str += "\n";
  }

  console.log(str);
}

Grid.prototype.isGridEqual = function(other){
  for(var i = 0; i < this.size; i++){
    for(var j = 0; j < this.size; j++){
      let cellValue = this.cells[i][j] ? this.cells[i][j].value : 0;
      let otherCellValue = other.cells[i][j] ? other.cells[i][j].value : 0;

      if(cellValue != otherCellValue){
        return false;
      }
    }
  }

  return true;
}

Grid.prototype.getMaxTile = function(){
  let maxTile = 0;
  for(let i = 0; i < this.size; i++){
    for(let j = 0; j < this.size; j++){
      let thisCell = this.cells[i][j];
      let thisCellValue = thisCell ? thisCell.value : 0;
      if(thisCellValue > maxTile) maxTile = thisCellValue;
    }
  }

  return maxTile;
}
