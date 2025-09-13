import React, { useMemo } from 'react';
import { FaFilePdf, FaFileWord, FaFileImage, FaFileAlt, FaFileExcel } from 'react-icons/fa';
import MenuTable from "../../Components/User/Menu/MenuTable"; // Adjust this import path if needed
import { useServerSideTable } from '../../hooks/useServerSideTable';
import { useGlobalTranslation } from '../../hooks/useGlobalTranslation';

// The API URL now points to the public endpoint for Bed Strengths
const API_URL_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/user/bed-strengths`;

const BedStrength = () => {
  const { translate, language } = useGlobalTranslation();
  
  // The server-side table hook fetches data from the new URL
  const { data, tableState } = useServerSideTable(API_URL_BASE);

  // Define the columns for the table, adapted for the BedStrength model
  const columns = useMemo(() => [
           {
      header: "SL.No",
      cell: ({ index }) => (tableState.currentPage - 1) * tableState.entriesPerPage + index + 1,
    },
    { 
      header: translate("title"), 
      accessor: language === 'en' ? 'en_title' : 'od_title', // Dynamically chooses the correct title
      isSearchable: true, 
      isSortable: true 
    },
    {
      header: translate("document"),
      accessor: "document",
      cell: ({ row }) => {
        const filename = row.original.document;
        if (!filename) {
          return <span className="text-gray-400 italic text-xs">{translate("noDocument")}</span>;
        }
        
        // IMPORTANT: The upload path is updated for bed_strengths
        const fileUrl = `${import.meta.env.VITE_API_BASE_URL}/uploads/bed_strengths/${filename}`; 
        
        const extension = filename.split('.').pop().toLowerCase();
        
        const getIcon = () => {
          if (['pdf'].includes(extension)) return <FaFilePdf className="text-red-500" size={24} />;
          if (['doc', 'docx'].includes(extension)) return <FaFileWord className="text-blue-500" size={24} />;
          if (['xls', 'xlsx'].includes(extension)) return <FaFileExcel className="text-green-700" size={24} />;
          if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return <FaFileImage className="text-green-500" size={24} />;
          return <FaFileAlt className="text-gray-500" size={24} />;
        };

        return (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" title={filename} className="cursor-pointer">
            {getIcon()}
          </a>
        );
      },
    },
  ], [tableState.currentPage, tableState.entriesPerPage, translate, language]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 font-sans bg-white min-h-screen">
      <style>
        {`
          .custom-table-header-color th {
            background-color: #6f5492 !important;
            color: white !important;
          }
        `}
      </style>

      <MenuTable 
        Ltext={translate("bedStrengthList")} 
        data={data}
        columns={columns}
        tableState={tableState}
        headerClassName="bg-purple-700 text-white"
      />
    </div>
  );
};

export default BedStrength;