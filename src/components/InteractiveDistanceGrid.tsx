import React from "react";
import "./InteractiveDistanceGrid.css";

function findBestMove(
    grid: string[][],
    startCell: { row: number; col: number },
    endCell: { row: number; col: number }
) {
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

    let bestMove = {
        row: startCell.row + directions[0].row,
        col: startCell.col + directions[0].col,
    };;
    let bestDistance = Math.sqrt(
        Math.pow(bestMove.row - endCell.row, 2) +
            Math.pow(bestMove.col - endCell.col, 2)
    );

    for (let direction of directions) {
        let distance = Math.sqrt(
            Math.pow(startCell.row + direction.row - endCell.row, 2) +
                Math.pow(startCell.col + direction.col - endCell.col, 2)
        );
        if (distance < bestDistance) {
            bestDistance = distance;
            bestMove = {
                row: startCell.row + direction.row,
                col: startCell.col + direction.col,
            };
        }
    }

    return bestMove;
}

function InteractiveDistanceGrid() {
    const gridSize = 6;

    const [startCell, setStartCell] = React.useState<{
        row: number;
        col: number;
    } | null>(null);
    const [endCell, setEndCell] = React.useState<{
        row: number;
        col: number;
    } | null>(null);
    const [coloredCells, setColoredCells] = React.useState<
        { row: number; col: number }[]
    >([]);

    // State to track which letter (A or B) we want to potentially show on hover
    var hoverText = ""

    // State to track which cell is currently hovered
    const [hoveredCell, setHoveredCell] = React.useState<{
        row: number;
        col: number;
    } | null>(null);

    const [grid, setGrid] = React.useState(
        Array.from({ length: gridSize }, () => Array(gridSize).fill(""))
    );

    // Calculate distance from every cell to the end cell
    React.useEffect(() => {
        if (startCell && endCell) {
            const newGrid = grid.map((row) => [...row]);
            for (let row = 0; row < gridSize; row++) {
                for (let col = 0; col < gridSize; col++) {
                    if (
                        !(row === startCell.row && col === startCell.col) &&
                        !(row === endCell.row && col === endCell.col)
                    ) {
                        newGrid[row][col] = Math.sqrt(
                            Math.pow(row - endCell.row, 2) +
                                Math.pow(col - endCell.col, 2)
                        ).toFixed(2);
                        setGrid(newGrid);
                    }
                }
            }
            setGrid;
        }
    }, [endCell, startCell]);

    const setHoverText = (text: string) => {
        hoverText = text
    }
    // Mouse handlers
    const handleMouseEnter = (row: number, col: number) => {
        setHoveredCell({ row, col });
    };
    const handleMouseLeave = () => {
        setHoveredCell(null);
    };

    const animatePath = (path: { row: number; col: number }[]) => {
        let moveCount = 0;
        const interval = setInterval(() => {
            if (moveCount >= path.length) {
                clearInterval(interval);
                return;
            }
    
            const currentCell = path[moveCount]; // Get the current cell directly
            setColoredCells((prevColoredCells) => {
                const newColoredCells = [...prevColoredCells, currentCell];
                console.log(currentCell);
                console.log(newColoredCells);
                return newColoredCells;
            });
    
            moveCount++;
        }, 1000);
    };
    
    

    const findPath = () => {
        if (!startCell || !endCell) {
            return;
        }

        setColoredCells([]);

        let path: { row: number; col: number }[] = [];
        path.push(startCell);

        let maxPathLength = gridSize * gridSize;

        while (
            (path[path.length - 1].row !== endCell.row ||
                path[path.length - 1].col !== endCell.col) &&
            path.length < maxPathLength
        ) {
            let bestMove = findBestMove(grid, path[path.length - 1], endCell);
            path.push(bestMove);
        }

        animatePath(path);
    };

    const onCellClick = (row: number, col: number) => {
        const newGrid = grid.map((row) => [...row]);
        if (hoverText === "A") {
            if (startCell) {
                // Clear the previous start cell
                newGrid[startCell.row][startCell.col] = "";
                setGrid(newGrid);
            }
            setStartCell({ row, col });
        } else if (hoverText === "B") {
            if (endCell) {
                // Clear the previous end cell
                newGrid[endCell.row][endCell.col] = "";
                setGrid(newGrid);
            }
            setEndCell({ row, col });
        }

        newGrid[row][col] = hoverText;
        setGrid(newGrid);

        hoverText = ""
    };

    return (
        <div>
            <div className="grid">
                {Array.from({ length: gridSize }).map((_, row) =>
                    Array.from({ length: gridSize }).map((_, col) => (
                        <div
                            className="cell"
                            key={`${row}-${col}`}
                            onMouseEnter={() => handleMouseEnter(row, col)}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => onCellClick(row, col)}
                            style={{
                                cursor: hoverText ? "pointer" : "default",
                                backgroundColor: coloredCells.some(
                                    (cell) => cell.row == row && cell.col == col
                                )
                                    ? "red"
                                    : "",
                            }}>
                            {/* Only show the letter if this cell is the hovered cell */}
                            {(hoveredCell &&
                            hoveredCell.row === row &&
                            hoveredCell.col === col
                                ? hoverText
                                : "") || grid[row][col]}
                        </div>
                    ))
                )}
            </div>
            <button onClick={() => setHoverText("A")}>Set A (start)</button>
            <button onClick={() => setHoverText("B")}>Set B (end)</button>
            <button onClick={() => findPath()}>Find Path</button>
        </div>
    );
}

export default InteractiveDistanceGrid;
