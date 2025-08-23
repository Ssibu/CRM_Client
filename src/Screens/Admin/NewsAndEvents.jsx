import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTimes, FaFilePdf, FaFileWord, FaFileImage, FaFileAlt } from 'react-icons/fa';
import { Trash2 } from 'lucide-react'; // Often used as the icon for the modal
import MenuTable from "../../Components/Menu/MenuTable"; // Adjust path if needed
import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal/DeleteConfirmationModal"; // <-- 1. IMPORT YOUR MODAL

// --- Dummy Data ---
const dummyData = [
    { id: 1, titleEnglish: "Annual Sports Meet 2025", titleOdia: "ବାର୍ଷିକ କ୍ରୀଡା ମିଟ୍ 2025", eventDate: "2025-11-20", document: "sports_report.pdf", status: "Active" },
    { id: 2, titleEnglish: "Blood Donation Camp Report", titleOdia: "ରକ୍ତଦାନ ଶିବିର ରିପୋର୍ଟ", eventDate: "2025-10-05", document: "blood_drive.docx", status: "Active" },
    { id: 3, titleEnglish: "Inauguration Photos", titleOdia: "ଉଦ୍ଘାଟନ ଫଟୋ", eventDate: "2025-09-15", document: "inauguration.png", status: "Completed" },
    { id: 4, titleEnglish: "Webinar on Digital Marketing", titleOdia: "ଡିଜିଟାଲ୍ ମାର୍କେଟିଂ ଉପରେ ୱେବିନାର୍", eventDate: "2025-08-25", document: "webinar_summary.pdf", status: "Active" },
    { id: 5, titleEnglish: "Foundation Day Celebration Photos", titleOdia: "ପ୍ରତିଷ୍ଠା ଦିବସ ପାଳନ ଫଟୋ", eventDate: "2025-04-01", document: "foundation_day.jpg", status: "Completed" }
];

const NewsAndEvents = () => {
  const [data, setData] = useState(dummyData);
  const navigate = useNavigate();
  
  // --- State for managing the delete modal ---
  const [modalState, setModalState] = useState({ isOpen: false, itemToDelete: null });

  // --- Handler to open the modal ---
  const openDeleteModal = (item) => {
    setModalState({ isOpen: true, itemToDelete: item });
  };

  // --- Handler to close the modal ---
  const closeDeleteModal = () => {
    setModalState({ isOpen: false, itemToDelete: null });
  };

  // --- Handler to confirm deletion ---
  const handleDeleteConfirm = () => {
    if (modalState.itemToDelete) {
      // In a real app, the API call would go here.
      // For now, we'll just filter the dummy data.
      setData(prevData => prevData.filter(item => item.id !== modalState.itemToDelete.id));
      console.log(`Deleting item: ${modalState.itemToDelete.titleEnglish}`);
      closeDeleteModal(); // The modal now closes itself, but this is good practice
    }
  };

  const columns = useMemo(() => [
    {
      header: "SL.No",
      cell: ({ pageContext }) => 
        (pageContext.currentPage - 1) * pageContext.entriesPerPage + pageContext.index + 1,
    },
    // ... other columns (title, date, etc.)
    {
      header: "Title (In English)",
      accessor: "titleEnglish",
      isSearchable: true,
    },
    {
      header: "Title (In Odia)",
      accessor: "titleOdia",
      isSearchable: true,
    },
    {
      header: "Event Date",
      accessor: "eventDate",
    },
    {
      header: "Document",
      accessor: "document",
      cell: ({ row }) => {
        const filename = row.original.document || '';
        const extension = filename.split('.').pop().toLowerCase();
        const getIcon = () => {
          if (['pdf'].includes(extension)) return <FaFilePdf className="text-red-500" size={22} />;
          if (['doc', 'docx'].includes(extension)) return <FaFileWord className="text-blue-500" size={22} />;
          if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return <FaFileImage className="text-green-500" size={22} />;
          return <FaFileAlt className="text-gray-500" size={22} />;
        };
        return <a href={`/uploads/documents/${filename}`} target="_blank" rel="noopener noreferrer" title={filename}>{getIcon()}</a>;
      },
    },
    {
      header: "Status",
      accessor: "status",
      cell: ({ row }) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${row.original.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{row.original.status}</span>
      ),
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          {/* This button now opens our managed modal */}
          <button onClick={() => openDeleteModal(row.original)} className="text-red-500 hover:text-red-700" title="Delete">
            <FaTimes />
          </button>
          <button onClick={() => navigate(`/admin/workflow/news-and-events/edit/${row.original.id}`)} className="text-blue-500 hover:text-blue-700" title="Edit">
            <FaEdit />
          </button>
        </div>
      ),
    },
  ], [navigate]);

  return (
    <div className="min-h-[80vh] py-4 font-sans">
      <MenuTable 
        Ltext="News & Events List" 
        Rtext="Add New Event" 
        data={data}
        columns={columns}
        addPath="/admin/workflow/news-and-events/add"
      />

      {/* --- Render the modal conditionally based on state --- */}
      {modalState.isOpen && (
        <DeleteConfirmationModal
          onClose={closeDeleteModal}
          onConfirm={handleDeleteConfirm}
          title="Confirm Deletion"
          message={`Are you sure you want to delete "${modalState.itemToDelete?.titleEnglish}"? This action cannot be undone.`}
          icon={Trash2} // Pass a specific icon if you like
        />
      )}
    </div>
  );
};

export default NewsAndEvents;