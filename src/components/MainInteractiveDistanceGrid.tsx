import React from "react";
import "./MainInteractiveDistanceGrid.css";
import ChooseShortestDistance from "./algorithms/ChooseShortestDistance"
import FloodFill from "./algorithms/FloodFill";

function MainInteractiveDistanceGrid() {
    const gridSize = 10;

    const [startCell, setStartCell] = React.useState<{
        row: number;
        col: number;
    } | null>(null);
    const [endCell, setEndCell] = React.useState<{
        row: number;
        col: number;
    } | null>(null);

    const [hoveredCell, setHoveredCell] = React.useState<{
        row: number;
        col: number;
    } | null>(null);
    const [hoverText, setHoverText] = React.useState("");

    const [pathCells, setPathCells] = React.useState<
        { row: number; col: number }[]
    >([]);

    const [wallCells, setWallCells] = React.useState<
        { row: number; col: number }[]
    >([]);

    const [placingWall, setPlacingWall] = React.useState(false)

    const startingGrid: string[][] = Array.from({ length: gridSize }, () =>
        Array.from({ length: gridSize }, () => "")
    );

    const [displayGrid, setDisplayGrid] = React.useState(startingGrid);

    const updateDisplayGridWithData = (cellData: string[][]) => {
        let newDisplayGrid = displayGrid.map((rowCopy) => [...rowCopy]);
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (newDisplayGrid[row][col] !== "A" && newDisplayGrid[row][col] !== "B") {
                    
                    newDisplayGrid[row][col] = cellData[row][col];
                }
            }
        }
        setDisplayGrid(newDisplayGrid);
    }


    const animatePath = (path: { row: number; col: number }[], nextAnimation: Function | null = null, nextPath: { row: number; col: number }[] | null = null) => {
        let moveCount = 0;
        const interval = setInterval(() => {
            if (moveCount >= path.length) {
                clearInterval(interval);
                if (nextAnimation && nextPath) {
                    setPathCells([]) // Clear the path cells
                    nextAnimation(nextPath)
                }
                return;
            }
    
            const currentCell = path[moveCount]; // Get the current cell directly
            setPathCells((prevColoredCells) => {
                const newColoredCells = [...prevColoredCells, currentCell];
                return newColoredCells;
            });
    
            moveCount++;
        }, 100);
    };

    const findPath = () => {
        setPathCells([])
        if (endCell == null || startCell == null) {
            return
        }

        let grid: string[][] = Array.from({length: gridSize}, () => new Array(gridSize).fill(""))
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (wallCells.some((cell) => cell.row === row && cell.col === col)) {
                    grid[row][col] = "X"
                }
            }
        }
        let [floodPath, _] = new FloodFill(grid, startCell, endCell).createFlood()
        let [optimalPath, cellData] = new FloodFill(grid, startCell, endCell).findPathInFlood()
        
        animatePath(floodPath, animatePath, optimalPath)
        updateDisplayGridWithData(cellData)
        
    }

    const calculateDistanceToEnd = (
        row: number,
        col: number,
        newEndCell: { row: number; col: number }
    ) => {
        return Math.sqrt(
            Math.pow(newEndCell.row - row, 2) +
                Math.pow(newEndCell.col - col, 2)
        )
            .toFixed(2)
            .toString();
    };

    const updateDistanceOfCells = (
        grid: string[][],
        newEndCell: { row: number; col: number }
    ) => {
        for (var row = 0; row < gridSize; row++) {
            for (var col = 0; col < gridSize; col++) {
                if (grid[row][col] != "A" && grid[row][col] != "B") {
                    grid[row][col] = calculateDistanceToEnd(
                        row,
                        col,
                        newEndCell
                    );
                    console.log(
                        Math.pow(newEndCell.row - row, 2) +
                            Math.pow(newEndCell.col - col, 2)
                    );
                }
            }
        }
        console.log(grid);
        return grid;
    };

    const onSetAClick = () => {
        setPathCells([])
        console.log("what the siga");
        setHoverText("A");
        setPlacingWall(false)
    };

    const onSetBClick = () => {
        setPathCells([])
        console.log("what the siga");
        setHoverText("B");
        setPlacingWall(false)
    };

    const onSetWallClick = () => {
        setPlacingWall(!placingWall)
        setHoverText("")
    };

    const onCellHover = (row: number, col: number) => {
        if (hoverText == "") return;
        setHoveredCell({ row, col });
    };

    const onCellClick = (row: number, col: number) => {
        if (hoverText != "") {
            var newDisplayGrid = displayGrid.map((rowCopy) => [...rowCopy]);
            var newStartCell = startCell;
            var newEndCell = endCell;
            if (hoverText == "A") {
                if (startCell) {
                    newDisplayGrid[startCell.row][startCell.col] = "";
                }
                newStartCell = { row, col };
            } else if (hoverText == "B") {
                if (endCell) {
                    newDisplayGrid[endCell.row][endCell.col] = "";
                }
                newEndCell = { row, col };
                console.log("holy we set it!");
            }

            newDisplayGrid[row][col] = hoverText;

            console.log(newStartCell, newEndCell);
            if (newStartCell && newEndCell) {
                newDisplayGrid = updateDistanceOfCells(newDisplayGrid, newEndCell);
                console.log(newDisplayGrid);
            }

            console.log(newDisplayGrid);
            setDisplayGrid(newDisplayGrid);
            setHoveredCell(null);
            setStartCell(newStartCell);
            setEndCell(newEndCell);
            setHoverText("");
        }
        else if (placingWall) {
            setWallCells((prevColoredCells) => {
                const newColoredCells = [...prevColoredCells, {row, col}];
                return newColoredCells;
            });
        }
        
    };

    return (
        <div>
            <div className="mainGrid">
                {Array.from({ length: gridSize }).map((_, row) =>
                    Array.from({ length: gridSize }).map((_, col) => {
                        const isHovered =
                            hoveredCell &&
                            row === hoveredCell.row &&
                            col === hoveredCell.col;
                        const isSpecialCell =
                            displayGrid[row][col] === "A" ||
                            displayGrid[row][col] === "B" ||
                            (isHovered && hoverText);
                        const isPathCell = pathCells.find((cell) => cell.row === row && cell.col === col)
                        const isWallCell = wallCells.find((cell) => cell.row === row && cell.col == col)

                        var backgroundColor = "white";
                        // Color start cell and the hover cell green if the start cell is being placed
                        if (
                            displayGrid[row][col] === "A" ||
                            (isHovered && hoverText === "A")
                        ) {
                            // Color hover cell green
                            if (isHovered && hoverText === "A") {
                                backgroundColor = "#1ded15";
                            }
                            // Color the old start cell a lighter green
                            else if (!isHovered && hoverText === "A") {
                                backgroundColor = "#92f58e";
                            }
                            // No hovering cell, just color the current start cell green
                            else {
                                backgroundColor = "#1ded15";
                            }
                        } else if (
                            displayGrid[row][col] === "B" ||
                            (isHovered && hoverText === "B")
                        ) {
                            // Color hover cell orange
                            if (isHovered && hoverText === "B") {
                                backgroundColor = "#eda515";
                            }
                            // Color the old start cell a lighter orange
                            else if (!isHovered && hoverText === "B") {
                                backgroundColor = "#f5c86e";
                            }
                            // No hovering cell, just color the current start cell orange
                            else {
                                backgroundColor = "#eda515";
                            }
                        }
                        else if (isPathCell) {
                            backgroundColor = "#d91818"
                        }
                        else if (isWallCell) {
                            backgroundColor = "#4a4a4a"
                        }

                        const fontSize = isSpecialCell ? 16 : 12;
                        var cellContent = isHovered
                            ? hoverText
                            : displayGrid[row][col];
                        if (isWallCell) {
                            cellContent = ""
                        }
                        return (
                            <div
                                style={{ fontSize, backgroundColor }}
                                onMouseEnter={() => onCellHover(row, col)}
                                onClick={() => onCellClick(row, col)}
                                className="mainCell"
                                key={`${row}-${col}`}>
                                {cellContent}
                            </div>
                        );
                    })
                )}
            </div>
            <button onClick={() => onSetAClick()}>Set A</button>
            <button onClick={() => onSetBClick()}>Set B</button>
            <button onClick={() => onSetWallClick()}>Set Wall</button>
            <button onClick={() => findPath()}>Find Path</button>
        </div>
    );
}

export default MainInteractiveDistanceGrid;
