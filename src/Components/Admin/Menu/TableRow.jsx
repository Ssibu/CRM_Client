
import React, { useEffect, useState } from "react";

const TableRow = ({
  item,
  columns,
  idx,
  pageContext,
  highlightMatch,
  searchTerm,
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), idx * 50); 
    return () => clearTimeout(timer);
  }, [idx]);

  return (
    <tr
      className={`border-b border-gray-300 hover:bg-gray-50 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      {columns.map((column, colIndex) => (
        <td key={colIndex} className="p-2">
          {column.cell
            ? column.cell({
                row: { original: item },
                ...pageContext, 
              })
            : highlightMatch(item[column.accessor], searchTerm)}
        </td>
      ))}
    </tr>
  );
};

export default TableRow;
