import { useEffect, useMemo, useState } from "react";
import { useDebouncer } from "./useDebouncer";

/**
 * @template T
 * @param {string} key
 * @param {T} initialValue
 * @return {[T, React.Dispatch<React.SetStateAction<T>>]}
 */
export function useLocalStorage(key, initialValue) {
  const localValue = useMemo(getStoredValue, [initialValue, key]);
  const [storedValue, setStoredValue] = useState(localValue);
  const deboucedValue = useDebouncer(storedValue, 500);

  /** @return {T} */
  function getStoredValue() {
    try {
      const item = localStorage.getItem(key);

      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  }

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(deboucedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, deboucedValue]);

  return [storedValue, setStoredValue];
}
