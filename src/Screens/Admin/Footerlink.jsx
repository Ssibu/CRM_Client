import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaSort, FaPlus, FaEdit, FaTimes } from "react-icons/fa";
import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// DND-Kit Imports
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, KeyboardSensor, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Define your API's base URL
const API_URL = "http://localhost:8080/api/footerlinks"; // Adjust port if needed

//==============================================================================
// 1. HELPER & MODAL COMPONENTS
//==============================================================================

const highlightMatch = (text, query) => {
  if (!query || !text) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 text-black rounded px-1">{part}</mark>
    ) : ( part )
  );
};

const DeleteConfirmationModal = ({ onClose, onConfirm, title, message, icon: Icon, confirmText, cancelText }) => (
 <AnimatePresence>
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <motion.div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}>
            <div className="flex flex-col items-center text-center">
                <div className="bg-red-100 p-3 rounded-full"><Icon className="text-red-500" size={24} /></div>
                <h3 className="text-lg font-semibold mt-4">{title}</h3>
                <p className="text-sm text-gray-600 mt-2">{message}</p>
            </div>
            <div className="flex justify-center gap-4 mt-6">
                <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">{cancelText}</button>
                <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">{confirmText}</button>
            </div>
        </motion.div>
    </div>
 </AnimatePresence>
);

//==============================================================================
// 2. SORT MODAL COMPONENTS
//==============================================================================

const SortModal = ({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    if (isOpen) { document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
  const sheetVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.98 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 28 } },
    exit: { y: 30, opacity: 0, scale: 0.98, transition: { duration: 0.15 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="backdrop" initial="hidden" animate="visible" exit="exit" variants={backdropVariants} className="fixed inset-0 z-40 flex items-center justify-center bg-black/50" onMouseDown={onClose} />
          <motion.div key="sheet" initial="hidden" animate="visible" exit="exit" variants={sheetVariants} className="fixed z-50 inset-0 flex items-center justify-center p-4 sm:p-6" role="dialog" onMouseDown={onClose}>
            <div className="w-full max-w-2xl mx-auto rounded-xl shadow-2xl bg-white text-gray-900 border border-gray-200 overflow-hidden" onMouseDown={(e) => e.stopPropagation()}>
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 bg-gray-50">
                <div><h3 className="text-lg font-semibold">{title || "Reorder Items"}</h3></div>
                <button onClick={onClose} aria-label="Close" className="p-2 rounded-full hover:bg-gray-200 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">{children}</div>
              {footer && <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">{footer}</div>}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const SortableItem = ({ item, isDragging, transform, transition, ...props }) => {
    const style = { transform: CSS.Transform.toString(transform), transition };
    return (
      <div
        style={style}
        className={`flex items-center gap-4 p-3 rounded-xl cursor-grab shadow-sm ${isDragging ? "ring-2 ring-blue-400/50 bg-white" : "bg-gray-50 hover:bg-gray-100"} border border-gray-200`}
        {...props}
      >
        <div className="p-2 rounded-md bg-gray-200 flex items-center justify-center text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h16" /></svg></div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate text-gray-800">{item.englishLinkText}</div>
          <div className="text-xs text-gray-500 mt-1 truncate">{item.odiaLinkText}</div>
        </div>
      </div>
    );
};

function SortableRow({ id, item }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return <div ref={setNodeRef}><SortableItem id={id} item={item} isDragging={isDragging} transform={transform} transition={transition} {...attributes} {...listeners} /></div>;
}

const SortableList = ({ items = [], onChange }) => {
  const [localItems, setLocalItems] = useState(items);
  const [activeId, setActiveId] = useState(null);
  useEffect(() => setLocalItems(items), [items]);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor));
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (over && active.id !== over.id) {
      const oldIndex = localItems.findIndex((i) => i.id === active.id);
      const newIndex = localItems.findIndex((i) => i.id === over.id);
      const newOrder = arrayMove(localItems, oldIndex, newIndex);
      setLocalItems(newOrder); // Update local state for smooth UI
      onChange?.(newOrder);
    }
  };
  const activeItem = useMemo(() => localItems.find((i) => i.id === activeId), [activeId, localItems]);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={(e) => setActiveId(e.active.id)} onDragEnd={handleDragEnd} onDragCancel={() => setActiveId(null)}>
      <SortableContext items={localItems.map((i) => i.id)} strategy={rectSortingStrategy}><div className="flex flex-col gap-3">{localItems.map((item) => <SortableRow key={item.id} id={item.id} item={item} />)}</div></SortableContext>
      <DragOverlay dropAnimation={{ duration: 160 }}>{activeId && activeItem ? <SortableItem item={activeItem} isDragging /> : null}</DragOverlay>
    </DndContext>
  );
};

const SortController = ({ open, onClose, items = [], onSave }) => {
  const [sortedItems, setSortedItems] = useState(items);
  useEffect(() => setSortedItems(items), [items]);
  const handleSave = () => { onSave?.(sortedItems); onClose?.(); };
  return (
    <SortModal isOpen={open} onClose={onClose} title="Reorder Footer Links" footer={<><button onClick={onClose} className="px-4 py-2 rounded-md text-sm bg-gray-200 hover:bg-gray-300 transition">Cancel</button><button onClick={handleSave} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">Save Order</button></>}>
      <SortableList items={sortedItems} onChange={setSortedItems} />
    </SortModal>
  );
};

//==============================================================================
// 3. TABLE STRUCTURE COMPONENTS
//==============================================================================

const TableHeader = ({ Ltext, Rtext, onAdd, onOpenSort }) => (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">{Ltext}</h2>
      <div className="flex space-x-2">
        <button onClick={onOpenSort} className="bg-gray-700 text-white px-3 py-2 rounded flex items-center gap-2 hover:bg-gray-800 transition"><FaSort /> Sort Links</button>
        <button onClick={onAdd} className="bg-yellow-400 px-3 py-2 rounded flex items-center gap-2 hover:bg-yellow-500 transition"><FaPlus /> {Rtext}</button>
      </div>
    </div>
);
  
const FilterControls = ({ entriesPerPage, setEntriesPerPage, searchTerm, setSearchTerm, setCurrentPage }) => (
    <div className="flex items-center justify-between mb-3">
        <select value={entriesPerPage} onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }} className="border rounded px-2 py-1 text-sm">
            <option value={5}>5</option><option value={10}>10</option><option value={20}>20</option>
        </select>
        <input type="text" placeholder="Search..." className="border px-2 py-1 text-sm rounded" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}/>
    </div>
);
  
const SkeletonRow = () => (
    <tr className="animate-pulse border-b">
      <td className="p-2"><div className="w-6 h-4 bg-gray-200 rounded"></div></td>
      <td className="p-2"><div className="w-32 h-4 bg-gray-200 rounded"></div></td>
      <td className="p-2"><div className="w-32 h-4 bg-gray-200 rounded"></div></td>
      <td className="p-2"><div className="w-20 h-4 bg-gray-200 rounded"></div></td>
      <td className="p-2"><div className="w-16 h-4 bg-gray-200 rounded"></div></td>
      <td className="p-2"><div className="flex space-x-2"><div className="w-6 h-6 bg-gray-200 rounded-full"></div><div className="w-6 h-6 bg-gray-200 rounded-full"></div></div></td>
    </tr>
);
  
const TableRow = ({ item, idx, currentPage, entriesPerPage, highlightMatch, searchTerm, onDelete }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const handleDelete = () => {
        onDelete(item.id);
        setIsDeleteModalOpen(false);
    };
    
    return (
      <>
        <motion.tr className="border-b hover:bg-gray-50 transition-all" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
          <td className="p-2">{(currentPage - 1) * entriesPerPage + idx + 1}</td>
          <td className="p-2">{highlightMatch(item.englishLinkText, searchTerm)}</td>
          <td className="p-2 font-odia">{highlightMatch(item.odiaLinkText, searchTerm)}</td>
          <td className="p-2">{item.linkType}</td>
          <td className="p-2"><span className={`px-2 py-1 text-xs rounded-full ${item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.status}</span></td>
          <td className="p-2 flex space-x-2">
            <button onClick={() => setIsDeleteModalOpen(true)} className="text-red-500 hover:text-red-700 transition" title="Delete"><FaTimes /></button>
            <button className="text-blue-500 hover:text-blue-700 transition" title="Edit"><FaEdit /></button>
          </td>
        </motion.tr>
        {isDeleteModalOpen && <DeleteConfirmationModal onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} title="Delete Footer Link" message={`Are you sure you want to delete "${item.englishLinkText}"?`} icon={Trash2} confirmText="Delete" cancelText="Cancel"/>}
      </>
    );
};
  
const TableBody = ({ loading, data, entriesPerPage, currentPage, highlightMatch, searchTerm, onDelete }) => (
    <table className="min-w-full border text-sm">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-2">SL.No</th>
          <th className="p-2">English Link</th>
          <th className="p-2">Odia Link</th>
          <th className="p-2">Link Type</th>
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
                onDelete={onDelete}
              />
            ))}
      </tbody>
    </table>
);
  
const Pagination = ({ currentPage, setCurrentPage, totalPages, totalItems, perPage }) => {
    const start = (currentPage - 1) * perPage + 1;
    const end = Math.min(currentPage * perPage, totalItems);
    const getPageNumbers = () => {
      const pages = []; const maxVisible = 5; let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2)); let endPage = startPage + maxVisible - 1; if (endPage > totalPages) { endPage = totalPages; startPage = Math.max(1, endPage - maxVisible + 1); } for (let i = startPage; i <= endPage; i++) pages.push(i); return pages;
    };
    return (
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <div>Showing {totalItems === 0 ? 0 : start} to {end} of {totalItems} entries</div>
        <div className="flex gap-1">
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
          {getPageNumbers().map((page) => <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 border rounded ${currentPage === page ? "bg-gray-300 font-bold" : ""}`}>{page}</button>)}
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    );
};

//==============================================================================
// 4. MAIN COMPONENT
//==============================================================================

const Footerlink = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showSortModal, setShowSortModal] = useState(false);
  const navigate = useNavigate();

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching footer links:", error);
      alert("Failed to fetch data. Please check the console.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this link?")) {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchLinks();
            alert("Link deleted successfully!");
        } catch (error) {
            console.error("Error deleting link:", error);
            alert("Failed to delete link.");
        }
    }
  };

  const handleSaveOrder = async (newOrder) => {
    const orderIds = newOrder.map(item => item.id);
    try {
      await axios.put(`${API_URL}/order`, { order: orderIds });
      setItems(newOrder);
      alert("Order updated successfully!");
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order.");
    }
  };

  const filteredItems = useMemo(() =>
    items.filter(item => {
      const lowercasedSearch = debouncedSearch.toLowerCase();
      const englishText = (item.englishLinkText || '').toLowerCase();
      const odiaText = (item.odiaLinkText || '').toLowerCase();
      return englishText.includes(lowercasedSearch) || odiaText.includes(lowercasedSearch);
    }),
    [items, debouncedSearch]
  );
    
  const totalPages = Math.ceil(filteredItems.length / entriesPerPage);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredItems.slice(start, start + entriesPerPage);
  }, [filteredItems, entriesPerPage, currentPage]);


  return (
    <div className="p-4 bg-white shadow rounded-xl overflow-x-auto">
      <TableHeader
        Ltext="Footer Link List"
        Rtext="Add New Link"
        onAdd={() => navigate("/admin/workflow/footerlink/add")}
        onOpenSort={() => setShowSortModal(true)}
      />
      <FilterControls
        entriesPerPage={entriesPerPage}
        setEntriesPerPage={setEntriesPerPage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setCurrentPage={setCurrentPage}
      />
      <TableBody
        loading={loading}
        data={paginatedItems}
        entriesPerPage={entriesPerPage}
        currentPage={currentPage}
        highlightMatch={highlightMatch}
        searchTerm={debouncedSearch}
        onDelete={handleDeleteItem}
      />
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        totalItems={filteredItems.length}
        perPage={entriesPerPage}
      />
      <SortController
        open={showSortModal}
        onClose={() => setShowSortModal(false)}
        items={items}
        onSave={handleSaveOrder}
      />
    </div>
  );
};

export default Footerlink;