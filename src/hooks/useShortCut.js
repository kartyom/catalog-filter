import { useEffect } from "react";

/**
 * @typedef UseShortCutProps
 * @property {"Enter" | "Escape" | "Delete" | "Backspace"} shortCut
 * @property {() => void} handler
 * @property {boolean | undefined} disabled
 */

/** @param {UseShortCutProps} props */
export function useShortCut(props) {
  const { disabled = false, shortCut, handler } = props;

  useEffect(() => {
    if (disabled) {
      return;
    }

    /** @param {KeyboardEvent} event */
    const handleKeyDown = (event) => {
      if (event.key && event.key.toLowerCase() === shortCut.toLowerCase()) {
        event.preventDefault();
        handler();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handler, shortCut, disabled]);
}
