import { useEffect, useRef, useReducer } from "react";
import {
  reducer as pathfindingReducer,
  initialState as pathfindingInitialState,
} from "../reducers/PathfindingReducer";
import PathfindingContext from "../context/PathfindingContext";
import "./PathfindingVisualizer.css";
import NodeGrid from "./NodeGrid/NodeGrid";
import dijkstra from "../search/dijkstra";
import { genNodeGrid, copyGrid } from "./NodeGrid/gridHelper";

const PathfindingVisualizer = (props) => {
  const [state, dispatch] = useReducer(
    pathfindingReducer,
    pathfindingInitialState
  );
  const { gridProps, grid, visitedArr, sortingProps } = state;
  const recentTimeout = useRef(null);

  useEffect(() => {
    recentTimeout.current = setTimeout(() => {
      if (visitedArr.length < 1) {
        dispatch({ type: "SET_SORTING_INACTIVE" });
        return;
      }

      const gridCopy = copyGrid(grid);
      const visited = visitedArr[0];

      const newVisitedArr = visitedArr.slice(1);

      gridCopy[visited.row][visited.col] = visited;

      dispatch({ type: "SET_GRID", payload: gridCopy });
      dispatch({ type: "SET_VISITED_ARR", payload: newVisitedArr });
    }, sortingProps.speed);
  }, [visitedArr]);

  const reset = () => {
    clearTimeout(recentTimeout.current);
    dispatch({ type: "SET_GRID", payload: genNodeGrid(gridProps) });
    dispatch({ type: "SET_VISITED_ARR", payload: [] });
    dispatch({ type: "SET_SORTING_INACTIVE" });
  };

  const softReset = () => {
    clearTimeout(recentTimeout.current);
    dispatch({
      type: "SET_GRID",
      payload: copyGrid(grid, { unvisited: true }),
    });
    dispatch({ type: "SET_VISITED_ARR", payload: [] });
    dispatch({ type: "SET_SORTING_INACTIVE" });
  };

  const performDjikstra = () => {
    if (sortingProps.active) return;

    softReset();

    dispatch({ type: "SET_SORTING_ACTIVE" });
    const gridCopy = copyGrid(grid, { unvisited: true });
    if (gridProps.start != null && gridProps.end != null) {
      const [result, visitedArr] = dijkstra(gridCopy, gridProps);
      dispatch({ type: "SET_VISITED_ARR", payload: visitedArr });
    }
  };

  const onAnimationSpeedChange = (e) =>
    dispatch({
      type: "SET_SORTING_SPEED",
      payload: parseFloat(e.target.value),
    });

  const onWeightedToggle = (e) => {
    dispatch({ type: "SET_WEIGHTED_GRID", payload: e.target.checked });
    e.target.checked === false &&
      dispatch({
        type: "SET_GRID",
        payload: copyGrid(grid, { unvisited: true, weighted: false }),
      });
  };

  const generateRandomWeightedGraph = (e) => {
    dispatch({
      type: "SET_GRID",
      payload: copyGrid(grid, { unvisited: true, weighted: true }),
    });
  };

  return (
    <PathfindingContext.Provider value={[state, dispatch]}>
      <div className="pathfinding-visualizer">
        <button className="visualizer-btn" onClick={performDjikstra}>
          Visualize
        </button>
        <button className="soft-reset-btn" onClick={softReset}>
          Soft Reset
        </button>
        <button className="reset-btn" onClick={reset}>
          Reset
        </button>
        <input
          type="checkbox"
          id="weighted"
          name="weighted"
          value="weighted"
          onClick={onWeightedToggle}
          disabled={sortingProps.active}
        />
        {gridProps.weighted && (
          <button
            className="generate-random-weights-btn"
            onClick={generateRandomWeightedGraph}
            disabled={sortingProps.active}
          >
            Generate Random Weights
          </button>
        )}
        <input
          type="number"
          step="0.01"
          name="animation-speed"
          onChange={onAnimationSpeedChange}
          value={sortingProps.speed}
          disabled={sortingProps.active}
        />
        <NodeGrid nodeGrid={grid} />
      </div>
    </PathfindingContext.Provider>
  );
};

export default PathfindingVisualizer;
