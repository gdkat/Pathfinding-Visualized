import Heap from "heap";

const nodeCmp = (a, b) => {
  return a.heuristic + a.distance - (b.heuristic + b.distance);
};

const astar = (grid, gridProps) => {
  const visitedNodes = [];
  const optimal = [];
  const heap = new Heap(nodeCmp);
  heap.push(grid[gridProps.start.row][gridProps.start.col]);

  const { rows, cols } = gridProps;

  let found = null;

  const visit = (node) => {
    if (node == null || (node.wall && !node.isStart && !node.isEnd)) return;

    node.visited = true;
    visitedNodes.push(node);
    node.visitedIndex = visitedNodes.length - 1;

    const { row, col } = node;
    if (node.isStart) node.distance = 0;
    if (node.isEnd) {
      found = node;
      return;
    }
    for (let i = row - 1; i <= row + 1; i++) {
      if (i < 0 || i >= grid.length) continue;
      for (let j = col - 1; j <= col + 1; j++) {
        if (i !== row && j !== col) continue; // diagonals not counted, may choose to change that later
        if (j < 0 || j >= grid[i].length || grid[i][j].visited) continue;

        const initDistance = grid[i][j].distance;
        const calcDistance = grid[i][j].weight + node.distance;
        const heuristic = Math.sqrt(
          Math.pow(i - gridProps.end.row, 2) +
            Math.pow(j - gridProps.end.col, 2)
        ); // Euclidean Distance as heuristic

        if (initDistance > calcDistance) {
          grid[i][j].distance = calcDistance;
          grid[i][j].prev = node;
          grid[i][j].heuristic = heuristic;
        }

        if (initDistance === Infinity) heap.push(grid[i][j]);
        else heap.updateItem(grid[i][j]);
      }
    }
  };

  const traceOptimalPath = () => {
    let prev = found;

    while (prev != null) {
      prev.optimal = true;
      optimal.push(prev);
      prev = prev.prev;
    }
  };

  while (!found && visitedNodes.length < rows * cols && heap.size() > 0)
    visit(heap.pop());

  if (found) traceOptimalPath();

  return [grid, visitedNodes, optimal];
};

export default astar;
