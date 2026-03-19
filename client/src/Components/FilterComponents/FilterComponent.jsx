import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="2.5" width="14" height="12.5" rx="2" stroke="#374151" strokeWidth="1.4" />
    <line x1="1" y1="6.5" x2="15" y2="6.5" stroke="#374151" strokeWidth="1.4" />
    <line x1="5" y1="1" x2="5" y2="4" stroke="#374151" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="11" y1="1" x2="11" y2="4" stroke="#374151" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="pointer-events-none text-gray-500">
    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Box = ({ children, className = "" }) => (
  <div
    className={`
      flex items-center gap-1.5
      border border-gray-300
      rounded-md
      px-2.5 py-1.5
      bg-white
      hover:border-gray-400
      transition-colors duration-150
      ${className}
    `}
  >
    {children}
  </div>
);

const FilterComponent = ({
  type,
  label,
  options = [],
  onChange,
  dateValue = [null, null],
  catValue,
  className = "",
  onCategoryFieldChange
}) => {
  const [start, end] = dateValue;

  if (type === "date-range") {
    const handleStartChange = (date) => {
      const newEnd = end && date && date > end ? null : end;
      onChange([date, newEnd]);
    };

    const handleEndChange = (date) => {
      onChange([start, date]);
    };

    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Start date */}
        <Box>
          <CalendarIcon />
          <DatePicker
            selected={start}
            onChange={handleStartChange}
            selectsStart
            startDate={start}
            endDate={end}
            placeholderText="Start date"
            onChangeRaw={(e) => e.preventDefault()}
            dateFormat="dd MMM yyyy"
            popperPlacement="bottom-start"
            className="
              w-24 md:w-28
              text-xs md:text-sm
              text-gray-700
              bg-transparent
              outline-none border-none
              cursor-pointer caret-transparent
            "
          />
        </Box>

        <span className="text-gray-400 text-xs select-none">—</span>

        {/* End date */}
        <Box className={!start ? "opacity-50 pointer-events-none" : ""}>
          <CalendarIcon />
          <DatePicker
            selected={end}
            onChange={handleEndChange}
            selectsEnd
            startDate={start}
            endDate={end}
            minDate={start || undefined}
            placeholderText="End date"
            onChangeRaw={(e) => e.preventDefault()}
            disabled={!start}
            dateFormat="dd MMM yyyy"
            popperPlacement="bottom-start"
            className="
              w-24 md:w-28
              text-xs md:text-sm
              text-gray-700
              bg-transparent
              outline-none border-none
              cursor-pointer caret-transparent
            "
          />
        </Box>

        {/* Clear */}
        {(start || end) && (
          <button
            onClick={() => onChange([null, null])}
            className="text-gray-400 hover:text-gray-600 text-sm leading-none transition-colors"
            aria-label="Clear dates"
          >
            ✕
          </button>
        )}
      </div>
    );
  }

  if (type === "category") {
    return (
      <Box className={`relative ${className}`}>
        <select
          value={catValue || ""}
          onChange={(e) => 
            onChange(e.target.value)
          
          }
          
          className="
            appearance-none
            bg-transparent
            outline-none border-none
            text-xs md:text-sm
            text-gray-700
            cursor-pointer
            pr-4
            w-24 md:w-32
          "
        >
          <option value="">{label}</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className="absolute right-2">
          <ChevronIcon />
        </span>
      </Box>
    );
  }

  return null;
};

export default FilterComponent;