import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaSort, FaPlus, FaEdit, FaTimes, FaFilePdf, FaFileWord, FaFileImage } from "react-icons/fa";
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
// 2. SORT MODAL COMPONENTS (User Provided)
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

const SortableItem = ({ id, item, listeners, attributes, isDragging, transform, transition }) => {
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.995 }}
      className={`flex items-center gap-4 p-3 rounded-xl cursor-grab shadow-sm ${isDragging ? "ring-2 ring-yellow-400/50 bg-white" : "bg-gray-50 hover:bg-gray-100"} border border-gray-200`}
      style={style} {...listeners} {...attributes} role="button" aria-label={`Drag ${item.en}`}
    >
      <div className="p-2 rounded-md bg-gray-200 flex items-center justify-center text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h16" /></svg></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between"><div className="text-sm font-medium truncate text-gray-800">{item.en}</div><div className="text-xs text-gray-500">{item.status || ""}</div></div>
        <div className="text-xs text-gray-500 mt-1 truncate">{item.od}</div>
      </div>
    </motion.div>
  );
};

function SortableRow({ id, item }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return <div ref={setNodeRef}><SortableItem id={id} item={item} listeners={listeners} attributes={attributes} isDragging={isDragging} transform={transform} transition={transition} /></div>;
}

const SortableList = ({ items = [], onChange }) => {
  const [local, setLocal] = useState(items);
  const [activeId, setActiveId] = useState(null);
  useEffect(() => setLocal(items), [items]);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor));
  const handleDragStart = (event) => setActiveId(event.active.id);
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
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={() => setActiveId(null)}>
      <SortableContext items={local.map((i) => i.id)} strategy={rectSortingStrategy}><div className="flex flex-col gap-3">{local.map((item) => <SortableRow key={item.id} id={item.id} item={item} />)}</div></SortableContext>
      <DragOverlay dropAnimation={{ duration: 160 }}>{activeId && activeItem ? <SortableItem id={activeId} item={activeItem} isDragging /> : null}</DragOverlay>
    </DndContext>
  );
};

const SortMenuController = ({ open, onClose, items = [], onSave }) => {
  const [localItems, setLocalItems] = useState(items);
  React.useEffect(() => setLocalItems(items), [items]);
  const handleChange = (newList) => setLocalItems(newList);
  const handleSave = () => { onSave?.(localItems); onClose?.(); };
  return (
    <SortModal isOpen={open} onClose={onClose} title="Reorder News & Events" footer={<><button onClick={onClose} className="px-4 py-2 rounded-md text-sm bg-gray-200 hover:bg-gray-300 transition">Cancel</button><button onClick={handleSave} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">Save Order</button></>}>
      <SortableList items={localItems} onChange={handleChange} />
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
      <td className="p-2"><div className="w-6 h-4 bg-gray-200 rounded"></div></td><td className="p-2"><div className="w-40 h-4 bg-gray-200 rounded"></div></td><td className="p-2"><div className="w-40 h-4 bg-gray-200 rounded"></div></td><td className="p-2"><div className="w-24 h-4 bg-gray-200 rounded"></div></td><td className="p-2"><div className="w-8 h-8 bg-gray-200 rounded"></div></td><td className="p-2"><div className="w-16 h-4 bg-gray-200 rounded"></div></td><td className="p-2"><div className="flex space-x-2"><div className="w-6 h-6 bg-gray-200 rounded-full"></div><div className="w-6 h-6 bg-gray-200 rounded-full"></div></div></td>
    </tr>
);
  
const TableRow = ({ item, idx, currentPage, entriesPerPage, highlightMatch, searchTerm }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const handleDelete = () => { console.log("Deleting event:", item); setIsDeleteModalOpen(false); };
    
    // Logic to determine which document icon to show
    const getDocumentIcon = (filename) => {
        const extension = filename.split('.').pop().toLowerCase();
        if (['pdf'].includes(extension)) return <FaFilePdf className="text-red-500" size={24} />;
        if (['doc', 'docx'].includes(extension)) return <FaFileWord className="text-blue-500" size={24} />;
        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return <FaFileImage className="text-green-500" size={24} />;
        return <FaFilePdf className="text-gray-500" size={24} />; // Default icon
    };

    return (
      <>
        <motion.tr className="border-b hover:bg-gray-50 transition-all" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
          <td className="p-2">{(currentPage - 1) * entriesPerPage + idx + 1}</td><td className="p-2">{highlightMatch(item.en, searchTerm)}</td><td className="p-2 font-odia">{highlightMatch(item.od, searchTerm)}</td><td className="p-2">{item.date}</td>
          <td className="p-2">
            <a href={`/path/to/documents/${item.document}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-75" title={item.document}>
                {getDocumentIcon(item.document)}
            </a>
          </td>
          <td className="p-2 text-green-600 font-semibold">{item.status}</td>
          <td className="p-2 flex space-x-2"><button onClick={() => setIsDeleteModalOpen(true)} className="text-red-500 hover:text-red-700 transition"><FaTimes /></button><button className="text-blue-500 hover:text-blue-700 transition"><FaEdit /></button></td>
        </motion.tr>
        {isDeleteModalOpen && <DeleteConfirmationModal onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} title="Delete Event" message={`Are you sure you want to delete "${item.en}"? This action cannot be undone.`} icon={Trash2} confirmText="Delete" cancelText="Cancel"/>}
      </>
    );
};
  
const TableBody = ({ loading, data, entriesPerPage, currentPage, highlightMatch, searchTerm }) => (
    <table className="min-w-full border text-sm">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-2">SL.No</th><th className="p-2">Title (In English)</th><th className="p-2">Title (In Odia)</th><th className="p-2">Date</th><th className="p-2">Document</th><th className="p-2">Status</th><th className="p-2">Action</th>
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
    const pageNumbers = getPageNumbers();
    return (
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <div>Showing {totalItems === 0 ? 0 : start} to {end} of {totalItems} entries</div>
        <div className="flex gap-1">
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
          {pageNumbers.map((page) => <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 border rounded ${currentPage === page ? "bg-gray-300 font-bold" : ""}`}>{page}</button>)}
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    );
};

//==============================================================================
// 4. MAIN COMPONENT
//==============================================================================

const NewsAndEvents = () => {
  const sampleData = [
    { id: 1, en: "Annual Sports Meet 2025", od: "ବାର୍ଷିକ କ୍ରୀଡା ମିଟ୍ 2025", date: "2025-11-20", document: "sports_report.pdf", status: "Active" },
    { id: 2, en: "Blood Donation Camp Report", od: "ରକ୍ତଦାନ ଶିବିର ରିପୋର୍ଟ", date: "2025-10-05", document: "blood_drive.docx", status: "Active" },
    { id: 3, en: "Inauguration of New Building Photos", od: "ନୂତନ ବିଲ୍ଡିଂର ଉଦ୍ଘାଟନ ଫଟୋ", date: "2025-09-15", document: "inauguration.png", status: "Completed" },
    { id: 4, en: "Webinar on Digital Marketing", od: "ଡିଜିଟାଲ୍ ମାର୍କେଟିଂ ଉପରେ ୱେବିନାର୍", date: "2025-08-25", document: "webinar_summary.pdf", status: "Active" },
    { id: 5, en: "Cultural Fest 'Utsav 2025' Brochure", od: "ସାଂସ୍କୃତିକ ଉତ୍ସବ 'ଉତ୍ସବ 2025' ବ୍ରୋଚର୍", date: "2025-12-22", document: "utsav_brochure.pdf", status: "Active" },
    { id: 6, en: "Free Health Check-up Camp Notice", od: "ମାଗଣା ସ୍ୱାସ୍ଥ୍ୟ ପରୀକ୍ଷା ଶିବିର", date: "2025-07-18", document: "health_camp.docx", status: "Completed" },
    { id: 7, en: "Foundation Day Celebration Photos", od: "ପ୍ରତିଷ୍ଠା ଦିବସ ପାଳନ ଫଟୋ", date: "2025-04-01", document: "foundation_day.jpg", status: "Completed" },
    { id: 8, en: "Guest Lecture by Dr. Sharma", od: "ଡ. ଶର୍ମାଙ୍କ ଦ୍ୱାରା ଅତିଥି ବକ୍ତୃତା", date: "2025-10-30", document: "lecture_notes.pdf", status: "Active" },
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
<TableHeader Ltext="News & Events List" Rtext="Add New Event" onAdd={() => navigate("/admin/workflow/news-and-events/add")} onOpenSort={() => setShowSortModal(true)} />      <FilterControls entriesPerPage={entriesPerPage} setEntriesPerPage={setEntriesPerPage} searchTerm={searchTerm} setSearchTerm={setSearchTerm} setCurrentPage={setCurrentPage} />
      <TableBody loading={loading} data={paginatedItems} entriesPerPage={entriesPerPage} currentPage={currentPage} highlightMatch={highlightMatch} searchTerm={debouncedSearch} />
      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} totalItems={filteredItems.length} perPage={entriesPerPage} />
      
      <SortMenuController open={showSortModal} onClose={() => setShowSortModal(false)} items={items} onSave={handleSaveOrder} />
    </div>
  );
};

export default NewsAndEvents;