export default class Hybrid {
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

    getOptimalMove(curCell: {row: number, col: number}) {
        let x_diff = this.endCell.col - curCell.col
        let y_diff = this.endCell.row - curCell.row
        let rowValue = Math.sign(x_diff)
        let colValue = Math.sign(y_diff)
        
        let optimalMoves = []
        optimalMoves.push({row: rowValue, col: colValue})

        return optimalMove

    }

    validateMove(move: {row: number, col: number}) {
        if (move.row < 0 || move.row >= this.grid.length || move.col < 0 || move.col >= this.grid.length) {
            return false
        }
        if (this.grid[move.row][move.col] !== "") {
            return false
        }
        return true
    }

    getPath() {
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

        var path: { row: number; col: number }[] = [];
        path.push({row: this.startCell.row, col: this.startCell.col})

        // First try to move in a straight line to the end
        while (true) {
            let optimalMove = this.getOptimalMove(path[path.length - 1])
            
            if (!this.validateMove(optimalMove)) {
                break
            }
            path.push(optimalMove)

            if (path[length - 1].row == this.endCell.row && path[length - 1].col == this.endCell.col) {
                return path
            }
        }

        


    }
}