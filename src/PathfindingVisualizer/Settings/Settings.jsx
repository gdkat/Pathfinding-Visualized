import { useContext, useRef, useState, useEffect, useMemo } from "react";
import PathfindingContext from "../../context/PathfindingContext";
import { genNodeGrid, copyGrid } from "../NodeGrid/gridHelper";
import supportedAlgorithms from "../../search/supportedAlgorithms";
import "./Settings.css";
import Accordion from "../components/accordion/Accordion";

const Settings = (props) => {
  const [state, dispatch] = useContext(PathfindingContext);
  const { gridProps, grid, sortingProps } = state;
  const [dragging, setDragging] = useState({
    active: false,
    initialX: 0,
    initialY: 0,
    draggingX: 0,
    draggingY: 0,
    offsetX: 0,
    offsetY: 0,
  });
  const settingsDiv = useRef(null);

  useEffect(() => {
    function setTranslate(xPos, yPos, el) {
      el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }

    dragging.active &&
      setTranslate(dragging.currentX, dragging.currentY, settingsDiv.current);
  }, [dragging]);

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

  const performSearch = () => {
    if (sortingProps.active) return;

    dispatch({ type: "SET_SORTING_ACTIVE" });
    const gridCopy = copyGrid(grid, { unvisited: true });
    if (gridProps.start != null && gridProps.end != null) {
      const [result] = supportedAlgorithms[sortingProps.type](
        gridCopy,
        gridProps
      );
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

  const onAlgoToggle = (e) => {
    softReset();
    dispatch({
      type: "SET_SORTING_TYPE",
      payload: e.target.options[e.target.selectedIndex].text,
    });
  };

  const generateRandomWeightedGraph = (e) => {
    dispatch({
      type: "SET_GRID",
      payload: copyGrid(grid, { unvisited: true, weighted: true }),
    });
  };

  function drag(e) {
    if (!dragging.active && e.currentTarget === settingsDiv.current) return;

    let currentX, currentY;
    e.preventDefault();
    // e.currentTarget.clientWidth;

    currentX = e.clientX - dragging.offsetX;
    currentY = e.clientY - dragging.offsetY;

    setDragging({ ...dragging, currentX, currentY });
  }

  const accordions = [
    {
      header: "Algorithm Properties",
      body: (
        <>
          <label htmlFor="algos">Choose an algorithm: </label>
          <select
            id="algos"
            name="algos"
            value={sortingProps.type}
            onChange={onAlgoToggle}
          >
            {Object.keys(supportedAlgorithms).map((el, index) => (
              <option key={index} value={el}>
                {el}
              </option>
            ))}
          </select>{" "}
          <br />
          <label htmlFor="animation-speed">Speed (ms): </label>
          <input
            type="number"
            step="1"
            name="animation-speed"
            onChange={onAnimationSpeedChange}
            value={sortingProps.speed}
            disabled={sortingProps.active}
          />
        </>
      ),
    },
    {
      header: "Grid Properties",
      body: (
        <>
          <label>Grid Dimensions: </label>
          <br />
          Rows:{" "}
          <input
            type="number"
            id="grid-rows"
            name="grid-rows"
            value={gridProps.rows}
            max={30}
            disabled={sortingProps.active}
            style={{
              width: 50,
            }}
            onChange={(e) =>
              dispatch({
                type: "SET_GRID_PROPS",
                payload: { ...state.gridProps, rows: e.target.value },
              })
            }
          />{" "}
          Cols:{" "}
          <input
            type="number"
            id="grid-cols"
            name="grid-cols"
            value={gridProps.cols}
            max={60}
            disabled={sortingProps.active}
            style={{
              width: 50,
            }}
            onChange={(e) =>
              dispatch({
                type: "SET_GRID_PROPS",
                payload: { ...state.gridProps, cols: e.target.value },
              })
            }
          />
          <br />
          <label htmlFor="weighted">Weighted Grid: </label>
          <input
            type="checkbox"
            id="weighted"
            name="weighted"
            value="weighted"
            checked={gridProps.weighted}
            onClick={onWeightedToggle}
            disabled={sortingProps.active}
          />
          {gridProps.weighted && (
            <>
              <br />
              <button
                className="generate-random-weights-btn"
                onClick={generateRandomWeightedGraph}
                disabled={sortingProps.active}
              >
                Generate Random Weights
              </button>
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <div
      className="settings"
      ref={settingsDiv}
      //onDragStart={(e) => e.preventDefault()}
      onMouseUp={(e) => {
        setDragging({
          ...dragging,
          active: false,
          initialX: dragging.currentX,
          initialY: dragging.currentY,
        });
      }}
      onMouseLeave={(e) => {
        setDragging({
          ...dragging,
          active: false,
          initialX: dragging.currentX,
          initialY: dragging.currentY,
        });
      }}
      onMouseDown={(e) => {
        setDragging({
          ...dragging,
          active: true,
          offsetX: e.clientX - dragging.initialX,
          offsetY: e.clientY - dragging.initialY,
        });
      }}
      onMouseMove={drag}
    >
      <h1 className="settings-header">Pathfinding Visualizer</h1>
      <div className="settings-options">
        {accordions.map((accordion) => (
          <Accordion header={accordion.header} body={accordion.body} />
        ))}
      </div>
      <div>
        <button className="visualizer-btn" onClick={performSearch}>
          Visualize
        </button>
        <button className="soft-reset-btn" onClick={softReset}>
          Soft Reset
        </button>
        <button className="reset-btn" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default Settings;
