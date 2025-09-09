// import React from "react";
// import { FaFilePdf } from "react-icons/fa";

// import MenuTable from "@/Components/Admin/Menu/MenuTable";
// import { useServerSideTable } from "@/hooks/useServerSideTable";

// const DisplayForms = () => {
//   const {
//     data: forms,
//     tableState: {
//       loading,
//       totalItems,
//       currentPage,
//       setCurrentPage,
//       entriesPerPage,
//       setEntriesPerPage,
//       searchTerm,
//       setSearchTerm,
//       sortBy,
//       setSortBy,
//       sortOrder,
//       setSortOrder,
//     },
//   } = useServerSideTable("http://localhost:5000/forms", 10);

//   // Handle sort toggle for Title column
//   const toggleSort = () => {
//     if (sortBy === "en_title") {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortBy("en_title");
//       setSortOrder("asc");
//     }
//     setCurrentPage(1);
//   };

//  const columns = [
//   {
//     header: "Sl No.",
//     cell: ({ index }) => (currentPage - 1) * entriesPerPage + index + 1,
//   },
//   {
//     header: (
//       <button
//         onClick={toggleSort}
//         className="flex items-center gap-1 cursor-pointer select-none"
//         type="button"
//         aria-label="Sort by Title"
//       >
//         Title
//       </button>
//     ),
//     accessor: "en_title",
//     isSearchable: true,
//     isSortable: true,
//     cell: ({ row }) => (
//       <>
//         {row.original.en_title}{" "}
//         <img
//           src="https://mtpl.work/dph/assets/user/images/gif-new.gif"
//           alt="New"
//           className="w-6 h-4 inline"
//         />
//       </>
//     ),
//   },
//   {
//     header: "Document",
//     accessor: "document",
//     cell: ({ row }) =>
//       row.original.document ? (
//         <a
//           href={row.original.document}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-red-600 text-xl"
//           aria-label={`Open document for ${row.original.en_title}`}
//         >
//           <FaFilePdf />
//         </a>
//       ) : (
//         "-"
//       ),
//   },
// ];

//   return (
//     <div className="p-4 flex justify-center">
//       <div className="w-full max-w-4xl">
//         <MenuTable
//           Ltext="Forms"
//           Rtext={null}
//           data={forms}
//           columns={columns}
//           tableState={{
//             loading,
//             totalItems,
//             currentPage,
//             setCurrentPage,
//             entriesPerPage,
//             setEntriesPerPage,
//             searchTerm,
//             setSearchTerm,
//             sortBy,
//             setSortBy,
//             sortOrder,
//             setSortOrder,
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default DisplayForms;


import React from "react";
import { FaFilePdf } from "react-icons/fa";

import MenuTable from "@/Components/User/Menu/MenuTable";
import { useServerSideTable } from "@/hooks/useServerSideTable";
import { useGlobalTranslation } from "@/hooks/useGlobalTranslation";

const DisplayForms = () => {
  const {
    data: forms,
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
  } = useServerSideTable("http://localhost:5000/forms", 10);

  const { translate } = useGlobalTranslation();

  // Sort toggle function - sorts by English title, you can extend to multi-lang if needed
  const toggleSort = () => {
    if (sortBy === "en_title") {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy("en_title");
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  // Helper function to pick correct title based on current language
  const getTitle = (row) => {
    return translate(row.original, "title") || row.original.en_title || "—";
  };

  const columns = [
    {
      header: "Sl No.",
      cell: ({ index }) => (currentPage - 1) * entriesPerPage + index + 1,
    },
    {
      header: (
        <button
          onClick={toggleSort}
          className="flex items-center gap-1 cursor-pointer select-none"
          type="button"
          aria-label={translate("title")}
        >
          {translate("title")}
        </button>
      ),
      accessor: "en_title", // sorting is done on English title for simplicity
      isSearchable: true,
      isSortable: true,
      cell: ({ row }) => (
        <>
          {getTitle(row)}{" "}
          <img
            src="https://mtpl.work/dph/assets/user/images/gif-new.gif"
            alt="New"
            className="w-6 h-4 inline"
          />
        </>
      ),
    },
    {
      header: translate("document"),
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
      <div className="container mx-auto p-4 text-center">{translate("loading")}</div>
    );
  }

  // if (!forms || forms.length === 0) {
  //   return (
  //     <div className="container mx-auto p-4 text-center text-gray-500">
  //       {translate("noDocuments")}
  //     </div>
  //   );
  // }

  return (
    <div className="p-4 flex justify-center">
      <div className="w-full container">
        <MenuTable
          Ltext={translate("forms")}
          Rtext={null}
          data={forms}
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

export default DisplayForms;
