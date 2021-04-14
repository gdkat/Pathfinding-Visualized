import { useContext } from "react";
import PathfindingContext from "../../context/PathfindingContext";
import Node from "../Node/Node";
import "./NodeGrid.css";

const NodeGrid = (props) => {
  const { nodeGrid } = props;
  const [{ mouseDown }, dispatch] = useContext(PathfindingContext);

  return (
    <div
      className="node-grid"
      onMouseLeave={(e) => dispatch({ type: "SET_MOUSE_UP" })}
    >
      {nodeGrid.map((row, rowIdx) => {
        return (
          <div key={rowIdx} className="node-grid-row">
            {row.map((node, nodeIdx) => (
              <Node key={`${rowIdx}${nodeIdx}`} nodeProps={node} />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default NodeGrid;
