import React from 'react';
import './StaticDistanceGrid.css';

function StaticDistanceGrid() {
  const gridSize = 6;
  const startCell = { row: 1, col: 1 }; // Starting cell (A)
  const endCell = { row: 4, col: 3 }; // Ending cell (B)

  const calculateDistance = (row: number, col: number) => {
    return Math.sqrt(Math.pow(row - endCell.row, 2) + Math.pow(col - endCell.col, 2)).toFixed(2);
  };

  return (
    <div className="grid">
      {Array.from({ length: gridSize }).map((_, row) =>
        Array.from({ length: gridSize }).map((_, col) => (
          <div className="cell" key={`${row}-${col}`}>
            {row === startCell.row && col === startCell.col
              ? 'A'
              : row === endCell.row && col === endCell.col
              ? 'B'
              : calculateDistance(row, col)}
          </div>
        ))
      )}
    </div>
  );
}

export default StaticDistanceGrid;
