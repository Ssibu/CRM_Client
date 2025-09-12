import React, { useState, useMemo } from "react";
import { FaFilePdf } from "react-icons/fa";
import MenuTable from "@/Components/User/Menu/MenuTable";
import { useServerSideTable } from "@/hooks/useServerSideTable";
import { useGlobalTranslation } from "@/hooks/useGlobalTranslation";
import Button from "@/Components/User/UI/Button";
import Input from "@/Components/User/UI/Input";
import { formatDate } from "@/utils/format-date";

const NoticePage = () => {
  const { translate, language } = useGlobalTranslation();

  const [dateRange, setDateRange] = useState({ fromDate: '', toDate: '' });
  const [searchQuery, setSearchQuery] = useState({ fromDate: '', toDate: '' });

  const apiEndpoint = useMemo(() => {
    const params = new URLSearchParams();
    if (searchQuery.fromDate) params.append('fromDate', searchQuery.fromDate);
    if (searchQuery.toDate) params.append('toDate', searchQuery.toDate);
    return `${import.meta.env.VITE_API_BASE_URL}/public/notices?${params.toString()}`;
  }, [searchQuery]);

  const { data: notices, tableState } = useServerSideTable(apiEndpoint);

  const handleSearch = () => {
    const { fromDate, toDate } = dateRange;
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      alert("Invalid date range: 'From' date cannot be after 'To' date.");
      return;
    }
    setSearchQuery(dateRange);
  };

  const handleReset = () => {
    setDateRange({ fromDate: '', toDate: '' });
    setSearchQuery({ fromDate: '', toDate: '' });
    tableState.setSearchTerm('');
  };

  const isNewNotice = (dateStr) => {
    if (!dateStr) return false;
    const noticeDate = new Date(dateStr);
    const today = new Date();
    const diffTime = today - noticeDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  const columns = useMemo(() => [
    {
      header: translate("sl-no"),
      cell: ({ index }) =>
        (tableState.currentPage - 1) * tableState.entriesPerPage + index + 1,
    },
    {
      header: translate("title"),
      accessor: language === 'od' ? 'od_title' : 'en_title',
      isSearchable: true,
      isSortable: true,
      cell: ({ row }) => {
        const title = row.original[language === 'od' ? 'od_title' : 'en_title'];
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
      accessor: 'date',
      cell: ({ row }) => formatDate(row.original.date),
      isSortable: true,
      isSearchable: true,
    },
    {
      header: translate("document"),
      cell: ({ row }) =>
        row.original.doc ? (
          <a
            href={`${import.meta.env.VITE_API_BASE_URL}/uploads/notices/${row.original.doc}`}
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
  ], [tableState.currentPage, tableState.entriesPerPage, translate, language]);

  return (
    <div className="p-6 min-h-[80vh] font-sans">
      <div className="bg-white p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {translate("from-date")}
            </label>
            <Input
              type="date"
              value={dateRange.fromDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, fromDate: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {translate("to-date")}
            </label>
            <Input
              type="date"
              value={dateRange.toDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, toDate: e.target.value }))}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button className="flex items-center gap-2" onClick={handleSearch}>
              {translate("search")}
            </Button>
            <Button className="flex items-center gap-2" variant="danger" onClick={handleReset}>
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
