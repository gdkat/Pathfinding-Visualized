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
  const { gridProps, grid, sortingProps } = state;

  const reset = () => {
    dispatch({ type: "SET_GRID", payload: genNodeGrid(gridProps) });
    dispatch({ type: "SET_SORTING_INACTIVE" });
  };

  const softReset = () => {
    dispatch({
      type: "SET_GRID",
      payload: copyGrid(grid, { unvisited: true }),
    });
    dispatch({ type: "SET_SORTING_INACTIVE" });
  };

  const performDjikstra = () => {
    if (sortingProps.active) return;

    dispatch({ type: "SET_SORTING_ACTIVE" });
    const gridCopy = copyGrid(grid, { unvisited: true });
    if (gridProps.start != null && gridProps.end != null) {
      const [result] = dijkstra(gridCopy, gridProps);
      dispatch({ type: "SET_GRID", payload: result });
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
          step="1"
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
