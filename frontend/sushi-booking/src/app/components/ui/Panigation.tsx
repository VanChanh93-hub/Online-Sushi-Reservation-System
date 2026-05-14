"use client";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const createPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const handleClick = (page: number | string) => {
    if (typeof page === "number" && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-between mt-4 text-sm text-gray-700">
      <div>
        Hiển thị {(currentPage - 1) * itemsPerPage + 1}-
        {Math.min(currentPage * itemsPerPage, totalItems)} của {totalItems}
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          className="px-2 py-1 border rounded disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Trước
        </button>

        {createPageNumbers().map((page, index) => (
          <button
            key={index}
            disabled={page === "..."}
            onClick={() => handleClick(page)}
            className={`px-2 py-1 border rounded ${
              page === currentPage
                ? "bg-[#815B5B] text-white"
                : "hover:bg-gray-100"
            } ${page === "..." ? "cursor-default text-gray-500" : ""}`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() =>
            currentPage < totalPages && onPageChange(currentPage + 1)
          }
          className="px-2 py-1 border rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Tiếp
        </button>
      </div>
    </div>
  );
};

export default Pagination;
