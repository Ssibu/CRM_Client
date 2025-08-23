import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaSort, FaPlus, FaEdit, FaTimes } from "react-icons/fa";
import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// DND-Kit Imports for Sorting
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, KeyboardSensor, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

//==============================================================================
// 1. HELPER & MODAL COMPONENTS
//==============================================================================

// Helper: highlight search matches
const highlightMatch = (text, query) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 text-black rounded px-1">{part}</mark>
    ) : ( part )
  );
};

// Delete Confirmation Modal Component
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
          <motion.div key="sheet" initial="hidden" animate="visible" exit="exit" variants={sheetVariants} className="fixed z-50 inset-0 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" onMouseDown={onClose}>
            <div className="w-full max-w-2xl mx-auto rounded-xl shadow-2xl bg-white text-gray-900 border border-gray-200 overflow-hidden" onMouseDown={(e) => e.stopPropagation()}>
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 bg-gray-50">
                <div><h3 id="sort-modal-title" className="text-lg font-semibold">{title || "Reorder Items"}</h3></div>
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

const SortableItem = ({ id, item, isDragging, transform, transition, ...props }) => {
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div
      style={style}
      className={`flex items-center gap-4 p-3 rounded-xl cursor-grab shadow-sm ${isDragging ? "ring-2 ring-blue-400/50 bg-white" : "bg-gray-50 hover:bg-gray-100"} border border-gray-200`}
      {...props}
    >
      <div className="p-2 rounded-md bg-gray-200 flex items-center justify-center text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h16" /></svg></div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate text-gray-800">{item.en}</div>
        <div className="text-xs text-gray-500 mt-1 truncate">{item.od}</div>
      </div>
    </div>
  );
};

function SortableRow({ id, item }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div ref={setNodeRef}>
      <SortableItem id={id} item={item} isDragging={isDragging} transform={transform} transition={transition} {...attributes} {...listeners} />
    </div>
  );
}

const SortableList = ({ items = [], onChange }) => {
  const [local, setLocal] = useState(items);
  const [activeId, setActiveId] = useState(null);
  useEffect(() => setLocal(items), [items]);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor));
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (over && active.id !== over.id) {
      const oldIndex = local.findIndex((i) => i.id === active.id);
      const newIndex = local.findIndex((i) => i.id === over.id);
      const newList = arrayMove(local, oldIndex, newIndex);
      setLocal(newList);
      onChange?.(newList);
    }
  };
  const activeItem = useMemo(() => local.find((i) => i.id === activeId), [activeId, local]);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={(e) => setActiveId(e.active.id)} onDragEnd={handleDragEnd} onDragCancel={() => setActiveId(null)}>
      <SortableContext items={local.map((i) => i.id)} strategy={rectSortingStrategy}><div className="flex flex-col gap-3">{local.map((item) => <SortableRow key={item.id} id={item.id} item={item} />)}</div></SortableContext>
      <DragOverlay dropAnimation={{ duration: 160 }}>{activeId && activeItem ? <SortableItem id={activeId} item={activeItem} isDragging /> : null}</DragOverlay>
    </DndContext>
  );
};

const SortController = ({ open, onClose, items = [], onSave }) => {
  const [localItems, setLocalItems] = useState(items);
  useEffect(() => setLocalItems(items), [items]);
  const handleSave = () => { onSave?.(localItems); onClose?.(); };
  return (
    <SortModal isOpen={open} onClose={onClose} title="Reorder Act & Rules" footer={<><button onClick={onClose} className="px-4 py-2 rounded-md text-sm bg-gray-200 hover:bg-gray-300 transition">Cancel</button><button onClick={handleSave} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">Save Order</button></>}>
      <SortableList items={localItems} onChange={setLocalItems} />
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
        <button onClick={onOpenSort} className="bg-gray-700 text-white px-3 py-2 rounded flex items-center gap-2 hover:bg-gray-800 transition"><FaSort /> Sort Items</button>
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
      <td className="p-2"><div className="w-48 h-4 bg-gray-200 rounded"></div></td>
      <td className="p-2"><div className="w-48 h-4 bg-gray-200 rounded"></div></td>
      <td className="p-2"><div className="w-16 h-4 bg-gray-200 rounded"></div></td>
      <td className="p-2"><div className="flex space-x-2"><div className="w-6 h-6 bg-gray-200 rounded-full"></div><div className="w-6 h-6 bg-gray-200 rounded-full"></div></div></td>
    </tr>
);
  
const TableRow = ({ item, idx, currentPage, entriesPerPage, highlightMatch, searchTerm }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const handleDelete = () => { console.log("Deleting item:", item); setIsDeleteModalOpen(false); };
    
    return (
      <>
        <motion.tr className="border-b hover:bg-gray-50 transition-all" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
          <td className="p-2">{(currentPage - 1) * entriesPerPage + idx + 1}</td>
          <td className="p-2">{highlightMatch(item.en, searchTerm)}</td>
          <td className="p-2 font-odia">{highlightMatch(item.od, searchTerm)}</td>
          <td className="p-2"><span className={`px-2 py-1 text-xs rounded-full ${item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.status}</span></td>
          <td className="p-2 flex space-x-2">
            <button onClick={() => setIsDeleteModalOpen(true)} className="text-red-500 hover:text-red-700 transition" title="Delete"><FaTimes /></button>
            <button className="text-blue-500 hover:text-blue-700 transition" title="Edit"><FaEdit /></button>
          </td>
        </motion.tr>
        {isDeleteModalOpen && <DeleteConfirmationModal onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} title="Delete Act/Rule" message={`Are you sure you want to delete "${item.en}"?`} icon={Trash2} confirmText="Delete" cancelText="Cancel"/>}
      </>
    );
};
  
const TableBody = ({ loading, data, entriesPerPage, currentPage, highlightMatch, searchTerm }) => (
    <table className="min-w-full border text-sm">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-2">SL.No</th>
          <th className="p-2">Title (in English)</th>
          <th className="p-2">Title (in Odia)</th>
          <th className="p-2">Status</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>{loading ? Array.from({ length: entriesPerPage }).map((_, idx) => <SkeletonRow key={idx} />) : data.map((item, idx) => <TableRow key={item.id} item={item} idx={idx} currentPage={currentPage} entriesPerPage={entriesPerPage} highlightMatch={highlightMatch} searchTerm={searchTerm}/>)}</tbody>
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

const ActAndRules = () => {
  const sampleData = [
    { id: 1, en: "The Right to Information Act, 2005", od: "ସୂଚନା ଅଧିକାର ଅଧିନିୟମ, ୨୦୦୫", status: "Active" },
    { id: 2, en: "Clinical Establishments (Registration and Regulation) Act, 2010", od: "କ୍ଲିନିକାଲ୍ ଏଷ୍ଟାବ୍ଲିଶମେଣ୍ଟସ୍ (ପଞ୍ଜୀକରଣ ଏବଂ ନିୟନ୍ତ୍ରଣ) ଅଧିନିୟମ, ୨୦୧୦", status: "Active" },
    { id: 3, en: "The Odisha Clinical Establishments (Control and Regulation) Act, 1990", od: "ଓଡ଼ିଶା କ୍ଲିନିକାଲ୍ ଏଷ୍ଟାବ୍ଲିଶମେଣ୍ଟସ୍ (ନିୟନ୍ତ୍ରଣ ଏବଂ ବିନିୟମ) ଅଧିନିୟମ, ୧୯୯୦", status: "Inactive" },
    { id: 4, en: "Medical Termination of Pregnancy Act, 1971", od: "ଗର୍ଭପାତ ଅଧିନିୟମ, ୧୯୭୧", status: "Active" },
    { id: 5, en: "The Epidemic Diseases Act, 1897", od: "ମହାମାରୀ ରୋଗ ଅଧିନିୟମ, ୧୮୯୭", status: "Active" },
    { id: 6, en: "Pre-Conception and Pre-Natal Diagnostic Techniques Act, 1994", od: "ପ୍ରି-କନ୍ସେପସନ୍ ଏବଂ ପ୍ରି-ନାଟାଲ୍ ଡାଇଗ୍ନୋଷ୍ଟିକ୍ ଟେକ୍ନିକ୍ସ ଅଧିନିୟମ, ୧୯୯୪", status: "Active" },
  ];

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showSortModal, setShowSortModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { setTimeout(() => { setItems(sampleData); setLoading(false); }, 1500); }, []);
  useEffect(() => { const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400); return () => clearTimeout(timer); }, [searchTerm]);

  const filteredItems = useMemo(() => items.filter((item) => item.en.toLowerCase().includes(debouncedSearch.toLowerCase()) || item.od.toLowerCase().includes(debouncedSearch.toLowerCase())), [items, debouncedSearch]);
  const totalPages = Math.ceil(filteredItems.length / entriesPerPage);
  const paginatedItems = useMemo(() => { const start = (currentPage - 1) * entriesPerPage; return filteredItems.slice(start, start + entriesPerPage); }, [filteredItems, entriesPerPage, currentPage]);

  const handleSaveOrder = (newOrder) => setItems(newOrder);

  return (
    <div className="p-4 bg-white shadow rounded-xl overflow-x-auto">
      <TableHeader 
        Ltext="Act & Rules List" 
        Rtext="Add Act & Rule" 
       onAdd={() => navigate("/admin/workflow/act-and-rules/add")} 
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

export default ActAndRules;