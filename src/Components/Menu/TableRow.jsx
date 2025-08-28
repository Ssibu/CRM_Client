

// // components/MenuTable/TableRow.jsx
// import React from "react";
// import { motion } from "framer-motion";

// const TableRow = ({
//   item,
//   columns,
//   idx,
//    pageContext,
//   highlightMatch,
//   searchTerm,
// }) => {
//   return (
//     <motion.tr
//       className="border-b hover:bg-gray-50 transition-all"
//       initial={{ opacity: 0, y: 5 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: idx * 0.05 }}
//     >
//       {columns.map((column, colIndex) => (
//         <td key={colIndex} className="p-2">
//           {column.cell
//             ? column.cell({ row: { original: item }, pageContext  }) 
//             : highlightMatch(item[column.accessor], searchTerm)}
//         </td>
//       ))}
//     </motion.tr>
//   );
// };

// export default TableRow;


import React from "react";
import { motion } from "framer-motion";

const TableRow = ({
  item,
  columns,
  idx,
  pageContext,
  highlightMatch,
  searchTerm,
}) => {
  return (
    <motion.tr
      className="border-b hover:bg-gray-50 transition-all"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
    >
      {columns.map((column, colIndex) => (
        <td key={colIndex} className="p-2">
          {column.cell
            ? column.cell({ 
                row: { original: item }, 
                ...pageContext // <-- THE FIX: Use the spread operator here
              }) 
            : highlightMatch(item[column.accessor], searchTerm)}
        </td>
      ))}
    </motion.tr>
  );
};

export default TableRow;