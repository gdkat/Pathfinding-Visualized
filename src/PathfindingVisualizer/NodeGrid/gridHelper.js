const defaultNode = {
  weight: 1,
  heuristic: Infinity,
  visited: false,
  visitedIndex: 0,
  optimal: false,
  wall: false,
  prev: null,
  distance: Infinity,
};

const unvisitedNode = {
  visited: false,
  visitedIndex: 0,
  optimal: false,
  prev: null,
  distance: Infinity,
  heuristic: Infinity,
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

export const copyGrid = (grid, copyProps = {}) => {
  const { unvisited, weighted, changeStart, changeEnd } = copyProps;
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
      if (weighted === true) newNode.weight = parseInt(Math.random() * 10);
      else if (weighted === false) newNode.weight = 1;
      newGrid[i].push(newNode);
    }
  }

  return newGrid;
};

export const replaceNode = (node, grid) => {
  // const newGrid = copyGrid(grid);

  const { row, col } = node;

  grid[row][col] = { ...node };

  return grid;
};

export const changeStartOrEndNode = (node, grid, end) => {
  const newGrid = copyGrid(grid, { changeStart: !end, changeEnd: end });

  const { row, col } = node;

  if (end) newGrid[row][col] = { ...node, isEnd: true };
  else newGrid[row][col] = { ...node, isStart: true };

  return newGrid;
};
