import PropTypes from "prop-types";
import { useState } from "react";

const SliderProps = {
  name: PropTypes.string,
  initialValue: PropTypes.number,
  setValue: PropTypes.func,
  percent: PropTypes.number,
};

export function Slider(props) {
  const { name, initialValue, setValue, percent } = props;
  const [selected, setSelected] = useState(initialValue);

  return (
    <div className="w-full flex flex-col gap-1">
      <div className="flex w-full items-center justify-between">
        <span className="font-500 text-[16px]">{name}</span>
        <span className="font-500 text-[16px]">{selected}</span>
      </div>
      <div className="flex flex-col">
        <input
          type="range"
          value={selected * percent}
          className="w-full cursor-grab active:cursor-grabbing"
          onChange={(e) => {
            const value = parseInt(e.currentTarget.value) / percent;
            setValue(value);
            setSelected(value);
          }}
        />
      </div>
    </div>
  );
}

Slider.propTypes = SliderProps;
