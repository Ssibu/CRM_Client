import React, { useMemo } from "react";
import MenuTable from "@/Components/Admin/Menu/MenuTable";
import { useServerSideTable } from "@/hooks/useServerSideTable";

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
                header: "Description",
                accessor: "description",
                 isSearchable: true,
                isSortable: true,
            },
            {
                header: "IP Address",
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
                header: "OS",
                accessor: "os",
                 isSearchable: true,
                isSortable: true,
            },
               {
                header: "Platform",
                accessor: "platform",
                 isSearchable: true,
                isSortable: true,
            },
            {
                header: "Log Time",
                accessor: "createdAt",
                isSortable: true,
                cell: ({ row }) =>
                    new Date(row.original.createdAt).toLocaleString(),
            },
        ],
        [tableState.currentPage, tableState.entriesPerPage]
    );

    return (
        <div className="p-6 min-h-[80vh] font-sans">
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
