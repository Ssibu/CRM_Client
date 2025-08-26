import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaToggleOn, FaToggleOff, FaFilePdf, FaFileWord, FaFileImage, FaFileAlt, FaFileExcel } from 'react-icons/fa';
import { VscVmActive } from "react-icons/vsc";
import axios from 'axios';

// --- Import your reusable components ---
import MenuTable from "../../Components/Menu/MenuTable";
import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal/DeleteConfirmationModal";
import SortMenuController from '../../Components/SortModal/SortMenuController';

// Define the API endpoint for News & Events
const API_URL = "http://localhost:8080/api/news-and-events";

const NewsAndEvents = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  
  // State for managing modals
  const [modalState, setModalState] = useState({ isOpen: false, itemToToggle: null, nextStatus: '' });
  const [showSortModal, setShowSortModal] = useState(false);

  // --- API Functions ---
  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching News & Events:", error);
    }
  };

  const handleToggleConfirm = async () => {
    if (modalState.itemToToggle) {
      try {
        await axios.patch(`${API_URL}/status/${modalState.itemToToggle.id}`);
        fetchData(); // Refetch all data to update the list
        alert(`Status changed to "${modalState.nextStatus}" successfully!`);
      } catch (error) {
        console.error("Error toggling status:", error);
        alert("Failed to update status.");
      } finally {
        closeToggleModal();
      }
    }
  };
  
  const handleSaveOrder = async (newOrder) => {
    const orderIds = newOrder.map(item => item.id);
    try {
      await axios.put(`${API_URL}/order`, { order: orderIds });
      setData(newOrder);
      setShowSortModal(false);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Modal handler functions
  const openToggleModal = (item) => {
    const nextStatus = item.status === 'Active' ? 'Inactive' : 'Active';
    setModalState({ isOpen: true, itemToToggle: item, nextStatus: nextStatus });
  };
  const closeToggleModal = () => setModalState({ isOpen: false, itemToToggle: null, nextStatus: '' });

  // --- Define the table structure ---
  const columns = useMemo(() => [
    {
      header: "SL.No",
      cell: ({ pageContext }) => 
        (pageContext.currentPage - 1) * pageContext.entriesPerPage + pageContext.index + 1,
    },
    { header: "Title (In English)", accessor: "titleEnglish", isSearchable: true },
    { header: "Title (In Odia)", accessor: "titleOdia", isSearchable: true },
    { header: "Event Date", accessor: "eventDate" },
    {
      header: "Document",
      accessor: "document",
      cell: ({ row }) => {
        const filename = row.original.document || '';
        const extension = filename.split('.').pop().toLowerCase();
        const getIcon = () => {
          if (['pdf'].includes(extension)) return <FaFilePdf className="text-red-500" size={22} />;
          if (['doc', 'docx'].includes(extension)) return <FaFileWord className="text-blue-500" size={22} />;
          if (['xls', 'xlsx'].includes(extension)) return <FaFileExcel className="text-green-700" size={22} />;
          if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return <FaFileImage className="text-green-500" size={22} />;
          return <FaFileAlt className="text-gray-500" size={22} />;
        };
        const fileUrl = `http://localhost:8080/uploads/${filename}`;
        return <a href={fileUrl} target="_blank" rel="noopener noreferrer" title={filename}>{getIcon()}</a>;
      },
    },
    {
      header: "Status",
      accessor: "status",
      cell: ({ row }) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          row.original.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {row.original.status}
        </span>
      ),
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => openToggleModal(row.original)} 
            className={row.original.status === 'Active' ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'} 
            title={`Set to ${row.original.status === 'Active' ? 'Inactive' : 'Active'}`}
          >
            {row.original.status === 'Active' ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
          </button>
          <button 
            onClick={() => navigate(`/admin/workflow/news-and-events/edit/${row.original.id}`)} 
            className="text-blue-500 hover:text-blue-700" 
            title="Edit"
          >
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
        onOpenSort={() => setShowSortModal(true)}
      />

      <SortMenuController
        open={showSortModal}
        onClose={() => setShowSortModal(false)}
        items={data}
        onSave={handleSaveOrder}
        title="Reorder News & Events"
        displayKey="titleEnglish"
        secondaryKey="titleOdia"
      />

      {modalState.isOpen && (
        <DeleteConfirmationModal
          onClose={closeToggleModal}
          onConfirm={handleToggleConfirm}
          title="Confirm Status Change"
          message={`Are you sure you want to change the status of "${modalState.itemToToggle?.titleEnglish}" to "${modalState.nextStatus}"?`}
          icon={VscVmActive}
          confirmText={`Yes, Set to ${modalState.nextStatus}`}
          cancelText="No, Cancel"
        />
      )}
    </div>
  );
};

export default NewsAndEvents;