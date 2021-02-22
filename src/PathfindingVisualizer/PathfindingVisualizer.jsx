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

  const performDjikstra = () => {
    if (sortingProps.active) return;

    reset();

    dispatch({ type: "SET_SORTING_ACTIVE" });
    const gridCopy = genNodeGrid(gridProps);
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

  return (
    <PathfindingContext.Provider value={[state, dispatch]}>
      <div className="pathfinding-visualizer">
        <button className="visualizer-button" onClick={performDjikstra}>
          Visualize
        </button>
        <button className="visualizer-button" onClick={reset}>
          Reset
        </button>
        <input
          type="number"
          step="0.01"
          name="animation-speed"
          onChange={onAnimationSpeedChange}
          value={sortingProps.speed}
        />
        <NodeGrid nodeGrid={grid} />
      </div>
    </PathfindingContext.Provider>
  );
};

export default PathfindingVisualizer;
