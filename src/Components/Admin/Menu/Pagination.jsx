
// import React from "react";

// const Pagination = ({ currentPage, setCurrentPage, totalPages, totalItems, perPage }) => {
//   const start = (currentPage - 1) * perPage + 1;
//   const end = Math.min(currentPage * perPage, totalItems);

//   // Generate page numbers (max 5 visible at once)
//   const getPageNumbers = () => {
//     const pages = [];
//     const maxVisible = 5;
//     let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
//     let endPage = startPage + maxVisible - 1;

//     if (endPage > totalPages) {
//       endPage = totalPages;
//       startPage = Math.max(1, endPage - maxVisible + 1);
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(i);
//     }
//     return pages;
//   };

//   const pageNumbers = getPageNumbers();

//   return (
//     <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
//       <div>
//         Showing {totalItems === 0 ? 0 : start} to {end} of {totalItems} entries
//       </div>
//       <div className="flex gap-1">
//         {/* Prev Button */}
//         <button
//           onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//           disabled={currentPage === 1}
//           className="px-3 py-1 border rounded disabled:opacity-50"
//         >
//           Prev
//         </button>

//         {/* Page Numbers */}
//         {pageNumbers.map((page) => (
//           <button
//             key={page}
//             onClick={() => setCurrentPage(page)}
//             className={`px-3 py-1 border rounded ${
//               currentPage === page ? "bg-gray-300 font-bold" : ""
//             }`}
//           >
//             {page}
//           </button>
//         ))}

//         {/* Next Button */}
//         <button
//           onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//           disabled={currentPage >= totalPages} // <-- FIX IS HERE
//           className="px-3 py-1 border rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Pagination;

import React, { useMemo } from 'react';

const Pagination = ({ currentPage, setCurrentPage, totalPages, totalItems, perPage }) => {
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1;
    const endItem = Math.min(currentPage * perPage, totalItems);

    const pageNumbers = useMemo(() => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const visiblePages = [];
        const pageWindow = 2; 

        visiblePages.push(1);

        let start = Math.max(2, currentPage - pageWindow);
        let end = Math.min(totalPages - 1, currentPage + pageWindow);
        
        if (start > 2) {
            visiblePages.push('...');
        }
        
        if (currentPage - pageWindow < 2) {
            end = Math.min(totalPages - 1, start + (pageWindow * 2));
        }

        if (currentPage + pageWindow > totalPages - 1) {
            start = Math.max(2, end - (pageWindow * 2));
        }

        for (let i = start; i <= end; i++) {
            visiblePages.push(i);
        }

        if (end < totalPages - 1) {
            visiblePages.push('...');
        }

        visiblePages.push(totalPages);

        return visiblePages;
    }, [currentPage, totalPages]);

    return (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <div>
                Showing {startItem} to {endItem} of {totalItems} entries
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                    Prev
                </button>

                {pageNumbers.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-400">
                                ...
                            </span>
                        );
                    }
                    return (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 border rounded hover:bg-gray-100 ${currentPage === page ? "bg-gray-300 font-bold" : ""}`}
                        >
                            {page}
                        </button>
                    );
                })}

                <button
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;