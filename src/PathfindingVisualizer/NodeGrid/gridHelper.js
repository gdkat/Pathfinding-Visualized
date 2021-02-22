export const genNodeGrid = (gridProps) => {
  const grid = [];
  const { rows, cols, start, end } = gridProps;

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push({
        row: i,
        col: j,
        weight: 1,
        distance: Infinity,
        visited: false,
        isStart: i === start.row && j === start.col,
        isEnd: i === end.row && j === end.col,
      });
    }

    grid.push(row);
  }

  return grid;
};

export const copyGrid = (grid) => {
  const newGrid = [];

  for (let i = 0; i < grid.length; i++) {
    newGrid.push([]);
    for (let j = 0; j < grid[i].length; j++) {
      const node = grid[i][j];
      const newNode = {};
      for (const [key, val] of Object.entries(node)) newNode[key] = val;
      newGrid[i].push(newNode);
    }
  }

  return newGrid;
};
