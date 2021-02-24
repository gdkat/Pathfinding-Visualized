import { useReducer } from "react";
import {
  reducer as pathfindingReducer,
  initialState as pathfindingInitialState,
} from "../reducers/PathfindingReducer";
import PathfindingContext from "../context/PathfindingContext";
import "./PathfindingVisualizer.css";
import NodeGrid from "./NodeGrid/NodeGrid";
import Settings from "./Settings/Settings";

const PathfindingVisualizer = (props) => {
  const [state, dispatch] = useReducer(
    pathfindingReducer,
    pathfindingInitialState
  );

  const { grid } = state;

  return (
    <PathfindingContext.Provider value={[state, dispatch]}>
      <div className="pathfinding-visualizer">
        <Settings />
        <NodeGrid nodeGrid={grid} />
      </div>
    </PathfindingContext.Provider>
  );
};

export default PathfindingVisualizer;
