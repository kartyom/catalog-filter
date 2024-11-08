import clsx from "clsx";
import { Menu, Search } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { useShortCut } from "./hooks/useShortCut";
import { AppContext } from "./hooks/useAppContext";

export function Header() {
  const controller = useContext(AppContext);
  if (!controller) {
    throw new Error("Missing DashboardContext.Provider in the tree");
  }

  const {
    isClosed,
    query,
    setQueryValue,
    storedSearches,
    addNewSearch,
    closeSidebar,
  } = controller;

  const [inputFocus, setInputFocus] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const target = e.target;
      if (target instanceof HTMLElement) {
        if (
          target.className.includes("stock-input") ||
          target.className.includes("searches-container")
        ) {
          setInputFocus(true);
        } else {
          setInputFocus(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useShortCut({
    shortCut: "Enter",
    handler: () => {
      if (query !== "") {
        addNewSearch(query);
      }
    },
    disabled: !inputFocus,
  });

  return (
    <>
      <div
        data-testid="header"
        className={clsx(
          isClosed
            ? "desktop:left-[0px] desktop:w-screen"
            : "desktop:left-[240px] desktop:w-[calc(100%-240px)]",
          "fixed z-[99] bg-gray-100 py-[6px]",
          "pl-2 pr-4 tablet:px-5 desktop:pl-6 desktop:pr-[30px]",
          "flex h-[58px] items-center justify-between border-b-2 tablet:h-[70px]",
          "w-full border-gray-200 transition-all desktop:justify-normal",
          "duration-[170ms] ease-in-out desktop:gap-[60px]",
        )}
      >
        <div className="relative">
          <button
            onClick={(e) => {
              e.preventDefault();
              closeSidebar();
            }}
            className={clsx(
              "peer rounded-[6px] outline-none transition-all",
              "hover:bg-gray-200 text-gray-700 p-[8px]",
            )}
          >
            <Menu />
          </button>
          <div
            className={clsx(
              "left-[-18px] absolute opacity-0 transition-opacity",
              "tablet:peer-hover:opacity-100 pointer-events-none",
              "top-[54px] z-50 select-none",
            )}
          >
            <div
              className={clsx(
                "relative h-[31px] w-[80px] rounded-[8px] bg-gray-500",
                "flex items-center justify-center gap-[4px]",
              )}
            >
              <span className="text-[13px] font-400 tracking-[0.4px] text-white">
                {isClosed ? "open" : "close"}
              </span>
              <div
                className={clsx(
                  "h-[10px] w-[10px] bg-gray-500",
                  "absolute left-1/2 z-[-1] rotate-45 rounded-[2px]",
                  "top-[-4px] -translate-x-1/2",
                )}
              />
            </div>
          </div>
        </div>

        <div className="relative flex flex-col gap-[10px]">
          <div
            className={clsx(
              inputFocus ? "border-gray-400" : "border-gray-300",
              "relative flex w-full gap-[4px] bg-gray-200 pl-[14px]",
              "h-[44px] rounded-[6px] border pr-[54px] tablet:max-w-[437px]",
              "tablet:w-[440px] desktop:w-[520px] desktop:pl-[44px] desktop:pr-[14px]",
              "stock-input",
            )}
          >
            <input
              placeholder="Search"
              value={query}
              onChange={(e) => {
                const inputValue = e.currentTarget.value;
                if (inputValue.length <= 1000) {
                  setQueryValue(inputValue);
                }
              }}
              className={clsx(
                "text-[17px] font-400 placeholder:text-gray-600",
                "w-full bg-gray-200 outline-none stock-input",
              )}
            />
            <button
              onClick={() => {
                if (query !== "") {
                  addNewSearch(query);
                }
              }}
              className={clsx(
                "absolute right-[14px] top-1/2 -translate-y-1/2 cursor-default",
                "text-gray-600 desktop:left-[14px] desktop:right-auto",
                "stock-input",
              )}
            >
              <Search />
            </button>
          </div>

          {storedSearches && storedSearches.length !== 0 && (
            <div
              className={clsx(
                inputFocus ? "flex" : "hidden",
                "absolute left-0 top-[54px] flex-col rounded-[8px]",
                "gap-[2px] py-[12px]",
                "no-scrollbar max-h-[254px] w-full overflow-y-scroll",
                "searches-container z-40 bg-gray-300",
              )}
            >
              <span
                className={clsx(
                  "ml-[16px] text-[15px] font-500 leading-[20px] text-gray-600",
                  "searches-container",
                )}
              >
                Search history
              </span>
              <div className="searches-container flex flex-col">
                {storedSearches.map((s, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQueryValue(s);
                      setInputFocus(false);
                    }}
                    className={clsx(
                      "h-[40px] w-full px-[16px] hover:bg-gray-300",
                      "searches-container flex items-center",
                    )}
                  >
                    <span
                      className={clsx(
                        "text-[15px] font-400 leading-[20px] text-gray-500",
                        "searches-container",
                      )}
                    >
                      {s}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
