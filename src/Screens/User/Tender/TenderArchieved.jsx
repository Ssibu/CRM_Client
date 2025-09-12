import React, { useState, useMemo } from "react";
import {
  FaFilePdf,
  FaFileWord,
  FaFileImage,
  FaFileAlt,
  FaFileExcel,
} from "react-icons/fa";
import MenuTable from "../../../Components/User/Menu/MenuTable";
import { useServerSideTable } from "../../../hooks/useServerSideTable";
import { useGlobalTranslation } from "@/hooks/useGlobalTranslation";
import { useNavigate } from "react-router-dom";

// --- Base API URL (Archived Tenders ke liye) ---
const API_URL_BASE = `${import.meta.env.VITE_API_BASE_URL}/user/tenders?status=archived`;
const TenderArchived = () => {
  const { translate, language } = useGlobalTranslation();
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [activeFilters, setActiveFilters] = useState({ from: "", to: "" });
  // --- API URL with filters ---
  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (activeFilters.from) params.append("fromDate", activeFilters.from);
    if (activeFilters.to) params.append("toDate", activeFilters.to);
    const queryString = params.toString();
    return queryString ? `${API_URL_BASE}?${queryString}` : API_URL_BASE;
  }, [activeFilters]);
  const { data, tableState } = useServerSideTable(apiUrl);
  // --- Search & Reset handlers ---
  const handleSearch = () => {
    setActiveFilters({ from: fromDate, to: toDate });
  };
  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setActiveFilters({ from: "", to: "" });
    if (tableState.setSearchTerm) tableState.setSearchTerm("");
  };
  // --- Helper: Format Date (dd-mm-yyyy) ---
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const dateObj = new Date(dateStr);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };
  // --- Helper: File Icon with Link ---
  const renderFile = (filename, folder) => {
    if (!filename) {
      return (
        <span className="text-gray-400 italic text-xs">
          {translate("noDocument")}
        </span>
      );
    }
    const fileUrl = `${import.meta.env.VITE_API_BASE_URL}/uploads/${folder}/${filename}`;
    const extension = filename.split(".").pop().toLowerCase();

    const getIcon = () => {
      if (["pdf"].includes(extension))
        return <FaFilePdf className="text-red-500" size={24} />;
      if (["doc", "docx"].includes(extension))
        return <FaFileWord className="text-blue-500" size={24} />;
      if (["xls", "xlsx"].includes(extension))
        return <FaFileExcel className="text-green-700" size={24} />;
      if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension))
        return <FaFileImage className="text-green-500" size={24} />;
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
  };
  // --- Table Columns ---
  const columns = useMemo(
    () => [
      {
        header: translate("serialNumber"),
        cell: ({ index }) =>
          (tableState.currentPage - 1) * tableState.entriesPerPage + index + 1,
      },
      {
        header: translate("title"),
        accessor: `${language}_title`,
        isSearchable: true,
        isSortable: true,
      },
      {
        header: translate("publishDate"),
        accessor: "date",
        isSortable: true,
        cell: ({ row }) => formatDate(row.original.date),
      },
      {
        header: translate("expiryDate"),
        accessor: "expiry_date",
        isSortable: true,
        cell: ({ row }) => formatDate(row.original.expiry_date),
      },
      {
        header: translate("nitDocument"),
        accessor: "nit_doc",
        cell: ({ row }) => renderFile(row.original.nit_doc, "tenders"),
      },
      {
        header: translate("tenderDocument"),
        accessor: "doc",
        cell: ({ row }) => renderFile(row.original.doc, "tenders"),
      },

      {
  header: translate("corrigendumDocument"),
  accessor: "corrigendums",
  cell: ({ row }) => {
    const corrigendums = row.original.corrigendums || [];
    if (corrigendums.length === 0) {
      return <span className="text-gray-400 italic text-xs">{translate("noDocument")}</span>;
    }
    return (
      <div className="flex gap-2">
        {corrigendums.map((c, idx) => (
          <div key={idx}>{renderFile(c.cor_document, "corrigendums")}</div>
        ))}
      </div>
    );
  },
},
    ],
    [tableState.currentPage, tableState.entriesPerPage, translate, language]
  );
  return (
    <div className="p-4 sm:p-6 lg:p-8 font-sans bg-white min-h-screen">
      <style>
        {`
          .custom-table-header-color th {
            background-color: #6f42c1 !important; 
            color: white !important;
          }
        `}
      </style>
      {/* --- Table Section --- */}
      <MenuTable
        Ltext={translate("archivedTenders")}
        Rtext={translate("backToTenders")}
        data={data}
               addPath="/subpage/tenders"
        columns={columns}
        tableState={tableState}
        headerClassName="custom-table-header-color"
      />
    </div>
  );
};

export default TenderArchived;
