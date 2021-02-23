import Node from "../Node/Node";
import "./NodeGrid.css";

const NodeGrid = (props) => {
  const { nodeGrid } = props;

  return (
    <div className="node-grid">
      {nodeGrid.map((row, rowIdx) => {
        return (
          <div className="node-grid-row">
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
