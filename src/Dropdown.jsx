import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const DropdownProps = {
  data: PropTypes.array,
  select: PropTypes.func,
  initialSelected: PropTypes.string,
  zIndex: PropTypes.number,
  name: PropTypes.string,
  isResetable: PropTypes.bool,
  dataTestId: PropTypes.string,
};

export function Dropdown(props) {
  const {
    name,
    data,
    select,
    initialSelected,
    zIndex,
    isResetable,
    dataTestId,
  } = props;
  const [selected, setSelected] = useState(initialSelected);
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const target = e.target;
      if (target instanceof HTMLElement) {
        if (!target.className.includes(name)) {
          setFocus(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [name]);

  return (
    <div data-testid={dataTestId} className="w-full flex flex-col gap-1">
      <div className="w-full flex items-center justify-between">
        <span className="font-500 text-[16px]">{name}</span>
        {isResetable && (
          <button
			data-testid={`${dataTestId}-option-reset`}
            onClick={() => {
              setSelected(null);
              select(null);
            }}
          >
            <span className="font-300 text-[16px]">Reset</span>
          </button>
        )}
      </div>
      <div className={clsx("relative w-full", name)} style={{ zIndex }}>
        <button
          onClick={() => setFocus((o) => !o)}
          disabled={data.length === 0}
          data-testid={`${dataTestId}-toggle`}
          className={clsx(
            "flex items-center border border-gray-300",
            "w-full p-[8px] rounded-md justify-between",
            name,
          )}
        >
          <span className={name}>
            {selected === null ? "No Selected" : selected}
          </span>
          <ChevronDown
            className={clsx(
              focus && "rotate-180",
              "transition-all duration-200",
              name,
            )}
          />
        </button>

        {data.length !== 0 && (
          <div
            className={clsx(
              focus ? "flex" : "hidden",
              "absolute flex-col rounded-md overflow-y-scroll top-[45px]",
              "bg-gray-100 flex w-full z-50 max-h-[200px] px-2 py-1 no-scrollbar",
              name,
            )}
          >
            {data.map((item, index) => (
              <button
                key={index}
				data-testid={`${dataTestId}-option-${item}`}
                onClick={() => {
                  select(item);
                  setSelected(item);
                }}
                className={clsx(
                  selected === item && "bg-gray-200",
                  "w-full p-1 flex items-start hover:bg-gray-200",
                  "rounded-md",
                  name,
                )}
              >
                <span className={name}>{item}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

Dropdown.propTypes = DropdownProps;
