import React from "react";
import { FaFilePdf } from "react-icons/fa";

import MenuTable from "@/Components/User/Menu/MenuTable";
import { useServerSideTable } from "@/hooks/useServerSideTable";
import { useGlobalTranslation } from "@/hooks/useGlobalTranslation";

const DisplaySchemes = () => {
  const {
    data: schemes,
    tableState: {
      loading,
      totalItems,
      currentPage,
      setCurrentPage,
      entriesPerPage,
      setEntriesPerPage,
      searchTerm,
      setSearchTerm,
      sortBy,
      setSortBy,
      sortOrder,
      setSortOrder,
    },
  } = useServerSideTable("http://localhost:5000/allschemes", 10);

  const { translate } = useGlobalTranslation();

  // Toggle sorting by displayOrder (you can extend to multi-lang sorting if needed)
  const toggleSort = () => {
    if (sortBy === "displayOrder") {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy("displayOrder");
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  // Helper to get translated title with fallback
  const getTitle = (row) => {
    return translate(row.original, "title") || row.original.en_title || "—";
  };

  const columns = [
    {
      header: translate("slNo") || "Sl No.",
      cell: ({ index }) => (currentPage - 1) * entriesPerPage + index + 1,
    },
    {
      header: (
        <button
          onClick={toggleSort}
          className="flex items-center gap-1 cursor-pointer select-none"
          type="button"
          aria-label={translate("title") || "Sort by Title"}
        >
          {translate("title") || "Title"}
        </button>
      ),
      accessor: "en_title",
      isSearchable: true,
      isSortable: true,
      cell: ({ row }) => (
        <>
          {getTitle(row)}{" "}
          <img
            src="https://mtpl.work/dph/assets/user/images/gif-new.gif"
            alt={translate("new") || "New"}
            className="w-6 h-4 inline"
          />
        </>
      ),
    },
    {
      header: translate("document") || "Document",
      accessor: "document",
      cell: ({ row }) =>
        row.original.document ? (
          <a
            href={row.original.document}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 text-xl"
            aria-label={`${translate("document")} for ${getTitle(row)}`}
          >
            <FaFilePdf />
          </a>
        ) : (
          "-"
        ),
    },
  ];

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        {translate("loading") || "Loading..."}
      </div>
    );
  }

  // if (!schemes || schemes.length === 0) {
  //   return (
  //     <div className="container mx-auto p-4 text-center text-gray-500">
  //       {translate("noDocuments") || "No documents found"}
  //     </div>
  //   );
  // }

  return (
    <div className="p-4 flex justify-center">
      <div className="w-full container">
        <MenuTable
          Ltext={translate("schemes") || "Schemes"}
          Rtext={null}
          data={schemes}
          columns={columns}
          tableState={{
            loading,
            totalItems,
            currentPage,
            setCurrentPage,
            entriesPerPage,
            setEntriesPerPage,
            searchTerm,
            setSearchTerm,
            sortBy,
            setSortBy,
            sortOrder,
            setSortOrder,
          }}
        />
      </div>
    </div>
  );
};

export default DisplaySchemes;
