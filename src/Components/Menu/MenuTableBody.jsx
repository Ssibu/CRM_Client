// components/MenuTable/MenuTableBody.jsx
import React from "react";
import SkeletonRow from "./SkeletonRow";
import TableRow from "./TableRow";

const MenuTableBody = ({
  loading,
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
          <th className="p-2">SL.No</th>
          <th className="p-2">Menu (In English)</th>
          <th className="p-2">Menu (In Odia)</th>
          <th className="p-2">Image</th>
          <th className="p-2">Status</th>
          <th className="p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {loading
          ? Array.from({ length: entriesPerPage }).map((_, idx) => (
              <SkeletonRow key={idx} />
            ))
          : data.map((item, idx) => (
              <TableRow
                key={item.id}
                item={item}
                idx={idx}
                currentPage={currentPage}
                entriesPerPage={entriesPerPage}
                highlightMatch={highlightMatch}
                searchTerm={searchTerm}
              />
            ))}
      </tbody>
    </table>
  );
};

export default MenuTableBody;
