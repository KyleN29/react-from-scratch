export default class ChooseShortestDistance {
    /**
     * Grid must have available spots to move set as "" (empty string),
     * 
     */
    grid: string[][]
    startCell: {row: number, col: number}
    endCell: {row: number, col: number}
    constructor(grid: string[][], startCell: {row: number, col: number}, endCell: {row: number, col: number}) {
        this.grid = grid
        this.startCell = startCell
        this.endCell = endCell
    }

    getBestMove(restrictedCells: {row: number, col: number}[], curPath: {row: number, col: number}[], row: number, col: number, end: {row: number, col: number}) {
        const directions = [
            { row: -1, col: 0 },
            { row: 1, col: 0 },
            { row: 0, col: -1 },
            { row: 0, col: 1 },
            { row: -1, col: -1 },
            { row: -1, col: 1 },
            { row: 1, col: -1 },
            { row: 1, col: 1 },
        ];

        var bestMove = null;
        var bestDistance = 99999999;

        for (const direction of directions) {
            let move = { row: direction.row + row, col: direction.col + col };

            // Must be inside bounds
            if (move.row < 0 || move.row >= this.grid.length || move.col < 0 || move.col >= this.grid.length) {
                continue
            }
            // Cant move into a restricted Cell
            if (restrictedCells.some((cell) => cell.row === move.row && cell.col === move.col)) {
                continue
            }
            //Must move into an empty cell or the end cell
            if (this.grid[move.row][move.col] !== "") {
                continue;
            }
            let distance = Math.sqrt(
                Math.pow(move.row - end.row, 2) +
                    Math.pow(move.col - end.col, 2)
            );

            if (distance < bestDistance) {
                bestMove = move;
                bestDistance = distance
            }
        }
        console.log(bestMove)
        return bestMove
    };

    getBestMoveOnPath(calculatedPath: {row: number, col: number}[], curPath: {row: number, col: number}[], row: number, col: number, start: {row: number, col: number}) {
        const directions = [
            { row: -1, col: 0 },
            { row: 1, col: 0 },
            { row: 0, col: -1 },
            { row: 0, col: 1 },
            { row: -1, col: -1 },
            { row: -1, col: 1 },
            { row: 1, col: -1 },
            { row: 1, col: 1 },
        ];

        var bestMove = null;
        var bestDistance = 99999999;

        for (const direction of directions) {
            let move = { row: direction.row + row, col: direction.col + col };
            // Can only move on calculated path
            if (!(calculatedPath.some((cell) => cell.row === move.row && cell.col === move.col))) {
                continue
            }
            // Cant move where we have already gone
            if (curPath.some((cell) => cell.row === move.row && cell.col === move.col)) {
                continue
            }
            let distance = Math.sqrt(
                Math.pow(move.row - start.row, 2) +
                    Math.pow(move.col - start.col, 2)
            );

            if (distance < bestDistance) {
                bestMove = move;
                bestDistance = distance
            }
        }
        return bestMove
    };
    getPath() {
        var path: {row: number, col: number}[] = []
        var restrictedCells: {row: number, col: number}[] = []
        path.push({row: this.startCell.row, col: this.startCell.col})
        console.log(path)


        for (var i = 0; i < 120; i++) {
            console.log({row: this.startCell.row, col: this.startCell.col})
            console.log(path)
            if (path[path.length -1].row == this.endCell.row && path[path.length - 1].col == this.endCell.col) {
                break
            }
            let curCell = path[path.length -1]
            
            let nextBestMove = this.getBestMove(restrictedCells, path, curCell.row, curCell.col, this.endCell)
            if (nextBestMove == null) {
                const poppedCell = path.pop();
                if (poppedCell) {
                    restrictedCells.push(poppedCell);
                }

            }
            else {
                path.push(nextBestMove)
                this.grid[nextBestMove.row][nextBestMove.col] = "X"
            }   
        }

        var finalPath: {row: number, col: number}[] = []
        finalPath.push({row: this.endCell.row, col: this.endCell.col})
        for (var i = 0; i < path.length; i++) {
            if (finalPath[finalPath.length -1].row == this.startCell.row && finalPath[finalPath.length - 1].col == this.startCell.col) {
                break
            }
            let curCell = finalPath[finalPath.length -1]

            let nextBestMove = this.getBestMoveOnPath(path, finalPath, curCell.row, curCell.col, this.startCell)
            if (nextBestMove == null) {
                continue
            }
            finalPath.push(nextBestMove)
        }
        return finalPath
    }
}