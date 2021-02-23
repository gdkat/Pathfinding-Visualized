import Heap from "heap";

const nodeCmp = (a, b) => {
  return a.distance - b.distance;
};

const dijkstra = (grid, gridProps) => {
  const visitedNodes = [];
  const heap = new Heap(nodeCmp);
  heap.push(grid[gridProps.start.row][gridProps.start.col]);

  const { rows, cols } = gridProps;

  let found = null;

  const visit = (node) => {
    if (node == null || (node.wall && !node.isStart && !node.isEnd)) return;

    node.visited = true;
    visitedNodes.push(node);

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
        if (initDistance > calcDistance) {
          grid[i][j].distance = calcDistance;
          grid[i][j].prev = node;
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
      prev = prev.prev;
    }
  };

  while (!found && visitedNodes.length < rows * cols && heap.size() > 0)
    visit(heap.pop());

  if (found) traceOptimalPath();

  return [grid, visitedNodes];
};

export default dijkstra;
