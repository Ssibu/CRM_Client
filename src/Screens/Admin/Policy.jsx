import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaToggleOn, FaToggleOff, FaFilePdf, FaFileWord, FaFileAlt } from 'react-icons/fa';
import { VscVmActive } from "react-icons/vsc";
import axios from 'axios';

// --- Import your reusable components ---
import MenuTable from "../../Components/Menu/MenuTable";
import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal/DeleteConfirmationModal";
import SortMenuController from '../../Components/SortModal/SortMenuController';

// Define the API endpoint for Policies
const API_URL = "http://localhost:8080/api/policies";

const Policy = () => {
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
      console.error("Error fetching policies:", error);
      alert("Failed to fetch data from the server.");
    }
  };

  const handleToggleConfirm = async () => {
    if (modalState.itemToToggle) {
      const { id, is_active } = modalState.itemToToggle;
      try {
        await axios.patch(`${API_URL}/status/${id}`);
        fetchData();
        alert(`Status changed successfully!`);
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
      setData(newOrder); // Optimistic UI update
      setShowSortModal(false);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openToggleModal = (item) => {
    const nextStatus = !item.is_active ? 'Active' : 'Inactive';
    setModalState({ isOpen: true, itemToToggle: item, nextStatus: nextStatus });
  };
  const closeToggleModal = () => setModalState({ isOpen: false, itemToToggle: null, nextStatus: '' });

  // --- Define the table structure for Policies ---
  const columns = useMemo(() => [
    {
      header: "SL.No",
      cell: ({ pageContext }) => 
        (pageContext.currentPage - 1) * pageContext.entriesPerPage + pageContext.index + 1,
    },
    {
      header: "Title (English)",
      accessor: "en_title",
      isSearchable: true,
    },
    {
      header: "Title (Odia)",
      accessor: "od_title",
      isSearchable: true,
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
          return <FaFileAlt className="text-gray-500" size={22} />;
        };
        const fileUrl = `http://localhost:8080${filename}`;
        return <a href={fileUrl} target="_blank" rel="noopener noreferrer" title={filename.split('/').pop()}>{getIcon()}</a>;
      },
    },
    {
      header: "Status",
      accessor: "is_active",
      cell: ({ row }) => {
        const isActive = row.original.is_active;
        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
        )
      },
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => openToggleModal(row.original)} 
            className={row.original.is_active ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'} 
            title={`Set to ${row.original.is_active ? 'Inactive' : 'Active'}`}
          >
            {row.original.is_active ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
          </button>
          <button 
            onClick={() => navigate(`/admin/notifications/policy/edit/${row.original.id}`)} 
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
        Ltext="Policy List" 
        Rtext="Add Policy" 
        data={data}
        columns={columns}
        addPath="/admin/notifications/policy/add"
        onOpenSort={() => setShowSortModal(true)}
        // We do not pass tableState here
      />

      <SortMenuController
        open={showSortModal}
        onClose={() => setShowSortModal(false)}
        items={data}
        onSave={handleSaveOrder}
        title="Reorder Policies"
        displayKey="en_title"
        secondaryKey="od_title"
      />

      {modalState.isOpen && (
        <DeleteConfirmationModal
          onClose={closeToggleModal}
          onConfirm={handleToggleConfirm}
          title="Confirm Status Change"
          message={`Are you sure you want to change the status of "${modalState.itemToToggle?.en_title}" to "${modalState.nextStatus}"?`}
          icon={VscVmActive}
          confirmText={`Yes, Set to ${modalState.nextStatus}`}
          cancelText="No, Cancel"
        />
      )}
    </div>
  );
};

export default Policy;