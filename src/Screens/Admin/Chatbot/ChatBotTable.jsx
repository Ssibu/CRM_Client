import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSort, FaPlus, FaEdit, FaTimes, FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";
import { chatbotCategoryAPI } from "../../../services/api";
import DeleteConfirmationModal from "../../../Components/DeleteConfirmationModal/DeleteConfirmationModal";

// Helper: highlight search matches (optional, purely for UI)
const highlightMatch = (text, query) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 text-black rounded px-1">
        {part}
      </mark>
    ) : (
      part
    )
  );
};

// FilterControls
const FilterControls = ({ entriesPerPage, setEntriesPerPage, searchTerm, setSearchTerm, setCurrentPage }) => (
  <div className="flex items-center justify-between mb-3">
    <select
      value={entriesPerPage}
      onChange={(e) => {
        setEntriesPerPage(Number(e.target.value));
        setCurrentPage(1);
      }}
      className="border rounded px-2 py-1 text-sm"
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={20}>20</option>
    </select>
    <input
      type="text"
      placeholder="Search..."
      className="border px-2 py-1 text-sm rounded"
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
      }}
    />
  </div>
);

// TableRow
const TableRow = ({ item, idx, currentPage, entriesPerPage, searchTerm, onStatusChange }) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  const handleStatusToggle = async () => {
    setUpdating(true);
    try {
      const newStatus = item.status === "Active" ? "Inactive" : "Active";
      await chatbotCategoryAPI.update(item.id, { status: newStatus });
      onStatusChange();
    } catch (error) {
      console.error("Error updating category status:", error);
      alert("Failed to update status: " + (error.response?.data?.message || error.message));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <motion.tr
        className="border-b hover:bg-gray-50 transition-all"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.05 }}
      >
        <td className="p-2">{(currentPage - 1) * entriesPerPage + idx + 1}</td>
        <td className="p-2">{highlightMatch(item.en, searchTerm)}</td>
        <td className="p-2 font-odia">{highlightMatch(item.od, searchTerm)}</td>
        <td className="p-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              item.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {item.status}
          </span>
        </td>
        <td className="p-2 flex space-x-2">
          <button
            onClick={() => setIsConfirmModalOpen(true)}
            className={`p-1 rounded transition ${
              item.status === "Active"
                ? "text-red-500 hover:bg-red-100 hover:text-red-700"
                : "text-green-500 hover:bg-green-100 hover:text-green-700"
            }`}
            disabled={updating}
            title={item.status === "Active" ? "Deactivate" : "Activate"}
          >
            {item.status === "Active" ? <FaTimes /> : <FaCheck />}
          </button>
          <button
            onClick={() => navigate(`/admin/manage-chatbot/edit-category/${item.id}`)}
            className="p-1 text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition rounded"
            title="Edit"
          >
            <FaEdit />
          </button>
        </td>
      </motion.tr>

      {isConfirmModalOpen && (
        <DeleteConfirmationModal
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleStatusToggle}
          title={item.status === "Active" ? "Deactivate Category" : "Activate Category"}
          message={
            item.status === "Active"
              ? `Are you sure you want to deactivate "${item.en}"? It will no longer be visible to users.`
              : `Are you sure you want to activate "${item.en}"? It will become visible to users.`
          }
          confirmText={item.status === "Active" ? "Deactivate" : "Activate"}
          cancelText="Cancel"
          icon={item.status === "Active" ? FaTimes : FaCheck}
        />
      )}
    </>
  );
};

// Main ChatBotTable
const ChatBotTable = ({ Ltext, Rtext }) => {
  const [loading, setLoading] = useState(true);
  const [menus, setMenus] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortField, setSortField] = useState("en"); // default sort field
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc
  const navigate = useNavigate();

  // Fetch categories from server
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await chatbotCategoryAPI.getAll(currentPage, entriesPerPage, debouncedSearch, sortField, sortOrder);
      setMenus(response.data.categories || []);
      setTotalItems(response.data.totalCategories || 0);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setMenus([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage, entriesPerPage, debouncedSearch, sortField, sortOrder]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleStatusChange = () => fetchCategories();

  // Handle sort toggle
  const handleSortToggle = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-xl overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{Ltext}</h2>
        <div className="flex space-x-2">
          {Ltext === "Menu List" && (
            <button
              onClick={() => handleSortToggle("en")}
              className="bg-gray-700 text-white px-3 py-2 rounded flex items-center gap-2 hover:bg-gray-800 transition"
            >
              <FaSort />
              Sort by English
            </button>
          )}
          <button
            onClick={() => navigate("/admin/manage-chatbot/add-category")}
            className="bg-yellow-400 px-3 py-2 rounded flex items-center gap-2 hover:bg-yellow-500 transition"
          >
            <FaPlus /> {Rtext}
          </button>
        </div>
      </div>

      <FilterControls
        entriesPerPage={entriesPerPage}
        setEntriesPerPage={setEntriesPerPage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setCurrentPage={setCurrentPage}
      />

      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">SL.No</th>
            <th className="p-2 cursor-pointer" onClick={() => handleSortToggle("en")}>
              Category (English)
            </th>
            <th className="p-2 cursor-pointer" onClick={() => handleSortToggle("od")}>
              Category (Odia)
            </th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: entriesPerPage }).map((_, idx) => (
              <tr key={idx} className="animate-pulse border-b">
                <td className="p-2 bg-gray-200 h-4 rounded"></td>
                <td className="p-2 bg-gray-200 h-4 rounded"></td>
                <td className="p-2 bg-gray-200 h-4 rounded"></td>
                <td className="p-2 bg-gray-200 h-4 rounded"></td>
                <td className="p-2 bg-gray-200 h-4 rounded"></td>
              </tr>
            ))
          ) : menus.length > 0 ? (
            menus.map((item, idx) => (
              <TableRow
                key={item.id}
                item={item}
                idx={idx}
                currentPage={currentPage}
                entriesPerPage={entriesPerPage}
                searchTerm={debouncedSearch}
                onStatusChange={handleStatusChange}
              />
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-500">
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <div>
          Showing {totalItems === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1} to{" "}
          {Math.min(currentPage * entriesPerPage, totalItems)} of {totalItems} entries
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border rounded ${currentPage === page ? "bg-gray-300 font-bold" : ""}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBotTable;
