

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTimes, FaCheck, FaSort, FaSortUp, FaSortDown, FaSortAmountDown } from "react-icons/fa";
import chatbotQuestionAPI from "../../../services/chatbotQuestionAPI";
import { chatbotCategoryAPI } from "../../../services/api";
import DeleteConfirmationModal from "../../../Components/Admin/DeleteConfirmationModal/DeleteConfirmationModal";
import { ModalDialog } from "../../../Components/Admin/Modal/MessageModal";

// safe highlight helper
const highlightMatch = (text, query) => {
  const t = String(text || "");
  if (!query) return t;
  const regex = new RegExp(`(${query})`, "gi");
  return t.split(regex).map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 text-black rounded px-1">{part}</mark>
    ) : (
      part
    )
  );
};

// Filter controls
const FilterControls = ({ entriesPerPage, setEntriesPerPage, searchTerm, setSearchTerm, setCurrentPage }) => (
  <div className="flex items-center justify-between mb-3">
    <select
      value={entriesPerPage}
      onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
      className="border border-gray-300 rounded px-2 py-1 text-sm"
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
      onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
    />
  </div>
);

// TableRow
const TableRow = ({ item, idx, currentPage, entriesPerPage, searchTerm, onStatusChange, categoriesMap, showModal }) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  const handleStatusToggle = async () => {
    setUpdating(true);
    try {
      const newStatus = item.status === "Active" ? "Inactive" : "Active";
      await chatbotQuestionAPI.update(item.id, { status: newStatus });
      onStatusChange();
      setIsConfirmModalOpen(false);
      showModal("success", `Question "${item.en_question}" has been ${newStatus === "Active" ? "activated" : "deactivated"} successfully!`);
    } catch (error) {
      console.error("Error updating question status:", error);
      showModal("error", "Failed to update question status: " + (error.response?.data?.message || error.message));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <tr className="border-b border-gray-300 hover:bg-gray-50 transition-all">
        <td className="p-2">{(currentPage - 1) * entriesPerPage + idx + 1}</td>
        <td className="p-2 font-medium">{categoriesMap[item.category_id]?.en_title || "N/A"}</td>
        <td className="p-2">{highlightMatch(item.en_question, searchTerm)}</td>
        <td className="p-2 font-odia">{highlightMatch(item.od_question, searchTerm)}</td>
        <td className="p-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {item.status}
          </span>
        </td>
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
      </tr>

      {isConfirmModalOpen && (
        <DeleteConfirmationModal
          title={item.status === "Active" ? "Deactivate Question" : "Activate Question"}
          message={`Are you sure you want to ${item.status === "Active" ? "deactivate" : "activate"} "${item.en_question}"?`}
          confirmText={updating ? "Processing..." : (item.status === "Active" ? "Deactivate" : "Activate")}
          cancelText="Cancel"
          onConfirm={handleStatusToggle}
          onClose={() => setIsConfirmModalOpen(false)}
          icon={null}
        />
      )}
    </>
  );
};

// MenuTableBody
const MenuTableBody = ({ loading, data, entriesPerPage, currentPage, searchTerm, onStatusChange, categoriesMap, showModal }) => (
  <table className="min-w-full border border-gray-300 text-sm">
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
        ? Array.from({ length: entriesPerPage }).map((_, idx) => (
            <tr key={idx} className="animate-pulse border-b ">
              <td className="p-2 bg-gray-200 h-4 rounded"></td>
              <td className="p-2 bg-gray-200 h-4 rounded"></td>
              <td className="p-2 bg-gray-200 h-4 rounded"></td>
              <td className="p-2 bg-gray-200 h-4 rounded"></td>
              <td className="p-2 bg-gray-200 h-4 rounded"></td>
              <td className="p-2 bg-gray-200 h-4 rounded"></td>
            </tr>
          ))
        : data.length > 0 ? (
            data.map((item, idx) => (
              <TableRow
                key={item.id}
                item={item}
                idx={idx}
                currentPage={currentPage}
                entriesPerPage={entriesPerPage}
                searchTerm={searchTerm}
                onStatusChange={onStatusChange}
                categoriesMap={categoriesMap}
                showModal={showModal}
              />
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-6 text-gray-500">No questions found.</td>
            </tr>
          )}
    </tbody>
  </table>
);

// Pagination
const Pagination = ({ currentPage, setCurrentPage, totalPages, totalItems, perPage }) => {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = startPage + maxVisible - 1;
    if (endPage > totalPages) { endPage = totalPages; startPage = Math.max(1, endPage - maxVisible + 1); }
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

// Main component with column sorting (click header to toggle)
const ChatBotQuestion = () => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState("info");
  const [modalMessage, setModalMessage] = useState("");

  // sorting state
  const [sortField, setSortField] = useState("en_question"); // 'en_question' | 'od_question' | 'category'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' | 'desc'

  const navigate = useNavigate();

  const categoriesMap = useMemo(() => {
    const map = {};
    categories.forEach((c) => (map[c.id] = c));
    return map;
  }, [categories]);

  const showModal = (variant, message) => {
    setModalVariant(variant);
    setModalMessage(message);
    setModalOpen(true);
  };

  const fetchCategories = async () => {
    try {
      const res = await chatbotCategoryAPI.getAll();
      setCategories(res.data?.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
      showModal("error", "Failed to load categories: " + (error.response?.data?.message || error.message));
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      // send sort params to backend; backend may ignore but client will fallback
      const res = await chatbotQuestionAPI.getAll(currentPage, entriesPerPage, debouncedSearch, sortField, sortOrder);
      const payload = res.data || res;
      setQuestions(payload.questions || payload.data || []);
      setTotalItems(payload.totalQuestions || payload.total || 0);
      setTotalPages(payload.totalPages || Math.ceil((payload.totalQuestions || payload.total || 0) / entriesPerPage) || 0);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setQuestions([]);
      setTotalItems(0);
      setTotalPages(0);
      showModal("error", "Failed to load questions: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchQuestions(); }, [debouncedSearch, currentPage, entriesPerPage, sortField, sortOrder]);
  useEffect(() => { const t = setTimeout(() => setDebouncedSearch(searchTerm), 400); return () => clearTimeout(t); }, [searchTerm]);

  const handleStatusChange = async () => {
    await fetchQuestions();
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  };

  // toggle column sort (click header)
  const handleSortToggle = (field) => {
    setSortField((prevField) => {
      if (prevField === field) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        return prevField;
      } else {
        setSortOrder("asc");
        return field;
      }
    });
    setCurrentPage(1);
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="inline ml-1 text-gray-400" />;
    return sortOrder === "asc" ? <FaSortUp className="inline ml-1 text-gray-700" /> : <FaSortDown className="inline ml-1 text-gray-700" />;
  };

  // client-side fallback sort
  const sortedQuestions = useMemo(() => {
    if (!Array.isArray(questions)) return [];
    const arr = [...questions];
    const dir = sortOrder === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      if (sortField === "en_question") {
        return dir * String(a.en_question || "").localeCompare(String(b.en_question || ""), undefined, { sensitivity: "base" });
      }
      if (sortField === "od_question") {
        return dir * String(a.od_question || "").localeCompare(String(b.od_question || ""), undefined, { sensitivity: "base" });
      }
      if (sortField === "category") {
        const an = categoriesMap[a.category_id]?.en_question || "";
        const bn = categoriesMap[b.category_id]?.en_question || "";
        return dir * String(an).localeCompare(bn, undefined, { sensitivity: "base" });
      }
      return 0;
    });
    return arr;
  }, [questions, sortField, sortOrder, categoriesMap]);

  return (
    <div className="p-4 bg-white shadow rounded-xl overflow-x-auto">
      <ModalDialog open={modalOpen} onClose={() => setModalOpen(false)} variant={modalVariant} message={modalMessage} />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Chatbot Question</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/admin/manage-chatbot/add-question")} className="bg-yellow-400 px-3 py-2 rounded flex items-center gap-2 hover:bg-yellow-500 transition"><FaPlus /> Add Question</button>
        </div>
      </div>

      <FilterControls entriesPerPage={entriesPerPage} setEntriesPerPage={setEntriesPerPage} searchTerm={searchTerm} setSearchTerm={setSearchTerm} setCurrentPage={setCurrentPage} />

      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">SL.No</th>
            <th className="p-2 cursor-pointer select-none" onClick={() => { handleSortToggle("category"); }}>{/* category sort */}
              Category {renderSortIcon("category")}
            </th>
            <th className="p-2 cursor-pointer select-none" onClick={() => { handleSortToggle("en_question"); }}>
              Question (English) {renderSortIcon("en_question")}
            </th>
            <th className="p-2 cursor-pointer select-none" onClick={() => { handleSortToggle("od_question"); }}>
              Question (Odia) {renderSortIcon("od_question")}
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
                <td className="p-2 bg-gray-200 h-4 rounded"></td>
              </tr>
            ))
          ) : sortedQuestions.length > 0 ? (
            sortedQuestions.map((item, idx) => (
              <TableRow
                key={item.id}
                item={item}
                idx={idx}
                currentPage={currentPage}
                entriesPerPage={entriesPerPage}
                searchTerm={debouncedSearch}
                onStatusChange={handleStatusChange}
                categoriesMap={categoriesMap}
                showModal={showModal}
              />
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-6 text-gray-500">No questions found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} totalItems={totalItems} perPage={entriesPerPage} />
    </div>
  );
};

export default ChatBotQuestion;