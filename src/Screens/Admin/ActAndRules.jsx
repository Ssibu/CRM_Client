import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { VscVmActive } from "react-icons/vsc"; // <-- FIX 1: IMPORTED THE ICON
import axios from 'axios';

// --- Import your reusable components ---
import MenuTable from "../../Components/Menu/MenuTable";
import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal/DeleteConfirmationModal";
import SortMenuController from '../../Components/SortModal/SortMenuController';

const API_URL = "http://localhost:8080/api/act-and-rules";

const ActAndRules = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  
  const [modalState, setModalState] = useState({ 
      isOpen: false, 
      itemToToggle: null, 
      nextStatus: '' 
  });
  const [showSortModal, setShowSortModal] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching Act & Rules:", error);
    }
  };

  const handleToggleConfirm = async () => {
    if (modalState.itemToToggle) {
      try {
        await axios.patch(`${API_URL}/status/${modalState.itemToToggle.id}`);
        fetchData();
        alert(`Status changed to "${modalState.nextStatus}" successfully!`);
      } catch (error) {
        console.error("Error toggling status:", error);
        alert("Failed to update status.");
      } finally {
        closeToggleModal(); // <-- FIX 2: USED THE CORRECT FUNCTION NAME
      }
    }
  };
  
  const handleSaveOrder = async (newOrder) => {
    const orderIds = newOrder.map(item => item.id);
    try {
      await axios.put(`${API_URL}/order`, { order: orderIds });
      setData(newOrder);
      setShowSortModal(false);
    } catch (error)
    {
      console.error("Error updating order:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openToggleModal = (item) => {
    const nextStatus = item.status === 'Active' ? 'Inactive' : 'Active';
    setModalState({ isOpen: true, itemToToggle: item, nextStatus: nextStatus });
  };

  const closeToggleModal = () => setModalState({ isOpen: false, itemToToggle: null, nextStatus: '' });

  const columns = useMemo(() => [
    {
      header: "SL.No",
      cell: ({ pageContext }) => 
        (pageContext.currentPage - 1) * pageContext.entriesPerPage + pageContext.index + 1,
    },
    { header: "Title (in English)", accessor: "titleEnglish", isSearchable: true },
    { header: "Title (in Odia)", accessor: "titleOdia", isSearchable: true },
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
      header: "Actions",
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
            onClick={() => navigate(`/admin/workflow/act-and-rules/edit/${row.original.id}`)} 
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
        Ltext="Act & Rules List" 
        Rtext="Add Act & Rule" 
        data={data}
        columns={columns}
        addPath="/admin/workflow/act-and-rules/add"
        onOpenSort={() => setShowSortModal(true)}
      />

      <SortMenuController
        open={showSortModal}
        onClose={() => setShowSortModal(false)}
        items={data}
        onSave={handleSaveOrder}
        title="Reorder Act & Rules"
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

export default ActAndRules;