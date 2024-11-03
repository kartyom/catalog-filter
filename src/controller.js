import { useReducer } from "react";
import { useDebouncer } from "./hooks/useDebouncer";

const initialState = { isClosed: false, query: "" };

const ACTIONS = {
  CLOSE_SIDEBAR: "close",
  SET_QUERY_VALUE: "setQuery",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.CLOSE_SIDEBAR:
      return {
        ...state,
        isClosed: !state.isClosed,
      };
  }
};

export function useController() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const debouncedQuery = useDebouncer(state.query, 500);

  function closeSidebar() {
    dispatch({ type: ACTIONS.CLOSE_SIDEBAR });
  }

  function setQueryValue(value) {
    dispatch({ type: ACTIONS.SET_QUERY_VALUE, value });
  }

  return {
    isClosed: state.isClosed,
    debouncedQuery,
    setQueryValue,
    closeSidebar,
  };
}
