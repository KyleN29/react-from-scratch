export default class FloodFill {
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
    spreadFloodCells(floodGrid: number[][], activeFloodCells: {row: number, col: number, value: number}[]): [number[][], { row: number; col: number; value: number }[]] {
        var newFloodCells: {row: number, col: number, value: number}[] = []

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
        for (const floodCell of activeFloodCells) {
            for (const direction of directions) {
                var newCell = {row: floodCell.row + direction.row, col: floodCell.col + direction.col}
                if (newCell.row < 0 || newCell.row >= this.grid.length || newCell.col < 0 || newCell.col >= this.grid.length) {
                    continue
                }
                //Must move into an empty cell or the end cell
                if (this.grid[newCell.row][newCell.col] !== "") {
                    continue;
                }
                //Must move into an empty cell or the end cell
                if (floodGrid[newCell.row][newCell.col] !== 0) {
                    continue;
                }
                newFloodCells.push({row: newCell.row, col: newCell.col, value: floodCell.value + 1})
                floodGrid[newCell.row][newCell.col] = floodCell.value + 1
            }
        }
        return [floodGrid, newFloodCells]
    }
    createFlood() {
        var floodGrid: number[][] = Array.from({length: this.grid.length}, () => new Array(this.grid.length).fill(0))
        floodGrid[this.startCell.row][this.startCell.col] = -1
        var activeFloodCells: {row: number, col: number, value: number}[] = []

        // Used only to visually display the flood
        var floodPath: {row: number, col: number}[] = []

        activeFloodCells.push({row: this.startCell.row, col: this.startCell.col, value: 0})
        floodPath.push({row: this.startCell.row, col: this.startCell.col})

        for (let i = 0; i < 256; i++) {
            [floodGrid, activeFloodCells] = this.spreadFloodCells(floodGrid, activeFloodCells)
            for (const floodCell of activeFloodCells) {
                floodPath.push({row: floodCell.row, col: floodCell.col})
                if (floodCell.row == this.endCell.row && floodCell.col == this.endCell.col) {
                    return [floodPath, floodGrid.map(row => row.map(num => num.toString()))]
                }
            }
        }
    }

    getBestMoveInFlood(floodGrid: number[][], row: number, col: number, start: {row: number, col: number}) {
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
        var bestMoveScore = 99999999;

        for (const direction of directions) {
            let move = { row: direction.row + row, col: direction.col + col };
            if (move.row < 0 || move.row >= this.grid.length || move.col < 0 || move.col >= this.grid.length) {
                continue
            }
            if (this.grid[move.row][move.col] !== "") {
                continue
            }
            if (floodGrid[move.row][move.col] == 0) {
                continue
            }

            let distance = Math.sqrt(
                Math.pow(move.row - start.row, 2) +
                    Math.pow(move.col - start.col, 2)
            );
            console.log(floodGrid)
            let tileScore = Number(floodGrid[move.row][move.col])

            let moveScore = tileScore
            console.log(moveScore)
            if (moveScore < bestMoveScore) {
                bestMove = move;
                bestMoveScore = moveScore
            }
        }
        return bestMove
    };

    findPathInFlood() {
        var [floodPath, floodGrid] = this.createFlood()

        var path: { row: number; col: number }[] = [];
        path.push(this.endCell);

        let maxPathLength = this.grid.length * this.grid.length;
        for (let i = 0; i < maxPathLength; i++) {
            if (path[path.length -1].row == this.startCell.row && path[path.length - 1].col == this.startCell.col) {
                break
            }
            let curCell = path[path.length -1]

            let bestMove = this.getBestMoveInFlood(floodGrid, curCell.row, curCell.col, this.startCell)

            if (bestMove == null) {
                break
            }

            path.push(bestMove)
        }

        return [path, floodGrid]
    }
}