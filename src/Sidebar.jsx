import clsx from "clsx";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import { useQuery } from "react-query";
import { getAllBrands, getAllCategories } from "./rpc";
import { Dropdown } from "./Dropdown";

const RangeType = PropTypes.shape({
  start: PropTypes.number,
  end: PropTypes.number,
});

const FiltersType = PropTypes.shape({
  category: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  brand: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  rating: RangeType,
  price: RangeType,
});

const SidebarPropTypes = {
  isClosed: PropTypes.bool.isRequired,
  closeSidebar: PropTypes.func.isRequired,
  filters: FiltersType,
};

export function Sidebar(props) {
  const { isClosed, closeSidebar } = props;
  console.log(props.filters);
  const categories = useQuery("categories-data", () => getAllCategories());
  const brands = useQuery("brands-data", () => getAllBrands());

  return (
    <>
      <div
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
              "h-full w-full shrink-0 flex-col px-[12px] tablet:flex",
              "tablet:gap-[44px] group items-start",
            )}
          >
            <div className="w-full flex flex-col">
              <span>Category</span>
              {categories.data && <Dropdown data={categories.data} />}
            </div>

            <div className="w-full flex flex-col">
              <span>Brand</span>
              {brands.data && <Dropdown data={brands.data} />}
            </div>

            <div className="w-full h-[30px]">
              <input type="range" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Sidebar.propTypes = SidebarPropTypes;
