
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
  if (!query || typeof text !== 'string') return text;
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

const MenuTable = ({ Ltext, Rtext, data = [], columns = [], addPath  }) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showSortModal, setShowSortModal] = useState(false);
  const navigate = useNavigate();

  // Load data
  useEffect(() => {
      setItems(data || []);
      setLoading(false);
  
  }, [data]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter items based on searchable columns
  const filteredItems = useMemo(() => {
    if (!debouncedSearch) return items;
    return items.filter((item) =>
      columns.some((column) => {
        if (column.isSearchable) {
          const value = item[column.accessor];
          return (
            value &&
            value.toString().toLowerCase().includes(debouncedSearch.toLowerCase())
          );
        }
        return false;
      })
    );
  }, [items, debouncedSearch, columns]);

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / entriesPerPage);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredItems.slice(start, start + entriesPerPage);
  }, [filteredItems, entriesPerPage, currentPage]);

  // Save new sort order
  const handleSaveOrder = (newItems) => {
    setItems(newItems);
  };

    const handleAdd = addPath ? () => navigate(addPath) : null;


  return (
    <div className="p-4 bg-white shadow rounded-xl overflow-x-auto">
      {/* Header */}
      <TableHeader
        Ltext={Ltext}
        Rtext={Rtext}
                onAdd={handleAdd}

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
        columns={columns}
        data={paginatedItems}
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
        totalItems={filteredItems.length}
        perPage={entriesPerPage}
      />

      {/* Sort Modal */}
      <SortMenuController
        open={showSortModal}
        onClose={() => setShowSortModal(false)}
        items={items}
        onSave={handleSaveOrder}
      />
    </div>
  );
};

export default MenuTable;