import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";

const DropdownProps = {
  data: PropTypes.array,
};

export function Dropdown(props) {
  const { data } = props;
  const [selected, setSelected] = useState(data[0]);
  const [focus, setFocus] = useState(false);

  return (
    <div className={clsx("relative z-10 w-full")}>
      <button
        onClick={() => setFocus((o) => !o)}
        className={clsx(
          "flex items-center border border-gray-300",
          "w-full p-[8px] rounded-md justify-between",
        )}
      >
        <span>{selected}</span>
        <ChevronDown
          className={clsx(focus && "rotate-180", "transition-all duration-200")}
        />
      </button>

      <div
        className={clsx(
          focus ? "flex" : "hidden",
          "absolute flex-col gap-1 rounded-md",
          "bg-gray-400 flex w-full z-20",
        )}
      >
        {data.map((item, index) => (
          <span key={index} className="container">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

Dropdown.propTypes = DropdownProps;
