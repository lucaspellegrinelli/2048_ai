const DEFAULT_PRIORITY_MATRIX = [
	[15, 14, 13, 12],
	[8,   9, 10, 11],
	[7,   6,  5,  4],
	[0,   1,  2,  3]
];

function AI(priorityWeight = 1, adjacentXWeight = -1, adjacentYWeight = -1, maxTileWeight = 0, openTilesWeight = 0, averageWeight = 0, randomTiles = 0.17, priorityMatrix = DEFAULT_PRIORITY_MATRIX){
	this.searchDepth = 5;
	this.priorityWeight = priorityWeight;
	this.adjacentXWeight = adjacentXWeight;
	this.adjacentYWeight = adjacentYWeight;
	this.maxTileWeight = maxTileWeight;
	this.openTilesWeight = openTilesWeight;
	this.priorityMatrix = priorityMatrix;
	this.averageWeight = averageWeight;
	this.randomTiles = randomTiles;
	this.score = 0;
}

AI.prototype.getNextMove = function(gameManager, depth = this.searchDepth){
	let bestHeuristic = -99999;
	let bestHeuristicIndex = -1;

	for(let i = 0; i <= 3; i++){
		let thisMoves = gameManager.copyToSimplified();
		thisMoves.move(i);

		if(thisMoves.grid.isGridEqual(gameManager.grid))
			continue;

		let heuristic = -1;
		if(true){
			for(let j = 0; j < Math.floor(this.randomTiles * 6); j++)
				thisMoves.addRandomTile();

			heuristic = this.getGridScore(thisMoves.grid);
		}else{
			for(let x = 0; x < 4; x++){
				if(!thisMoves.grid[x]) thisMoves.grid[x] = [null, null, null, null];
				for(let y = 0; y < 4; y++){
					if(thisMoves.grid[x][y] === null || thisMoves.grid[x][y] === undefined){
						thisMoves.grid[x][y] = new Tile({x: x, y: y}, 2);
						let thisHeuristic = this.getGridScore(thisMoves.grid);
						if(thisHeuristic < heuristic || heuristic == -1) heuristic = thisHeuristic;
						thisMoves.grid[x][y] = null;
					}
				}
			}
		}

		if(depth > 0){
			let resultHeuristic = this.getNextMove(thisMoves, depth - 1);
			heuristic += resultHeuristic.heuristicValue;
		}

		if(heuristic > bestHeuristic){
			bestHeuristic = heuristic;
			bestHeuristicIndex = i;
		}
	}

	if(bestHeuristicIndex == -1) return {index: Math.floor(Math.random() * 4), heuristicValue: bestHeuristic};

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

			//sumPriority += this.priorityMatrix[x][y] * thisCellValue;
			sumPriority += Math.pow(this.priorityMatrix[x][y] * 2, 2) * thisCellValue;

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

	return (average * this.averageWeight) + (sumPriority * this.priorityWeight) + (sumAdjacentX * this.adjacentXWeight) + (sumAdjacentY * this.adjacentYWeight) + (maxTile * this.maxTileWeight) + (numberOpenTiles * this.openTilesWeight);
}
