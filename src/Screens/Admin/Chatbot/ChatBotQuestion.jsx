// ChatBotQuestion.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTimes, FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";
import chatbotQuestionAPI from "../../../services/chatbotQuestionAPI";
import { chatbotCategoryAPI } from "../../../services/api";
import DeleteConfirmationModal from "../../../Components/DeleteConfirmationModal/DeleteConfirmationModal";

// ✅ Helper: highlight search matches
const highlightMatch = (text, query) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 text-black rounded px-1">{part}</mark>
    ) : (
      part
    )
  );
};

// FilterControls Component
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
      placeholder="Search questions..."
      className="border px-2 py-1 text-sm rounded"
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
      }}
    />
  </div>
);

// TableHeader Component
const TableHeader = ({ Ltext, Rtext, onAdd }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-semibold">{Ltext}</h2>
    <button
      onClick={onAdd}
      className="bg-yellow-400 px-3 py-2 rounded flex items-center gap-2 hover:bg-yellow-500 transition"
    >
      <FaPlus /> {Rtext}
    </button>
  </div>
);

// SkeletonRow Component
const SkeletonRow = () => (
  <tr className="animate-pulse border-b">
    {Array.from({ length: 6 }).map((_, idx) => (
      <td key={idx} className="p-2">
        <div className="w-full h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

// StatusIndicator Component
const StatusIndicator = ({ status }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
    {status}
  </span>
);

// TableRow Component
const TableRow = ({ item, idx, currentPage, entriesPerPage, highlightMatch, searchTerm, onStatusChange, categoriesMap }) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  const handleStatusToggle = async () => {
    setUpdating(true);
    try {
      const newStatus = item.status === "Active" ? "Inactive" : "Active";
      await chatbotQuestionAPI.update(item.id, { status: newStatus });
      onStatusChange();
    } catch (error) {
      console.error("Error updating question status:", error);
      alert("Failed to update question status: " + (error.response?.data?.message || error.message));
    } finally {
      setUpdating(false);
      setIsConfirmModalOpen(false);
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
        <td className="p-2 font-medium">{categoriesMap[item.category_id]?.en || "N/A"}</td>
        <td className="p-2">{highlightMatch(item.en, searchTerm)}</td>
        <td className="p-2 font-odia">{highlightMatch(item.od, searchTerm)}</td>
        <td className="p-2"><StatusIndicator status={item.status} /></td>
        <td className="p-2 flex space-x-2">
          <button
            onClick={() => setIsConfirmModalOpen(true)}
            className={`p-1 rounded transition ${item.status === "Active" ? "text-red-500 hover:bg-red-100 hover:text-red-700" : "text-green-500 hover:bg-green-100 hover:text-green-700"}`}
            disabled={updating}
            title={item.status === "Active" ? "Deactivate" : "Activate"}
          >
            {item.status === "Active" ? <FaTimes size={14} /> : <FaCheck size={14} />}
          </button>
          <button
            onClick={() => navigate(`/admin/manage-chatbot/edit-question/${item.id}`)}
            className="p-1 text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition rounded"
            title="Edit"
          >
            <FaEdit size={14} />
          </button>
        </td>
      </motion.tr>

      {isConfirmModalOpen && (
        <DeleteConfirmationModal
          title={item.status === "Active" ? "Deactivate Question" : "Activate Question"}
          message={`Are you sure you want to ${item.status === "Active" ? "deactivate" : "activate"} "${item.en}"?`}
          confirmText={item.status === "Active" ? "Deactivate" : "Activate"}
          cancelText="Cancel"
          onConfirm={handleStatusToggle}
          onClose={() => setIsConfirmModalOpen(false)}
          icon={null}
        />
      )}
    </>
  );
};

// MenuTableBody Component
const MenuTableBody = ({ loading, data, entriesPerPage, currentPage, highlightMatch, searchTerm, onStatusChange, categoriesMap }) => (
  <table className="min-w-full border text-sm">
    <thead>
      <tr className="bg-gray-100 text-left">
        <th className="p-2">SL.No</th>
        <th className="p-2">Category</th>
        <th className="p-2">Question (English)</th>
        <th className="p-2">Question (Odia)</th>
        <th className="p-2">Status</th>
        <th className="p-2">Action</th>
      </tr>
    </thead>
    <tbody>
      {loading
        ? Array.from({ length: entriesPerPage }).map((_, idx) => <SkeletonRow key={idx} />)
        : data.map((item, idx) => (
            <TableRow
              key={item.id}
              item={item}
              idx={idx}
              currentPage={currentPage}
              entriesPerPage={entriesPerPage}
              highlightMatch={highlightMatch}
              searchTerm={searchTerm}
              onStatusChange={onStatusChange}
              categoriesMap={categoriesMap}
            />
          ))}
    </tbody>
  </table>
);

// Pagination Component
const Pagination = ({ currentPage, setCurrentPage, totalPages, totalItems, perPage }) => {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = startPage + maxVisible - 1;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
      <div>Showing {start} to {end} of {totalItems} entries</div>
      <div className="flex gap-1">
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
        {pageNumbers.map((page) => (
          <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 border rounded ${currentPage === page ? "bg-gray-300 font-bold" : ""}`}>{page}</button>
        ))}
        <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  );
};

// Main ChatBotQuestion Component
const ChatBotQuestion = ({ Ltext, Rtext }) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();
  const categoriesMap = {};
  categories.forEach((cat) => (categoriesMap[cat.id] = cat));

  const fetchCategories = async () => {
    try {
      const res = await chatbotCategoryAPI.getAll();
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await chatbotQuestionAPI.getAll(currentPage, entriesPerPage, debouncedSearch);
      setQuestions(res.data.questions || []);
      setTotalItems(res.data.totalQuestions || 0);
      setTotalPages(res.data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setQuestions([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchQuestions(); }, [debouncedSearch, currentPage, entriesPerPage]);
  useEffect(() => { const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400); return () => clearTimeout(timer); }, [searchTerm]);

  const handleStatusChange = async () => {
    await fetchQuestions();
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  };

  return (
    <div className="p-4 bg-white shadow rounded-xl overflow-x-auto">
      <TableHeader Ltext={Ltext} Rtext={Rtext} onAdd={() => navigate("/admin/manage-chatbot/add-question")} />
      <FilterControls entriesPerPage={entriesPerPage} setEntriesPerPage={setEntriesPerPage} searchTerm={searchTerm} setSearchTerm={setSearchTerm} setCurrentPage={setCurrentPage} />
      <MenuTableBody loading={loading} data={questions} entriesPerPage={entriesPerPage} currentPage={currentPage} highlightMatch={highlightMatch} searchTerm={debouncedSearch} onStatusChange={handleStatusChange} categoriesMap={categoriesMap} />
      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} totalItems={totalItems} perPage={entriesPerPage} />
    </div>
  );
};

export default ChatBotQuestion;
