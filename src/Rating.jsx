import PropTypes from "prop-types";

const RatingPropTypes = {
  rate: PropTypes.number,
};

export function Rating(props) {
  const fullStars = Math.floor(props.rate);
  const hasHalfStar = props.rate % 1 !== 0;
  const emptyStars = 5 - Math.ceil(props.rate);

  return (
    <div className="flex gap-1 items-center">
      <div className="flex space-x-1">
        {new Array(fullStars).fill(null).map((_, i) => (
          <div
            key={i}
            className="w-6 h-6 text-yellow-500 flex items-center justify-center"
          >
            ★
          </div>
        ))}
        {hasHalfStar && (
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 text-yellow-500 flex items-center justify-center overflow-hidden">
              ★
            </div>
            <div className="absolute right-0 w-3 h-full">
              <div className="relative w-full h-full overflow-hidden">
                <div className="absolute text-gray-300 left-[-8px]">★</div>
              </div>
            </div>
          </div>
        )}
        {new Array(emptyStars).fill(null).map((_, i) => (
          <div
            key={i + fullStars}
            className="w-6 h-6 text-gray-300 flex items-center justify-center"
          >
            ★
          </div>
        ))}
      </div>
      <span>{props.rate}</span>
    </div>
  );
}

Rating.propTypes = RatingPropTypes;
