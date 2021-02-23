import { useContext } from "react";
import "./Node.css";
import clsx from "classnames";
import PathfindingContext from "../../context/PathfindingContext";

const Node = (props) => {
  const {
    row, // row index
    col, // col index
    weight, // weight to travel through
    visited, // visited boolean
    optimal, // is part of optimal path
    wall, // is wall
    prev, // previous node in trail
    distance, // distance from start
    isStart, // isStart
    isEnd, // isFinish
  } = props.nodeProps;

  const [
    {
      mouseDown,
      sortingProps,
      movingStart,
      movingEnd,
      gridProps: { weighted },
    },
    dispatch,
  ] = useContext(PathfindingContext);

  const classes = clsx({
    node: true,
    "node-visited": visited,
    "node-optimal": optimal,
    "node-wall": wall,
    "node-start": isStart,
    "node-end": isEnd,
  });

  const onMouseDown = (e) => {
    e.preventDefault();
    dispatch({ type: "SET_MOUSE_DOWN" });
    if (!sortingProps.active && !sortingProps.complete) {
      if (isStart) dispatch({ type: "MOVING_START" });
      else if (isEnd) dispatch({ type: "MOVING_END" });
      else
        dispatch({
          type: "SET_NODE",
          payload: { ...props.nodeProps, wall: !wall },
        });
    }
  };

  const onMouseUp = (e) => {
    e.preventDefault();
    mouseDown && dispatch({ type: "SET_MOUSE_UP" });
    if (movingStart) dispatch({ type: "SET_START" });
    else if (movingEnd) dispatch({ type: "SET_END" });
  };

  const onMouseEnter = (e) => {
    e.preventDefault();
    if (mouseDown && !sortingProps.active && !sortingProps.complete) {
      if (movingStart)
        dispatch({
          type: "MOVE_START",
          payload: props.nodeProps,
        });
      else if (movingEnd)
        dispatch({
          type: "MOVE_END",
          payload: props.nodeProps,
        });
      else
        !isStart &&
          !isEnd &&
          dispatch({
            type: "SET_NODE",
            payload: { ...props.nodeProps, wall: !wall },
          });
    }
  };

  return (
    <div
      className={classes}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseEnter={onMouseEnter}
    >
      {weighted && !isStart && !isEnd && weight}
    </div>
  );
};

export default Node;
