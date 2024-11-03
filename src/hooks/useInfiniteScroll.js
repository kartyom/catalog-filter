import { useCallback } from "react";
import { useEffect } from "react";

/**@import { UseInfiniteQueryResult } from "react-query"*/

/**
 *@param {UseInfiniteQueryResult} query
 *@param {React.RefObject<HTMLDivElement>} container
 *@param { HTMLElement | null} parent
 */
const useInfiniteScroll = (
  query,
  container,
  offset = 0,
  enabled = true,
  parent = null,
) => {
  const scrollHandler = useCallback(() => {
    if (!enabled) return;

    const elem = container.current;
    if (!elem) {
      return;
    }

    const { y, height } = elem.getBoundingClientRect();
    const bottom = y + height;

    if (bottom > window.innerHeight + offset) {
      return;
    }
    if (!query.hasNextPage) {
      return;
    }
    if (query.isFetchingNextPage) {
      return;
    }

    query.fetchNextPage().catch(console.error);
  }, [offset, container, query, enabled]);

  useScrollListener(scrollHandler, parent);
};

/**
 * @param {() => void} handler
 * @param {HTMLElement | null} parent
 */
const useScrollListener = (handler, parent = null) => {
  useEffect(() => {
    const element = parent ?? document;
    element.addEventListener("scroll", handler);
    handler();
    return () => element.removeEventListener("scroll", handler);
  }, [handler, parent]);
};

export default useInfiniteScroll;
