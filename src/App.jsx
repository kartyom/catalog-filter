import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useMemo, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import useInfiniteScroll from "./hooks/useInfiniteScroll";
import { findItems, LIMIT } from "./rpc";
import clsx from "clsx";
import { Rating } from "./Rating";
import { useController } from "./controller";
import { AppContext } from "./hooks/useAppContext";

function sortItems(items, ratingSort, priceSort) {
  let sortedItems = items ? [...items] : [];

  if (ratingSort === "as lowest") {
    sortedItems.sort((a, b) => a.rating - b.rating);
  } else if (ratingSort === "as highest") {
    sortedItems.sort((a, b) => b.rating - a.rating);
  }

  if (priceSort === "as lowest") {
    sortedItems.sort((a, b) => a.price - b.price);
  } else if (priceSort === "as highest") {
    sortedItems.sort((a, b) => b.price - a.price);
  }

  return sortedItems;
}

function App() {
  const controller = useController();
  /** @type {React.RefObject<HTMLDivElement>} */
  const lastRowRef = useRef(null);
  /** @type {React.RefObject<HTMLDivElement>} */
  const scrollableParent = useRef(null);

  const { isClosed, debouncedQuery, filters, ratingSort, priceSort } =
    controller;

  const content = useInfiniteQuery({
    queryKey: ["products-data", debouncedQuery, filters],
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

  const sortedProducts = useMemo(() => {
    if (!content?.data) {
      return;
    }
    const allProducts = content.data.pages?.flatMap((page) => page);

    return sortItems(allProducts, ratingSort, priceSort);
  }, [content?.data, ratingSort, priceSort]);

  return (
    <AppContext.Provider value={controller}>
      <div className="w-screen h-screen bg-gray-50">
        <Header />
        <Sidebar />

        <div
          data-testid="product-area"
          className={clsx(
            isClosed
              ? "desktop:w-full"
              : "desktop:ml-[240px] desktop:w-[calc(100%-240px)]",
            "flex max-h-full w-full pt-[58px] tablet:pt-[70px]",
            "no-scrollbar transition-all duration-[170ms] ease-in-out",
          )}
        >
          {content?.isLoading && (
            <div
              data-testid="loading-indicator"
              className={clsx(
                "flex w-full gap-[2px] tablet:gap-1",
                "items-center justify-center mt-[100px]",
              )}
            >
              <div
                className={clsx(
                  "h-[14px] w-[14px] animate-loading rounded-full bg-gray-400",
                  "[animation-delay:0.1s] tablet:h-[16px] tablet:w-[16px]",
                )}
              />
              <div
                className={clsx(
                  "h-[14px] w-[14px] animate-loading rounded-full bg-gray-400",
                  "[animation-delay:0.2s] tablet:h-[16px] tablet:w-[16px]",
                )}
              />
              <div
                className={clsx(
                  "h-[14px] w-[14px] animate-loading rounded-full bg-gray-400",
                  "[animation-delay:0.3s] tablet:h-[16px] tablet:w-[16px]",
                )}
              />
            </div>
          )}
          {content?.isError && <div>Cant fatch data</div>}
          {content?.data && (
            <div
              ref={scrollableParent}
              className={clsx(
                "w-full overflow-y-scroll flex flex-col",
                "gap-[20px] py-[20px] px-[16px] tablet:grid tablet:grid-cols-2",
                "desktop:grid-cols-3 max-h-min",
              )}
            >
              {sortedProducts.length === 0 ? (
                <span
                  key="no-products"
                  data-testid="no-products"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2"
                >
                  No products found
                </span>
              ) : (
                sortedProducts.map((item) => (
                  <div
                    key={item.id}
                    data-testid="product-item"
                    className={clsx(
                      "bg-gray-200 w-full rounded-md flex",
                      "p-[8px] flex-col desktop:h-[94px]",
                    )}
                  >
                    <div className="flex gap-[10px]">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-[30px] h-[30px] rounded-full object-cover"
                      />
                      <div className="flex flex-1 justify-between items-center gap-4">
                        <span>{item.name}</span>
                        <span>{item.price}$</span>
                      </div>
                    </div>
                    <Rating rate={item.rating} />
                    <div className="flex items-center justify-between w-full">
                      <span>Brand: {item.brand}</span>
                      <span data-testid="product-category">
                        Category: {item.category}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={lastRowRef} />
            </div>
          )}
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
