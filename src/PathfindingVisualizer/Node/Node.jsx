import { useState } from "react";
import "./Node.css";
import clsx from "classnames";

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

  const { onMouseDown, onMouseEnter, onMouseUp } = props;

  const classes = clsx({
    node: true,
    "node-visited": visited,
    "node-optimal": optimal,
    "node-wall": wall,
    "node-start": isStart,
    "node-finish": isEnd,
  });

  return (
    <div
      className={classes}
      /* onMouseDown={() => onMouseDown()}
      onMouseUp={() => onMouseUp()}
      onMouseEnter={() => onMouseEnter()} */
    />
  );
};

export default Node;
