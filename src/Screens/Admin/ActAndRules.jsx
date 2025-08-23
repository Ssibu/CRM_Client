import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTimes } from 'react-icons/fa';
import { Trash2 } from 'lucide-react';
import MenuTable from "../../Components/Menu/MenuTable"; // Adjust path to your reusable component
import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal/DeleteConfirmationModal"; // Adjust path to your modal

// --- Dummy Data that matches the Act & Rules structure ---
const dummyData = [
    { id: 1, titleEnglish: "The Right to Information Act, 2005", titleOdia: "ସୂଚନା ଅଧିକାର ଅଧିନିୟମ, ୨୦୦୫", status: "Active" },
    { id: 2, titleEnglish: "Clinical Establishments (Registration and Regulation) Act, 2010", titleOdia: "କ୍ଲିନିକାଲ୍ ଏଷ୍ଟାବ୍ଲିଶମେଣ୍ଟସ୍ ଅଧିନିୟମ, ୨୦୧୦", status: "Active" },
    { id: 3, titleEnglish: "The Odisha Clinical Establishments Act, 1990", titleOdia: "ଓଡ଼ିଶା କ୍ଲିନିକାଲ୍ ଏଷ୍ଟାବ୍ଲିଶମେଣ୍ଟସ୍ ଅଧିନିୟମ, ୧୯୯୦", status: "Inactive" },
    { id: 4, titleEnglish: "Medical Termination of Pregnancy Act, 1971", titleOdia: "ଗର୍ଭପାତ ଅଧିନିୟମ, ୧୯୭୧", status: "Active" },
    { id: 5, titleEnglish: "The Epidemic Diseases Act, 1897", titleOdia: "ମହାମାରୀ ରୋଗ ଅଧିନିୟମ, ୧୮୯୭", status: "Active" },
];

const ActAndRules = () => {
  const [data, setData] = useState(dummyData);
  const navigate = useNavigate();
  
  // State for managing the delete modal
  const [modalState, setModalState] = useState({ isOpen: false, itemToDelete: null });

  // Handler to open the modal
  const openDeleteModal = (item) => {
    setModalState({ isOpen: true, itemToDelete: item });
  };

  // Handler to close the modal
  const closeDeleteModal = () => {
    setModalState({ isOpen: false, itemToDelete: null });
  };

  // Handler to confirm deletion
  const handleDeleteConfirm = () => {
    if (modalState.itemToDelete) {
      // For now, we'll just filter the dummy data.
      setData(prevData => prevData.filter(item => item.id !== modalState.itemToDelete.id));
      console.log(`Deleting item: ${modalState.itemToDelete.titleEnglish}`);
    }
  };

  // --- Define the table structure for Act & Rules ---
  // The accessor properties MUST match the keys in dummyData
  const columns = useMemo(() => [
    {
      header: "SL.No",
      cell: ({ pageContext }) => 
        (pageContext.currentPage - 1) * pageContext.entriesPerPage + pageContext.index + 1,
    },
    {
      header: "Title (in English)",
      accessor: "titleEnglish",
      isSearchable: true,
    },
    {
      header: "Title (in Odia)",
      accessor: "titleOdia",
      isSearchable: true,
    },
    {
      header: "Status",
      accessor: "status",
      cell: ({ row }) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          row.original.status === 'Active' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {row.original.status}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button onClick={() => openDeleteModal(row.original)} className="text-red-500 hover:text-red-700" title="Delete">
            <FaTimes />
          </button>
          <button onClick={() => navigate(`/admin/workflow/act-and-rules/edit/${row.original.id}`)} className="text-blue-500 hover:text-blue-700" title="Edit">
            <FaEdit />
          </button>
        </div>
      ),
    },
  ], [navigate]);

  return (
    <div className="min-h-[80vh] py-4 font-sans">
      <MenuTable 
        Ltext="Act & Rules List" 
        Rtext="Add Act & Rule" 
        data={data}
        columns={columns}
        addPath="/admin/workflow/act-and-rules/add"
      />

      {/* --- Render the modal conditionally based on state --- */}
      {modalState.isOpen && (
        <DeleteConfirmationModal
          onClose={closeDeleteModal}
          onConfirm={handleDeleteConfirm}
          title="Confirm Deletion"
          message={`Are you sure you want to delete "${modalState.itemToDelete?.titleEnglish}"?`}
          icon={Trash2}
        />
      )}
    </div>
  );
};

export default ActAndRules;