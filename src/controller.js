import { useReducer } from "react";
import { useDebouncer } from "./hooks/useDebouncer";
import { useLocalStorage } from "./hooks/useLocalStorage";

const CATALOG_DATA_KEY = "catalog-search-history";
const CATALOG_FILTERS_KEY = "catalog-filters-history";

const initialState = {
  isClosed: true,
  query: "",
  ratingSort: "lowest",
  priceSort: "highest",
};

/** @import {Filters} from "./rpc" */
/** @type { Filters } */
const initialFilter = {
  rating: null,
  price: null,
  category: null,
  brand: null,
};

/** @type {string[]} */
const initialSearches = [];

const ACTIONS = {
  CLOSE_SIDEBAR: "close",
  SET_QUERY_VALUE: "setQuery",
  SET_RATING_SORT: "setRatingSort",
  SET_PRICE_SORT: "setPriceSort",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.CLOSE_SIDEBAR:
      return {
        ...state,
        isClosed: !state.isClosed,
      };
    case ACTIONS.SET_QUERY_VALUE:
      return {
        ...state,
        query: action.value,
      };
    case ACTIONS.SET_PRICE_SORT:
      return {
        ...state,
        priceSort: action.value,
      };
    case ACTIONS.SET_RATING_SORT:
      return {
        ...state,
        ratingSort: action.value,
      };
  }
};

export function useController() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const debouncedQuery = useDebouncer(state.query, 500);
  const [filters, setFilters] = useLocalStorage(
    CATALOG_FILTERS_KEY,
    initialFilter,
  );
  const [storedSearches, setStoreSearches] = useLocalStorage(
    CATALOG_DATA_KEY,
    initialSearches,
  );

  function addNewSearch(search) {
    setStoreSearches((o) => [search, ...o.slice(0, 9)]);
  }

  function closeSidebar() {
    dispatch({ type: ACTIONS.CLOSE_SIDEBAR });
  }

  function setQueryValue(value) {
    dispatch({ type: ACTIONS.SET_QUERY_VALUE, value });
  }

  function changeRatingSort(value) {
    dispatch({ type: ACTIONS.SET_RATING_SORT, value });
  }

  function changePriceSort(value) {
    dispatch({ type: ACTIONS.SET_PRICE_SORT, value });
  }

  function selectCategory(category) {
    setFilters((o) => ({ ...o, category }));
  }

  function selectBrand(brand) {
    setFilters((o) => ({ ...o, brand }));
  }

  function selectRating(rating) {
    setFilters((o) => ({
      ...o,
      rating,
    }));
  }

  function selectPrice(price) {
    setFilters((o) => ({
      ...o,
      price,
    }));
  }

  return {
    isClosed: state.isClosed,
    query: state.query,
    ratingSort: state.ratingSort,
    priceSort: state.priceSort,
    setQueryValue,
    selectCategory,
    selectBrand,
    selectRating,
    selectPrice,
    filters,
    changePriceSort,
    changeRatingSort,
    addNewSearch,
    storedSearches,
    debouncedQuery,
    closeSidebar,
  };
}
