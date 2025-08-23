
// components/MenuTable/MenuTableBody.jsx
import React from "react";
import SkeletonRow from "./SkeletonRow";
import TableRow from "./TableRow";

const MenuTableBody = ({
  loading,
  columns,
  data,
  entriesPerPage,
  currentPage,
  highlightMatch,
  searchTerm,
}) => {
  return (
    <table className="min-w-full border text-sm">
      <thead>
        <tr className="bg-gray-100 text-left">
          {columns.map((column, index) => (
            <th key={index} className="p-2">
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading
          ? Array.from({ length: entriesPerPage }).map((_, idx) => (
              <SkeletonRow key={idx} columns={columns} />
            ))
          : (Array.isArray(data) && data.map((item, idx) => (
              <TableRow
                key={item.id}
                item={item}
                columns={columns}
                idx={idx}
                currentPage={currentPage}
                entriesPerPage={entriesPerPage}
                highlightMatch={highlightMatch}
                searchTerm={searchTerm}
                 pageContext={{
                    currentPage,
                    entriesPerPage,
                    index: idx,
                }}
              />
            )))}
      </tbody>
    </table>
  );
};

export default MenuTableBody;