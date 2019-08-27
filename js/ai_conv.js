function AI(weights, priorityMatrix = DEFAULT_PRIORITY_MATRIX){
	this.searchDepth = 1;
	this.weightCount = 4 * 4 + 3 * 3 + 2 * 2 + 1;
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
	let gridToMatrix = function(grid){
		let matrix = [];

		for(let i = 0; i < grid.cells.length; i++){
			matrix[i] = [];

			for(let j = 0; j < grid.cells[0].length; j++){
				matrix[i].push(grid.cells[i][j] ? Math.log2(grid.cells[i][j].value) : 0);
			}
		}

		return matrix;
	}

	let convolution = function(matrix, kernelSize){
		let conv = [];

		for(let x = 0; x <= matrix.length - kernelSize; x++){
			conv[x] = [];

			for(let y = 0; y <= matrix[0].length - kernelSize; y++){
				let x_b = [x, x + kernelSize];
				let y_b = [y, y + kernelSize];

				let kernelValue = 0;

				for(let i = x_b[0]; i < x_b[1]; i++){
					for(let j = y_b[0]; j < x_b[1]; j++){
						kernelValue += matrix[i][j];
					}
				}

				conv[x].push(kernelValue);
			}
		}

		return conv;
	}

	var matrixMult = function(a, b) {
		var result = [];

		for (var i = 0; i < a.length; i++) {
			result[i] = [];
			for (var j = 0; j < b[0].length; j++) {
				var sum = 0;
				for (var k = 0; k < a[0].length; k++) {
					sum += a[i][k] * b[k][j];
				}
				result[i][j] = sum;
			}
		}
		return result;
	}

	let weightIndex = 0;

	var createWeightMatrix = function(ctx, size){
		let wMatrix = [];
		for(let i = 0; i < size; i++){
			wMatrix[i] = [];
			for(let j = 0; j < size; j++){
				wMatrix[i].push(ctx.weights[weightIndex++]);
			}
		}

		return wMatrix;
	}

	let convMatrix = gridToMatrix(grid);
	convMatrix = matrixMult(convMatrix, createWeightMatrix(this, convMatrix.length));

	while(convMatrix.length > 1){
		convMatrix = convolution(convMatrix, 2);
		convMatrix = matrixMult(convMatrix, createWeightMatrix(this, convMatrix.length));
	}

	return convMatrix[0];
}
