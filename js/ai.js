const DEFAULT_PRIORITY_MATRIX = [
	[15, 14, 13, 12],
	[8,   9, 10, 11],
	[7,   6,  5,  4],
	[0,   1,  2,  3]
];

function AI(weights, priorityMatrix = DEFAULT_PRIORITY_MATRIX){
	this.searchDepth = 1;
	this.weightCount = 6;
	this.weights = [];

	if(weights == undefined){
		for(let i = 0; i < this.weightCount; i++){
			this.weights.push(Math.random());
		}
	}else{
		this.weights = weights;
	}

	this.priorityMatrix = priorityMatrix;
	this.score = 0;
}

AI.prototype.getNextMove = function(gameManager, depth = this.searchDepth){
	let bestHeuristic = undefined;
	let bestHeuristicIndex = -1;

	let available_moves = [];

	for(let i = 0; i <= 3; i++){
		let thisMoves = gameManager.copyToSimplified();
		thisMoves.move(i);

		if(thisMoves.grid.isGridEqual(gameManager.grid))
			continue;

		available_moves.push(i);

		let heuristic = undefined;

		if(depth > 0){
			let availableCells = thisMoves.grid.availableCells();
			for(let ac = 0; ac < availableCells.length; ac++){
				let cell = availableCells[ac];

				thisMoves.grid.insertTile(new Tile(cell, 2));
				let heuristic2Tile = this.getNextMove(thisMoves, depth - 1);

				thisMoves.grid.insertTile(new Tile(cell, 4));
				let heuristic4Tile = this.getNextMove(thisMoves, depth - 1);

				let heuristicVal = heuristic2Tile.heuristicValue * 0.8 + heuristic4Tile.heuristicValue * 0.2;

				if(heuristic == undefined){
					heuristic = heuristicVal;
				}else{
					heuristic = Math.min(heuristicVal, heuristic);
				}

				thisMoves.grid.removeTile(cell);
			}
		}else{
			heuristic = this.getGridScore(thisMoves.grid);
		}

		if(bestHeuristic == undefined || heuristic > bestHeuristic){
			bestHeuristic = heuristic;
			bestHeuristicIndex = i;
		}
	}

	if(bestHeuristicIndex == -1) return {index: available_moves[0], heuristicValue: bestHeuristic};

	return {index: bestHeuristicIndex, heuristicValue: bestHeuristic};
}

AI.prototype.getGridScore = function(grid){
	let sumPriority = 0;
	let sumAdjacentX = 0;
	let sumAdjacentY = 0;
	let numberOpenTiles = 0;
	let maxTile = 0;
	let average = 0;
	let averageCount = 0;

	for(let x = 0; x < grid.size; x++){
		for(let y = 0; y < grid.size; y++){
			let thisCell = grid.cells[x][y];
			let thisCellValue = thisCell ? thisCell.value : 0;

			if(thisCellValue == 0){
				numberOpenTiles++;
			}else if(thisCellValue > maxTile){
				maxTile = thisCellValue;
			}

			if(thisCellValue > 0){
				average += thisCellValue;
				averageCount++;
			}

			sumPriority += Math.pow(this.priorityMatrix[x][y], 2) * thisCellValue;

			let vectors = [
				{x: x - 1, y: y},
				{x: x + 1, y: y},
				{x: x, y: y - 1},
				{x: x, y: y + 1},
			];

			for(let i = 0; i < vectors.length; i++){
				if(grid.withinBounds(vectors[i])){
					let thisLoopCell = grid.cells[vectors[i].x][vectors[i].y];
					let thisLoopCellValue = thisLoopCell ? thisLoopCell.value : 0;

					if(i <= 1){
						sumAdjacentX += Math.abs(thisLoopCellValue - thisCellValue);
					}else{
						sumAdjacentY += Math.abs(thisLoopCellValue - thisCellValue);
					}
				}
			}
		}
	}

	average /= averageCount;

	return (sumPriority * this.weights[0]) +
			 	 (sumAdjacentX * this.weights[1]) +
			   (sumAdjacentY * this.weights[2]) +
				 (maxTile * this.weights[3]) +
				 (numberOpenTiles * this.weights[4]);
			 	 (average * this.weights[5]);
}
