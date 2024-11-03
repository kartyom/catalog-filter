import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useRef } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useInfiniteQuery } from "react-query";
import useInfiniteScroll from "./hooks/useInfiniteScroll";
import { findItems, LIMIT } from "./rpc";
import clsx from "clsx";
import { Rating } from "./Rating";
import { useController } from "./controller";
import { AppContext } from "./hooks/useAppContext";

const CATALOG_DATA_KEY = "catalog-search-history";
const CATALOG_FILTERS_KEY = "catalog-filters-history";
/** @import {Filters} from "./rpc" */
/** @param { Filters } initialFilter */
const initialFilter = {
  rating: null,
  price: null,
  category: null,
  brand: null,
};

/** @type {string[]} */
const initialSearches = [];

function App() {
  const controller = useController();
  /** @type {React.RefObject<HTMLDivElement>} */
  const lastRowRef = useRef(null);
  /** @type {React.RefObject<HTMLDivElement>} */
  const scrollableParent = useRef(null);

  const { isClosed, debouncedQuery, closeSidebar } = controller;
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

  const content = useInfiniteQuery({
    queryKey: ["content", debouncedQuery],
    queryFn: ({ pageParam: offset }) =>
      findItems(debouncedQuery, filters, offset ?? 0),
    getNextPageParam: nextPageParamGetter(LIMIT),
    staleTime: 5 * 1000,
  });

  function nextPageParamGetter(limit) {
    return function (last, all) {
      const offset = all.reduce((acc, curr) => acc + curr.length, 0);

      const hasLoadedSomething = all.length > 1;

      if (last.length === 0) {
        if (hasLoadedSomething) {
          return undefined;
        }
      }

      if (limit) {
        if (last.length < limit) {
          return undefined;
        }
      }

      return offset;
    };
  }

  useInfiniteScroll(content, lastRowRef, 100, true, scrollableParent.current);

  return (
    <AppContext.Provider value={controller}>
      <div className="w-screen h-screen bg-gray-50">
        <Header
          closeSidebar={closeSidebar}
          storedSearches={storedSearches}
          addNewSearch={addNewSearch}
        />
        <Sidebar
          isClosed={isClosed}
          closeSidebar={closeSidebar}
          filters={filters}
        />

        <div
          className={clsx(
            isClosed
              ? "desktop:w-full"
              : "desktop:ml-[240px] desktop:w-[calc(100%-240px)]",
            "flex h-full w-full pt-[58px] tablet:pt-[70px]",
            "no-scrollbar transition-all duration-[170ms] ease-in-out",
          )}
        >
          {content.isLoading && <div>Loading...</div>}
          {content.isError && <div>Cant fatch data</div>}
          <div
            ref={scrollableParent}
            className={clsx(
              "w-full h-full overflow-y-scroll flex flex-col",
              "gap-[20px] py-[20px] px-[16px]",
            )}
          >
            {content.data &&
              content.data.pages.flatMap((page) =>
                page.map((item) => (
                  <div
                    key={item.id}
                    className={clsx(
                      "bg-gray-200 w-full h-[230px] rounded-md flex",
                      "p-[8px] flex-col",
                    )}
                  >
                    <div className="flex gap-[10px]">
                      <img
                        src={item.imageUrl}
                        className="w-[30px] h-[30px] rounded-full object-cover"
                      />
                      {item.name}
                    </div>
                    <Rating rate={item.rating} />
                    name category brand price rating imageUrl
                  </div>
                )),
              )}
            <div ref={lastRowRef} />
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
