import React, { useState, useMemo } from "react";
import { FaFilePdf } from "react-icons/fa";
import MenuTable from "@/Components/User/Menu/MenuTable";
import { useServerSideTable } from "@/hooks/useServerSideTable";
import { useGlobalTranslation } from "@/hooks/useGlobalTranslation";
import Button from "@/Components/User/UI/Button";
import { formatDate } from "@/utils/format-date";
import clsx from "clsx";

const NoticePage = () => {
  const { translate, language } = useGlobalTranslation();

  const [dateRange, setDateRange] = useState({ fromDate: "", toDate: "" });
  const [errors, setErrors] = useState({ fromDate: "", toDate: "" });
  const [searchQuery, setSearchQuery] = useState({ fromDate: "", toDate: "" });

  const apiEndpoint = useMemo(() => {
    const params = new URLSearchParams();
    if (searchQuery.fromDate) params.append("fromDate", searchQuery.fromDate);
    if (searchQuery.toDate) params.append("toDate", searchQuery.toDate);
    return `${
      import.meta.env.VITE_API_BASE_URL
    }/public/notices?${params.toString()}`;
  }, [searchQuery]);

  const { data: notices, tableState } = useServerSideTable(apiEndpoint);

  const handleSearch = () => {
    const { fromDate, toDate } = dateRange;
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
      newErrors.toDate = "To Date cannot be before From Date.";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      setSearchQuery(dateRange);
      tableState.setCurrentPage(1);
    }
  };

  const handleReset = () => {
    setDateRange({ fromDate: "", toDate: "" });
    setSearchQuery({ fromDate: "", toDate: "" });
    setErrors({ fromDate: "", toDate: "" });
    if (tableState.setSearchTerm) tableState.setSearchTerm("");
    tableState.setCurrentPage(1);
  };

  const isNewNotice = (dateStr) => {
    if (!dateStr) return false;
    const noticeDate = new Date(dateStr);
    const today = new Date();
    const diffTime = today - noticeDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  };

  const columns = useMemo(
    () => [
      {
        header: translate("sl-no"),
        cell: ({ index }) =>
          (tableState.currentPage - 1) * tableState.entriesPerPage + index + 1,
      },
      {
        header: translate("title"),
        accessor: language === "od" ? "od_title" : "en_title",
        isSearchable: true,
        isSortable: true,
        cell: ({ row }) => {
          const title =
            row.original[language === "od" ? "od_title" : "en_title"];
          const date = row.original.date;

          return (
            <div className="flex items-center gap-2">
              <span>{title}</span>
              {isNewNotice(date) && (
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
        header: translate("publish-date"),
        accessor: "date",
        cell: ({ row }) => formatDate(row.original.date),
        isSortable: true,
      },
      {
        header: translate("document"),
        cell: ({ row }) =>
          row.original.doc ? (
            <a
              href={`${import.meta.env.VITE_API_BASE_URL}/uploads/notices/${
                row.original.doc
              }`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-800"
              title={translate("view-document")}
            >
              <FaFilePdf className="h-6 w-6" />
            </a>
          ) : (
            <span className="text-gray-400">N/A</span>
          ),
      },
    ],
    [tableState.currentPage, tableState.entriesPerPage, translate, language]
  );

  return (
    <div className="p-6 min-h-screen">
      <div>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {translate("from-date")}
            </label>
            <input
              type="date"
              value={dateRange.fromDate}
              onChange={(e) => {
                setDateRange((prev) => ({ ...prev, fromDate: e.target.value }));
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {translate("to-date")}
            </label>
            <input
              type="date"
              value={dateRange.toDate}
              onChange={(e) => {
                setDateRange((prev) => ({ ...prev, toDate: e.target.value }));
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
      </div>

      <MenuTable
        Ltext={translate("notice")}
        data={notices}
        columns={columns}
        tableState={tableState}
      />
    </div>
  );
};

export default NoticePage;