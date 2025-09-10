// Tender.jsx
import React, { useState, useMemo } from "react";
import { FaFilePdf, FaFileWord, FaFileImage, FaFileAlt, FaFileExcel } from "react-icons/fa";
import MenuTable from "../../../Components/User/Menu/MenuTable";
import { useServerSideTable } from "../../../hooks/useServerSideTable";
import { useGlobalTranslation } from "@/hooks/useGlobalTranslation";
import { useNavigate } from "react-router-dom";
import Button from "@/Components/User/UI/Button";

const API_URL_BASE = `${import.meta.env.VITE_API_BASE_URL}/user/tenders`;

const Tender = () => {
  const { translate, language } = useGlobalTranslation();
  const navigate = useNavigate();

  const [isSearched, setIsSearched] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [activeFilters, setActiveFilters] = useState({ from: "", to: "" });

  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (activeFilters.from) params.append("fromDate", activeFilters.from);
    if (activeFilters.to) params.append("toDate", activeFilters.to);
    return `${API_URL_BASE}${params.toString() ? "?" + params.toString() : ""}`;
  }, [activeFilters]);

  const { data, tableState } = useServerSideTable(apiUrl);

  const handleSearch = () => {
    setIsSearched(true);
    if (fromDate && toDate && new Date(fromDate) <= new Date(toDate)) {
      setActiveFilters({ from: fromDate, to: toDate });
      tableState.setCurrentPage(1);
    } else {
      setActiveFilters({ from: "", to: "" });
    }
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setActiveFilters({ from: "", to: "" });
    setIsSearched(false);
    if (tableState.setSearchTerm) tableState.setSearchTerm("");
    tableState.setCurrentPage(1);
  };

  const isInvalidRange = fromDate && toDate && new Date(fromDate) > new Date(toDate);
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-GB") : "-";

  const renderFile = (filename, folder) => {
    if (!filename) return <span className="text-gray-400 italic text-xs">{translate("noDocument")}</span>;
    const ext = filename.split(".").pop().toLowerCase();
    const icons = {
      pdf: <FaFilePdf className="text-red-500" size={24} />,
      doc: <FaFileWord className="text-blue-500" size={24} />,
      docx: <FaFileWord className="text-blue-500" size={24} />,
      xls: <FaFileExcel className="text-green-700" size={24} />,
      xlsx: <FaFileExcel className="text-green-700" size={24} />,
      jpg: <FaFileImage className="text-green-500" size={24} />,
      png: <FaFileImage className="text-green-500" size={24} />,
      gif: <FaFileImage className="text-green-500" size={24} />,
      webp: <FaFileImage className="text-green-500" size={24} />,
    };
    return (
      <a
        href={`${import.meta.env.VITE_API_BASE_URL}/uploads/${folder}/${filename}`}
        target="_blank"
        rel="noopener noreferrer"
        title={filename}
        className="cursor-pointer"
      >
        {icons[ext] || <FaFileAlt className="text-gray-500" size={24} />}
      </a>
    );
  };

  const isNewTender = (d) => {
    if (!d) return false;
    return (new Date() - new Date(d)) / (1000 * 60 * 60 * 24) <= 7;
  };

  const columns = useMemo(() => [
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
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span>{row.original[`${language}_title`]}</span>
          {isNewTender(row.original.date) && (
            <img
              src="https://mtpl.work/dph/assets/user/images/gif-new.gif"
              alt="New"
              className="w-8"
            />
          )}
        </div>
      ),
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
        const list = row.original.corrigendums || [];
        return list.length ? (
          list.map((c, i) => <span key={i}>{renderFile(c.cor_document, "corrigendums")}</span>)
        ) : (
          <span className="text-gray-400 italic text-xs">{translate("noDocument")}</span>
        );
      },
    },
  ], [tableState.currentPage, tableState.entriesPerPage, translate, language]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 font-sans bg-white min-h-screen">
      <style>{`
        .custom-table-header-color th {
          background-color: #6f42c1 !important;
          color: white !important;
        }
      `}</style>

      {/* Filter */}
      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div className="flex flex-col">
          <label className="mb-1 text-sm">{translate("fromDate")}</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className={`border rounded-md p-2 w-48 ${isSearched && (!fromDate || isInvalidRange) ? "border-red-500" : "border-gray-300"}`}
          />
          {isSearched && !fromDate && <p className="text-red-500 text-sm">Date is required.</p>}
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm">{translate("toDate")}</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className={`border rounded-md p-2 w-48 ${isSearched && (!toDate || isInvalidRange) ? "border-red-500" : "border-gray-300"}`}
          />
          {isSearched && !toDate && <p className="text-red-500 text-sm">Date is required.</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSearch}>{translate("search")}</Button>
          <Button onClick={handleReset} variant="danger">{translate("reset")}</Button>
          <Button variant="warning" onClick={() => navigate("/subpage/tender-archived")}>{translate("archivedTenders")}</Button>
        </div>
      </div>

      {/* Table */}
      <MenuTable
        Ltext={translate("tenderList")}
        data={data}
        columns={columns}
        tableState={tableState}
        headerClassName="custom-table-header-color"
      />
    </div>
  );
};

export default Tender;
