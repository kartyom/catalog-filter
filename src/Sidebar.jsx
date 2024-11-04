import clsx from "clsx";
import { X } from "lucide-react";
import { useQuery } from "react-query";
import { getAllBrands, getAllCategories } from "./rpc";
import { Dropdown } from "./Dropdown";
import { useContext } from "react";
import { AppContext } from "./hooks/useAppContext";
import { Slider } from "./Slider";

export function Sidebar() {
  const controller = useContext(AppContext);
  if (!controller) {
    throw new Error("Missing DashboardContext.Provider in the tree");
  }

  const {
    isClosed,
    filters,
    closeSidebar,
    selectCategory,
    selectBrand,
    selectRating,
    selectPrice,
    changePriceSort,
    changeRatingSort,
    ratingSort,
    priceSort,
  } = controller;

  const categories = useQuery("categories-data", () => getAllCategories());
  const brands = useQuery("brands-data", () => getAllBrands());

  return (
    <>
      <div
        data-testid="sidebar"
        id="dashboard-sidebar-bg"
        className={clsx(
          isClosed ? " pointer-events-none opacity-0" : "opacity-100",
          "fixed left-0 top-0 z-[99] h-full w-full",
          "bg-gray-400/60 transition-opacity desktop:hidden",
        )}
        onClick={(e) => {
          if (e.currentTarget instanceof HTMLElement) {
            if (e.currentTarget.id === "dashboard-sidebar-bg") {
              closeSidebar();
            }
          }
        }}
      />
      <div
        className={clsx(
          "fixed left-0 top-0 z-[100] h-[100svh] w-[80%]",
          "overflow-hidden bg-gray-200 transition-all tablet:w-[240px]",
          isClosed
            ? "-translate-x-full tablet:translate-x-[-240px]"
            : "translate-x-0",
        )}
      >
        <div
          className={clsx(
            "fixed top-3 flex w-full items-center px-[24px]",
            "desktop:top-[6px] justify-between",
          )}
        >
          <span className="font-600 text-[20px] text-gray-700">Filters</span>
          <button
            onClick={closeSidebar}
            className="desktop:hidden text-gray-700"
          >
            <X />
          </button>
        </div>

        <div
          className={clsx(
            "flex h-full shrink-0 flex-row pb-[70px] pt-[100px] transition-all",
            isClosed && "-translate-x-full tablet:-translate-x-[240px]",
          )}
        >
          <div
            className={clsx(
              "h-full w-full shrink-0 flex-col px-[12px] flex",
              "desktop:gap-[44px] gap-[20px] group items-start",
            )}
          >
            <Dropdown
              name="Category"
              dataTestId="category-filter"
              data={categories?.data ?? []}
              initialSelected={filters.category}
              select={selectCategory}
              zIndex={10}
              isResetable={true}
            />

            <Dropdown
              name="Brand"
              data={brands?.data ?? []}
              initialSelected={filters.brand}
              select={selectBrand}
              zIndex={0}
              isResetable={true}
            />

            <Slider
              name="Rating"
              initialValue={filters?.rating ?? 5}
              percent={20}
              setValue={selectRating}
            />

            <Slider
              name="Price"
              initialValue={filters?.price ?? 1000}
              percent={0.1}
              setValue={selectPrice}
            />

            <div className="flex items-center w-full gap-1">
              <Dropdown
                name="Sort by rating"
                data={["lowest", "highest"]}
                initialSelected={ratingSort}
                select={changeRatingSort}
                zIndex={0}
                isResetable={false}
              />
              <Dropdown
                name="Sort by price"
                data={["lowest", "highest"]}
                initialSelected={priceSort}
                select={changePriceSort}
                zIndex={0}
                isResetable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
