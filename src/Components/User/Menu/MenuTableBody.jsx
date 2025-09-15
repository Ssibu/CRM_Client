

// import React from "react";
// import SkeletonRow from "./SkeletonRow";
// import TableRow from "./TableRow";

// const MenuTableBody = ({
//   loading,
//   columns,
//   data,
//   entriesPerPage,
//   currentPage,
//   highlightMatch,
//   searchTerm,
// }) => {
//   if (loading) {
//     return (
//       <tbody>
//         {Array.from({ length: entriesPerPage }).map((_, idx) => (
//           <SkeletonRow key={idx} columns={columns} />
//         ))}
//       </tbody>
//     );
//   }

//   if (!data || data.length === 0) {
//     return (
//       <tbody>
//         <tr>
//           <td colSpan={columns.length} className="text-center p-4">
//             No data available.
//           </td>
//         </tr>
//       </tbody>
//     );
//   }

//   return (
//     <tbody>
//       {data.map((item, idx) => (
//         <TableRow
//           key={item.id || idx}
//           item={item}
//           columns={columns}
//           idx={idx} // For framer-motion delay
//           highlightMatch={highlightMatch}
//           searchTerm={searchTerm}
//           pageContext={{
//               currentPage,
//               entriesPerPage,
//               index: idx,
//           }}
//         />
//       ))}
//     </tbody>
//   );
// };

// export default MenuTableBody;


import React from "react";
import TableRow from "./TableRow";
import Spinner from "../UI/Spinner";

const MenuTableBody = ({
  loading,
  columns,
  data,
  entriesPerPage,
  currentPage,
  highlightMatch,
  searchTerm,
}) => {
  if (loading) {
    return (
      <tbody>
        <tr>
          <td colSpan={columns.length} className="p-6 text-center">
            <div className="flex justify-center items-center">
             <Spinner/>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  if (!data || data.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={columns.length} className="text-center p-4">
            No data available.
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {data.map((item, idx) => (
        <TableRow
          key={item.id || idx}
          item={item}
          columns={columns}
          idx={idx} // For framer-motion delay
          highlightMatch={highlightMatch}
          searchTerm={searchTerm}
          pageContext={{
            currentPage,
            entriesPerPage,
            index: idx,
          }}
        />
      ))}
    </tbody>
  );
};

export default MenuTableBody;
