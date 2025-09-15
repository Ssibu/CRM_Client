// import React, { useState, useMemo } from 'react';
// import { FaFilePdf, FaFileWord, FaFileImage, FaFileAlt, FaFileExcel } from 'react-icons/fa';
// import MenuTable from "../../Components/User/Menu/MenuTable"; // Assuming this is a generic table component
// import { useServerSideTable } from '../../hooks/useServerSideTable';
// import { useGlobalTranslation } from '../../hooks/useGlobalTranslation';

// // 1. --- CHANGE THE API URL ---
// // The base URL now points to your policies API endpoint.
// const API_URL_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/user/policies`;// CORRECTED URL

// // 2. --- RENAME THE COMPONENT ---
// const Policy = () => { // Renamed from NewsAndEvent

//   const { translate, language } = useGlobalTranslation();

//   // 3. --- REMOVE THE DATE FILTERS ---
//   // The 'policies' table does not have a date filter like 'eventDate'.
//   // So, we can remove the state and handlers for it.
//   // DELETE the fromDate, toDate, handleSearch, and handleReset logic.

//   // 4. --- SIMPLIFY THE API URL ---
//   // Since there are no filters, the URL is now static.
//   const { data, tableState } = useServerSideTable(API_URL_BASE);

//   // 5. --- UPDATE THE TABLE COLUMNS ---
//   // This is the most important change. We adapt the columns for the Policy model.
//   const columns = useMemo(() => [
//     {
//       header: translate("serialNumber"),
//       cell: ({ index }) => (tableState.currentPage - 1) * tableState.entriesPerPage + index + 1,
//     },
//     // The accessor now correctly points to the bilingual title fields of the Policy model.
//     { header: translate("title"), accessor: `${language === 'en' ? 'en_title' : 'od_title'}`, isSearchable: true, isSortable: true },
//     {
//       header: translate("document"),
//       accessor: "document",
//       cell: ({ row }) => {
//         const filename = row.original.document;
//         if (!filename) {
//           return <span className="text-gray-400 italic text-xs">{translate("noDocument")}</span>;
//         }
//         // The upload path must be corrected for policies.
//         const fileUrl = `${import.meta.env.VITE_API_BASE_URL}/uploads/policies/${filename}`; // CORRECTED PATH
//         const extension = filename.split('.').pop().toLowerCase();
//         const getIcon = () => {
//           if (['pdf'].includes(extension)) return <FaFilePdf className="text-red-500" size={24} />;
//           if (['doc', 'docx'].includes(extension)) return <FaFileWord className="text-blue-500" size={24} />;
//           if (['xls', 'xlsx'].includes(extension)) return <FaFileExcel className="text-green-700" size={24} />;
//           if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return <FaFileImage className="text-green-500" size={24} />;
//           return <FaFileAlt className="text-gray-500" size={24} />;
//         };
//         return (
//           <a href={fileUrl} target="_blank" rel="noopener noreferrer" title={filename} className="cursor-pointer">
//             {getIcon()}
//           </a>
//         );
//       },
//     },
//   ], [tableState.currentPage, tableState.entriesPerPage, translate, language]); // Add 'language' to the dependency array

//   return (
//     <div className="p-4 sm:p-6 lg:p-8 font-sans bg-white min-h-screen container mx-auto">
//       <style>
//         {`
//           .custom-table-header-color th {
//             background-color: #6f5492 !important;
//             color: white !important;
//           }
//         `}
//       </style>
      
//       {/* 6. --- REMOVE THE DATE FILTER SECTION FROM THE JSX --- */}
//       {/* Delete the entire div that contains the fromDate, toDate, Search, and Reset inputs/buttons. */}

//       {/* 7. --- UPDATE THE TABLE COMPONENT PROPS --- */}
//       <MenuTable 
//         Ltext={translate("policyList")}  // Change the title
//         data={data}
//         columns={columns}
//         tableState={tableState}
//         headerClassName="bg-purple-700 text-white"
//       />
//     </div>
//   );
// };

// export default Policy; // Renamed export

import React, { useState, useMemo } from 'react';
import {
  FaFilePdf,
  FaFileWord,
  FaFileImage,
  FaFileAlt,
  FaFileExcel
} from 'react-icons/fa';
import MenuTable from "../../Components/User/Menu/MenuTable";
import { useServerSideTable } from '../../hooks/useServerSideTable';
import { useGlobalTranslation } from '../../hooks/useGlobalTranslation';

const API_URL_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/user/policies`;

const Policy = () => {
  const { translate, language } = useGlobalTranslation();

  const { data, tableState } = useServerSideTable(API_URL_BASE);

  // ✅ Helper: Check if the policy is added in the last 7 days
  const isNewPolicy = (createdAt) => {
    if (!createdAt) return false;
    const policyDate = new Date(createdAt);
    const today = new Date();
    const diffTime = today - policyDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  const columns = useMemo(() => [
    {
      header: translate("serialNumber"),
      cell: ({ index }) =>
        (tableState.currentPage - 1) * tableState.entriesPerPage + index + 1,
    },
    {
      header: translate("title"),
      accessor: language === 'en' ? 'en_title' : 'od_title',
      isSearchable: true,
      isSortable: true,
      cell: ({ row }) => {
        const title = row.original[language === 'en' ? 'en_title' : 'od_title'];
        const createdAt = row.original.created_at; // Assuming 'createdAt' exists
        return (
          <div className="flex items-center gap-2">
            <span>{title}</span>
            {isNewPolicy(createdAt) && (
              <img
                src="https://mtpl.work/dph/assets/user/images/gif-new.gif"
                alt="New"
                className="w-8"
              />
            )}
          </div>
        );
      }
    },
    {
      header: translate("document"),
      accessor: "document",
      cell: ({ row }) => {
        const filename = row.original.document;
        if (!filename) {
          return <span className="text-gray-400 italic text-xs">{translate("noDocument")}</span>;
        }

        const fileUrl = `${import.meta.env.VITE_API_BASE_URL}/uploads/policies/${filename}`;
        const extension = filename.split('.').pop().toLowerCase();

        const getIcon = () => {
          if (['pdf'].includes(extension)) return <FaFilePdf className="text-red-500" size={24} />;
          if (['doc', 'docx'].includes(extension)) return <FaFileWord className="text-blue-500" size={24} />;
          if (['xls', 'xlsx'].includes(extension)) return <FaFileExcel className="text-green-700" size={24} />;
          if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return <FaFileImage className="text-green-500" size={24} />;
          return <FaFileAlt className="text-gray-500" size={24} />;
        };

        return (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={filename}
            className="cursor-pointer"
          >
            {getIcon()}
          </a>
        );
      }
    },
  ], [tableState.currentPage, tableState.entriesPerPage, translate, language]);

  return (
    <div className="p-6 min-h-screen">
      <style>
        {`
          .custom-table-header-color th {
            background-color: #6f5492 !important;
            color: white !important;
          }
        `}
      </style>

      <MenuTable
        Ltext={translate("policyList")}
        data={data}
        columns={columns}
        tableState={tableState}
        headerClassName="custom-table-header-color"
      />
    </div>
  );
};

export default Policy;
