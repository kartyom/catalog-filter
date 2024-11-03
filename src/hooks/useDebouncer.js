import { useEffect, useState } from "react";

/**
 * @template T
 * @param {T} state
 * @param {number} milliseconds
 */
export function useDebouncer(state, milliseconds) {
  const [debounced, setDebounced] = useState(state);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounced(state);
    }, milliseconds);

    return () => {
      clearTimeout(timeout);
    };
  }, [state, milliseconds]);

  return debounced;
}
