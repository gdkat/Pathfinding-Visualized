import { genNodeGrid } from "../PathfindingVisualizer/NodeGrid/gridHelper";

const initialGridProps = {
  rows: 20,
  cols: 50,
  start: {
    row: 10,
    col: 25,
  },
  end: {
    row: 10,
    col: 35,
  },
};

export const initialState = {
  gridProps: initialGridProps,
  grid: genNodeGrid(initialGridProps),
  visitedArr: [],
  sortingProps: {
    type: "dijkstra",
    speed: 10,
    active: false,
  },
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_GRID_PROPS":
      return { ...state, gridProps: action.payload };
    case "SET_GRID":
      return { ...state, grid: action.payload };
    case "SET_VISITED_ARR":
      return { ...state, visitedArr: action.payload };
    case "SET_SORTING_PROPS":
      return {
        ...state,
        sortingProps: {
          ...state.sortingProps,
          ...action.payload,
        },
      };
    case "SET_SORTING_SPEED":
      return {
        ...state,
        sortingProps: {
          ...state.sortingProps,
          speed: action.payload,
        },
      };
    case "SET_SORTING_TYPE":
      return {
        ...state,
        sortingProps: {
          ...state.sortingProps,
          type: action.payload,
        },
      };
    case "SET_SORTING_ACTIVE":
      return {
        ...state,
        sortingProps: {
          ...state.sortingProps,
          active: true,
        },
      };
    case "SET_SORTING_INACTIVE":
      return {
        ...state,
        sortingProps: {
          ...state.sortingProps,
          active: false,
        },
      };

    default:
      return state;
  }
};
