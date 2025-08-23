// components/MenuTable/MenuTable.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TableHeader from "./TableHeader";
import FilterControls from "./FilterControls";
import Pagination from "./Pagination";
import SortMenuController from "../SortModal/SortMenuController";
import MenuTableBody from "./MenuTableBody";

// ✅ Helper: highlight search matches
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

const MenuTable = ({ Ltext, Rtext, data = [] }) => {
  const [loading, setLoading] = useState(true);
  const [menus, setMenus] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showSortModal, setShowSortModal] = useState(false);
  const navigate = useNavigate();

  // Load data
  useEffect(() => {
    setTimeout(() => {
      setMenus(data || []);
      setLoading(false);
    }, 1500);
  }, [data]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter menus
  const filteredMenus = useMemo(() => {
    return menus.filter(
      (item) =>
        item.en.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.od.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [menus, debouncedSearch]);

  // Pagination logic
  const totalPages = Math.ceil(filteredMenus.length / entriesPerPage);
  const paginatedMenus = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredMenus.slice(start, start + entriesPerPage);
  }, [filteredMenus, entriesPerPage, currentPage]);

  // Save new sort order
  const handleSaveOrder = (newItems) => {
    setMenus(newItems);
  };

  return (
    <div className="p-4 bg-white shadow rounded-xl overflow-x-auto">
      {/* Header */}
      <TableHeader
        Ltext={Ltext}
        Rtext={Rtext}
        onAdd={() => navigate("/admin/membership")}
        onOpenSort={() => setShowSortModal(true)}
      />

      {/* Filters */}
      <FilterControls
        entriesPerPage={entriesPerPage}
        setEntriesPerPage={setEntriesPerPage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setCurrentPage={setCurrentPage}
      />

      {/* Table Component */}
      <MenuTableBody
        loading={loading}
        data={paginatedMenus}
        entriesPerPage={entriesPerPage}
        currentPage={currentPage}
        highlightMatch={highlightMatch}
        searchTerm={debouncedSearch}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        totalItems={filteredMenus.length}
        perPage={entriesPerPage}
      />

      {/* Sort Modal */}
      <SortMenuController
        open={showSortModal}
        onClose={() => setShowSortModal(false)}
        items={menus}
        onSave={handleSaveOrder}
      />
    </div>
  );
};

export default MenuTable;
