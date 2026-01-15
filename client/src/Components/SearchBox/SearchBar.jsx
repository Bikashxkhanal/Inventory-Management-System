import { useRef, useState, useEffect } from "react";
import { searchImg } from "../../assets/Imagesender";

const SearchBar = ({ text, className = "" }) => {
  const searchBarRef = useRef(null);
  const [show, setShow] = useState(false);

  // focus AFTER input becomes visible
  useEffect(() => {
    if (show) {
      searchBarRef.current.focus();
    }
  }, [show]);

  return (
    <div className="flex items-center gap-2">
      <img
        src={searchImg}
        className="size-7 cursor-pointer"
        onClick={() => setShow((prev) => !prev)}
        alt="search"
      />

      <input
        ref={searchBarRef}
        type="text"
        placeholder={text}
        className={`
          border-0
          border-b border-gray-400
          bg-transparent
          px-2 py-1
          outline-none
          focus:outline-none
          focus:border-gray-700
          transition-all duration-200
          ${show ? "w-48 opacity-100" : "w-0 opacity-0"}
          ${className}
        `}
      />
    </div>
  );
};

export default SearchBar;
