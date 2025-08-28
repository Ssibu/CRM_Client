// import React from "react";

// const SkeletonRow = () => {
//   return (
//     <tr className="animate-pulse border-b">
//       <td className="p-2">
//         <div className="w-6 h-4 bg-gray-200 rounded"></div>
//       </td>
//       <td className="p-2">
//         <div className="w-32 h-4 bg-gray-200 rounded"></div>
//       </td>
//       <td className="p-2">
//         <div className="w-40 h-4 bg-gray-200 rounded"></div>
//       </td>
//       <td className="p-2">
//         <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
//       </td>
//       <td className="p-2">
//         <div className="w-16 h-4 bg-gray-200 rounded"></div>
//       </td>
//       <td className="p-2">
//         <div className="flex space-x-2">
//           <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
//           <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
//         </div>
//       </td>
//     </tr>
//   );
// };

// export default SkeletonRow;



// components/MenuTable/SkeletonRow.jsx
import React from "react";

const SkeletonRow = ({ columns }) => {
  return (
    <tr className="animate-pulse border-b">
      {columns.map((_, index) => (
        <td key={index} className="p-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </td>
      ))}
    </tr>
  );
};

export default SkeletonRow;