import { useState, memo, useEffect, useCallback, useRef } from "react";

const SearchIcon = memo(() => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <circle cx="6.5" cy="6.5" r="5" stroke="#9CA3AF" strokeWidth="1.5" />
    <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
));

const Spinner = memo(() => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="animate-spin">
    <circle cx="8" cy="8" r="6" stroke="#D1D5DB" strokeWidth="1.5" />
    <path d="M8 2a6 6 0 0 1 6 6" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
));


const SearchBar = memo(({
  onSearch,         
  onSelect,   
  isLoading = false, 
  suggestions = [],   
  placeholder = "Search...",
  debounceMs = 400,
  minChars = 1,
  className = ""
}) => {

  console.log(suggestions);
  
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);  // keyboard nav

  const debounceTimer = useRef(null);
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    };
  }, []);

  const debouncedSearch = useCallback((value) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (!value || value.trim().length < minChars) {
      onSearch('');
      setIsOpen(false);
      return;
    }

    debounceTimer.current = setTimeout(() => {
      onSearch(value.trim());   // ← just lifts query up, no fetch here
      setIsOpen(true);
    }, debounceMs);
  }, [onSearch, debounceMs, minChars]);

  const handleChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  }, [debouncedSearch]);


const handleSelect = useCallback((item) => {
  setQuery(item.label);
  setIsOpen(false);
  setActiveIndex(-1);
  onSelect?.(item);
}, [onSelect]);


const handleClear = useCallback(() => {
  setQuery('');
  setIsOpen(false);
  setActiveIndex(-1);
  if (debounceTimer.current) clearTimeout(debounceTimer.current);
  onSelect?.(null);
  onSearch('');
}, [onSelect, onSearch]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }, [isOpen, suggestions, activeIndex, handleSelect]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input Box */}
      <div className={`
        flex items-center gap-2
        border border-gray-300 rounded-md
        px-2.5 py-1.5 bg-white
        hover:border-gray-400
        focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100
        transition-all duration-150
      `}>
        {isLoading ? <Spinner /> : <SearchIcon />}

        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="
            bg-transparent outline-none border-none
            text-xs md:text-sm text-gray-700
            placeholder:text-gray-400
            w-40 md:w-56
          "
        />

        {query && (
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 text-sm leading-none transition-colors"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <ul className="
          absolute z-50 top-full left-0 mt-1
          w-full min-w-max
          bg-white border border-gray-200
          rounded-md shadow-lg
          max-h-52 overflow-y-auto
          py-1
        ">
          {suggestions.length > 0 ? (
            suggestions.map((item, index) => (
              <li
                key={item.value}
                onMouseDown={() => handleSelect(item)}  // mousedown fires before input blur
                className={`
                  px-3 py-2
                  text-xs md:text-sm text-gray-700
                  cursor-pointer select-none
                  transition-colors duration-100
                  ${activeIndex === index
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50'}
                `}
              >
               
                <HighlightMatch text={item.label} query={query} />
              </li>
            ))
          ) : (  
            <li className="px-3 py-2 text-xs text-gray-400 select-none">
              No results found
            </li>
          )}
        </ul>
      )}
    </div>
  );
});

// Highlights the matching substring in suggestion labels
const HighlightMatch = memo(({ text, query }) => {
  if (!query) return <span>{text}</span>;

  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return <span>{text}</span>;

  return (
    <span>
      {text.slice(0, index)}
      <span className="font-semibold text-blue-600">
        {text.slice(index, index + query.length)}
      </span>
      {text.slice(index + query.length)}
    </span>
  );
});

SearchBar.displayName = 'SearchBar';
export default SearchBar;