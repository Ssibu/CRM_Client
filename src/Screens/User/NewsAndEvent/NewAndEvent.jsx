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
import Button from "@/Components/User/UI/Button";
import { useGlobalTranslation } from "@/hooks/useGlobalTranslation";
import clsx from "clsx";

const API_URL_BASE = `${import.meta.env.VITE_API_BASE_URL}/user/news-and-events`;

const NewsAndEvents = () => {
  const { translate, language } = useGlobalTranslation();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [errors, setErrors] = useState({ fromDate: "", toDate: "" });
  const [activeFilters, setActiveFilters] = useState({ from: "", to: "" });

  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (activeFilters.from) params.append("fromDate", activeFilters.from);
    if (activeFilters.to) params.append("toDate", activeFilters.to);
    const queryString = params.toString();
    return queryString ? `${API_URL_BASE}?${queryString}` : API_URL_BASE;
  }, [activeFilters]);

  const { data, tableState } = useServerSideTable(apiUrl);

  const handleSearch = () => {
    const newErrors = { fromDate: "", toDate: "" };
    let isValid = true;

    if (!fromDate) {
      newErrors.fromDate = "From date is required.";
      isValid = false;
    }

    if (!toDate) {
      newErrors.toDate = "To date is required.";
      isValid = false;
    }

    if (isValid && new Date(fromDate) > new Date(toDate)) {
      newErrors.toDate = "To Date must be after From Date.";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      setActiveFilters({ from: fromDate, to: toDate });
      tableState.setCurrentPage(1);
    }
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setErrors({ fromDate: "", toDate: "" });
    setActiveFilters({ from: "", to: "" });
    if (tableState.setSearchTerm) tableState.setSearchTerm("");
    tableState.setCurrentPage(1);
  };

  const isNewItem = (dateStr) => {
    if (!dateStr) return false;
    const eventDate = new Date(dateStr);
    const today = new Date();
    const diffTime = today - eventDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  };

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
        cell: ({ row }) => {
          const title = row.original[`${language}_title`] || "";
          const date = row.original.eventDate;

          return (
            <div className="flex items-center gap-2">
              <span>{title}</span>
              {isNewItem(date) && (
                <img
                  src="https://mtpl.work/dph/assets/user/images/gif-new.gif"
                  alt="New"
                  className="w-8"
                />
              )}
            </div>
          );
        },
      },
      {
        header: translate("publishDate"),
        accessor: "eventDate",
        isSortable: true,
        cell: ({ row }) => {
          const rawDate = row.original.eventDate;
          if (!rawDate) return "-";
          const dateObj = new Date(rawDate);
          const day = String(dateObj.getDate()).padStart(2, "0");
          const month = String(dateObj.getMonth() + 1).padStart(2, "0");
          const year = dateObj.getFullYear();
          return `${day}-${month}-${year}`;
        },
      },
      {
        header: translate("document"),
        accessor: "document",
        cell: ({ row }) => {
          const filename = row.original.document;
          if (!filename) {
            return (
              <span className="text-gray-400 italic text-xs">
                {translate("noDocument")}
              </span>
            );
          }
          const fileUrl = `${
            import.meta.env.VITE_API_BASE_URL
          }/uploads/events/${filename}`;
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
        },
      },
    ],
    [tableState.currentPage, tableState.entriesPerPage, translate, language]
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      <style>
        {`
          .custom-table-header-color th {
            background-color: #6f5492 !important;
            color: white !important;
          }
        `}
      </style>

      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div className="flex flex-col">
          <label
            htmlFor="fromDate"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            {translate("fromDate")}
          </label>
          <input
            id="fromDate"
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              if (errors.fromDate)
                setErrors((prev) => ({ ...prev, fromDate: "" }));
            }}
            className={clsx(
              "w-48 rounded-lg border px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1",
              errors.fromDate
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            )}
          />
          <div className="min-h-[1.25rem] mt-1">
            {errors.fromDate && (
              <p className="text-red-500 text-sm">{errors.fromDate}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="toDate"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            {translate("toDate")}
          </label>
          <input
            id="toDate"
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              if (errors.toDate)
                setErrors((prev) => ({ ...prev, toDate: "" }));
            }}
            className={clsx(
              "w-48 rounded-lg border px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1",
              errors.toDate
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            )}
          />
          <div className="min-h-[1.25rem] mt-1">
            {errors.toDate && (
              <p className="text-red-500 text-sm">{errors.toDate}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-[1.75rem]">
          <Button onClick={handleSearch}>{translate("search")}</Button>
          <Button variant="danger" onClick={handleReset}>
            {translate("reset")}
          </Button>
        </div>
      </div>

      <MenuTable
        Ltext={translate("newsEventsList")}
        data={data}
        columns={columns}
        tableState={tableState}
        headerClassName="custom-table-header-color"
      />
    </div>
  );
};

export default NewsAndEvents;