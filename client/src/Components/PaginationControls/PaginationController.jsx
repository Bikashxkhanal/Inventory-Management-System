// PaginationButton.jsx
import React from "react";

const PaginationController = ({ currentPage, totalPages, onPageChange }) => {
  // Generate array of page numbers
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }


  return (
    <div className="flex justify-center py-2 items-center gap-2 mt-4 bg-graywhite border rounded-xl border-white shadow-4xl">
      {/* Previous Button */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
        
      >
        Prev
      </button>

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${
            page === currentPage
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          value={page}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationController;
