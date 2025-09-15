import React, { useMemo } from "react";
import MenuTable from "@/Components/Admin/Menu/MenuTable";
import { useServerSideTable } from "@/hooks/useServerSideTable";
import { formatDate } from "@/utils/format-date";

const ActionBadge = ({ action }) => {
    const actionClasses = {
        CREATE: "bg-green-100 text-green-800",
        UPDATE: "bg-blue-100 text-blue-800",
        DELETE: "bg-red-100 text-red-800",
        READ: "bg-gray-100 text-gray-800",
    };
    return (
        <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                actionClasses[action] || "bg-gray-100"
            }`}
        >
            {action}
        </span>
    );
};

const LogListPage = () => {
    const { data: logs, tableState } = useServerSideTable(
        `${import.meta.env.VITE_API_BASE_URL}/logs`
    );

    const logColumns = useMemo(
        () => [
            {
                header: "Sl. No",
                cell: ({ index }) =>
                    (tableState.currentPage - 1) * tableState.entriesPerPage +
                    index +
                    1,
            },
            {
                header: "User",
                accessor: "user_name",
                isSearchable: true,
                isSortable: true,
            },
            {
                header: "Action",
                accessor: "action",
                isSearchable: true,
                isSortable: true,
                cell: ({ row }) => <ActionBadge action={row.original.action} />,
            },
            {
                header: "Page",
                accessor: "page_name",
                isSearchable: true,
                isSortable: true,
            },
                {
                header: "Target",
                accessor: "target",
                isSearchable: true,
                isSortable: true,
                cell: ({ row }) => row.original.target ? row.original.target : "N/A"

            },
             {
                header: "Description",
                accessor: "description",
                cell:({row})=> (<div title={row.original.description} className="truncate w-64" >{row.original.description}</div>)

            },
           
            {
                header: "IP",
                accessor: "ip",
                 isSearchable: true,
                isSortable: true,
            },
            {
                header: "Browser",
                accessor: "browser",
                 isSearchable: true,
                isSortable: true,
            },
            {
                header: "Log Time",
                accessor: "createdAt",
                isSortable: true,
               cell: ({ row }) => {
  const d = new Date(row.original.createdAt);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2); 
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

            },
        ],
        [tableState.currentPage, tableState.entriesPerPage]
    );

    return (
        <div className="min-h-[80vh]">
            <MenuTable
                Ltext="Activity Logs"
                data={logs}
                columns={logColumns}
                tableState={tableState}
            />
        </div>
    );
};

export default LogListPage;
