import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MenuTable from "../../../Components/Admin/Menu/MenuTable";
import {
  FaEdit,
  FaFilePdf,
  FaFileWord,
  FaFileImage,
  FaFileAlt,
  FaFileExcel,
  FaClipboard,
} from "react-icons/fa";

import { useModal } from "@/context/ModalProvider";


const GenerateLinkPage = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const{showModal} = useModal()

  const navigate = useNavigate();

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/generated-links`, { withCredentials: true });
      setLinks(res.data || []);
    } catch (error) {
      console.error("Error fetching links:", error);
    } finally {
      setLoading(false);
    }
  };
   const getFileIcon = (filePath) => {
    
    if (!filePath) return <FaFileAlt className={` text-gray-500`} />;

    const extension = filePath.split(".").pop().toLowerCase();

    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "svg":
      case "webp":
        return <FaFileImage size={22} className={` text-yellow-500`} />;
      case "pdf":
        return <FaFilePdf size={22} className={` text-red-600`} />;
      case "doc":
      case "docx":
        return <FaFileWord size={22} className={` text-blue-600`} />;
      case "xls":
      case "xlsx":
        return <FaFileExcel size={22} className={` text-green-700`} />;
      default:
        return <FaFileAlt  size={22} className={` text-gray-500`} />;
    }
  };

  const filteredLinks = links.filter((link) =>
    link.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
  {
    header: "Sl. No",
    accessor: "slno",
    // cell: ({ row}) =>
    //   (currentPage - 1) * perPage + (row.index + 1), // ✅ correct numbering
  },
  {
    header: "Title",
    accessor: "title",
    isSearchable: true,
    isSortable: true,
  },
 {
      header: "View",
      accessor: "filePath_view",
      cell: ({ row }) =>
        row.original.filePath ? (
          <a
            href={`${import.meta.env.VITE_API_BASE_URL}/uploads/generated-links/${row.original.filePath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block transition-transform duration-200 hover:scale-110"
          >
            {/* Call the helper function here */}
            {getFileIcon(row.original.filePath)}
          </a>
        ) : (
          "—"
        ),
    },
{
  header: "Copy Link",
  accessor: "filePath_copy",
  cell: ({ row }) =>
  row.original.filePath ? (
    <button
      onClick={() => {
        const fileLink = `${import.meta.env.VITE_API_BASE_URL}/uploads/generated-links/${row.original.filePath}`;
        console.log("Copied link:", fileLink); 
        navigator.clipboard.writeText(fileLink);
        showModal("success","File link copied to clipboard!");
      }}
      className="text-green-600 hover:text-green-800 "
    >
      <FaClipboard size={22} />
    </button>
  ) : (
    "—"
  ),
},
    {
      header: "Action",
      accessor: "actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/admin/generate-link/edit/${row.original.id}`)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FaEdit  />
          </button>
          
        </div>
      ),
    },
  ];
  // After all your state and functions, but before `return`
const numberedLinks = filteredLinks.map((item, idx) => ({
  ...item,
  slno: (currentPage - 1) * perPage + (idx + 1)
}));


  return (
    <div className="min-h-[80vh]">
      {/* The external search bar is not present here, as per your request. */}
      {/* MenuTable will handle its own search input using the passed tableState props. */}
      <MenuTable
        Ltext="Generate Links"
        Rtext="Add Link"
        data={numberedLinks} 
  //       data={numberedLinks.filter(link =>
  //   link.title?.toLowerCase().includes(searchTerm.toLowerCase())
  // )}
        columns={columns}
        addPath="/admin/generate-link/add"
        tableState={{
          loading,
          currentPage,
          setCurrentPage,
          entriesPerPage: perPage,
          setEntriesPerPage: setPerPage,
          searchTerm,      // This searchTerm state will be updated by MenuTable's internal search input
          setSearchTerm,   // This setter allows MenuTable to update the searchTerm state
          sortBy,
          setSortBy,
          sortOrder,
          setSortOrder,
          totalItems: filteredLinks.length,
        }}
      />
    </div>
  );
};

export default GenerateLinkPage;
