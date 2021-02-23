const defaultNode = {
  weight: 1,
  visited: false,
  optimal: false,
  wall: false,
  prev: null,
  distance: Infinity,
};

const unvisitedNode = {
  weight: 1,
  visited: false,
  optimal: false,
  prev: null,
  distance: Infinity,
};

export const genNodeGrid = (gridProps) => {
  const grid = [];
  const { rows, cols, start, end } = gridProps;

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push({
        ...defaultNode,
        row: i,
        col: j,
        isStart: i === start.row && j === start.col,
        isEnd: i === end.row && j === end.col,
      });
    }

    grid.push(row);
  }

  return grid;
};

export const copyGrid = (grid, unvisited, changeStart, changeEnd) => {
  const newGrid = [];

  for (let i = 0; i < grid.length; i++) {
    newGrid.push([]);
    for (let j = 0; j < grid[i].length; j++) {
      const node = grid[i][j];
      const newNode = {};
      for (const [key, val] of Object.entries(node)) newNode[key] = val;
      if (unvisited)
        for (const [key, val] of Object.entries(unvisitedNode))
          newNode[key] = val;
      if (changeStart) newNode.isStart = false;
      if (changeEnd) newNode.isEnd = false;
      newGrid[i].push(newNode);
    }
  }

  return newGrid;
};

export const replaceNode = (node, grid) => {
  const newGrid = copyGrid(grid);

  const { row, col } = node;

  newGrid[row][col] = { ...node };

  return newGrid;
};

export const changeStartOrEndNode = (node, grid, end) => {
  const newGrid = copyGrid(grid, false, !end, end);

  const { row, col } = node;

  if (end) newGrid[row][col] = { ...node, isEnd: true };
  else newGrid[row][col] = { ...node, isStart: true };

  return newGrid;
};
