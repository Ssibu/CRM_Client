// import React from 'react'
// import MenuTable from "../../Components/Menu/MenuTable";
// import SubMenuData from "../../Components/Data/MenuData/SubMenu";

// const NewsAndEvents = () => {
//   return (
//     <div className="min-h-[80vh]  py-4 font-sans">
//       <MenuTable Ltext="News & Events" Rtext="Add News and Events" data={SubMenuData}/>
//     </div>
//   )
// }

// export default NewsAndEvents
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTimes, FaCheck } from 'react-icons/fa';
import { AlertTriangle } from 'lucide-react';
import axios from 'axios';

// Reusable Components
import MenuTable from "../../Components/Menu/MenuTable"; 
import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal/DeleteConfirmationModal"; 
import SortMenuController from '../../Components/SortModal/SortMenuController'; 

// Backend API URL for Menus
const API_URL = "http://localhost:7777/api/menus"; 
const API_BASE_URL = "http://localhost:7777";

const Menu = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [showSortModal, setShowSortModal] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, itemToUpdate: null });


  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching Menus:", error);
      alert("Failed to fetch menu data from the server.");
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const openConfirmationModal = (item) => {
    setModalState({ isOpen: true, itemToUpdate: item });
  };
  const closeConfirmationModal = () => {
    setModalState({ isOpen: false, itemToUpdate: null });
  };

 
  const handleStatusUpdateConfirm = async () => {
    const item = modalState.itemToUpdate;
    if (!item) return;


    const newStatus = item.status === 'Active' ? 'Inactive' : 'Active';
    
    try {

      await axios.put(`${API_URL}/status/${item.id}`, { status: newStatus });
      
      // Update the UI instantly for a better user experience
      setData(prevData => 
        prevData.map(menu => 
          menu.id === item.id ? { ...menu, status: newStatus } : menu
        )
      );
      alert(`Menu status set to "${newStatus}" successfully!`);
    } catch (error) {
      console.error("Error updating menu status:", error);
      alert("Failed to update status.");
    } finally {
      closeConfirmationModal(); // Close the modal
    }
  };

  // 5. Logic for Saving the new sort order
  const handleSaveOrder = async (newOrder) => {
    const orderIds = newOrder.map(item => item.id);
    try {
      await axios.put(`${API_URL}/order`, { order: orderIds });
      setData(newOrder); 
      setShowSortModal(false); 
      alert("Menu order updated successfully!");
    } catch (error)
    {
      console.error("Error updating menu order:", error);
      alert("Failed to update menu order.");
    }
  };
  
  // 6. Columns definition for the MenuTable
  const columns = useMemo(() => [
    // {
    //   header: "SL.No",
    //   cell: ({ pageContext }) => 
    //     (pageContext.currentPage - 1) * pageContext.entriesPerPage + pageContext.index + 1,
    // },
    {
      header: "Menu (in English)",
      accessor: "title_en",
      isSearchable: true,
    },
    {
      header: "Menu (in Odia)",
      accessor: "title_od",
      isSearchable: true,
    },

        {
        header: "Image",
        accessor: "image_url",
        cell: ({ row }) => (
          row.original.image_url ? 
          <img 
            src={`${API_BASE_URL}/uploads/menus/${row.original.image_url.split('/').pop()}`} 
            alt={row.original.title_en} 
            className="h-12 w-16 object-cover rounded"
          /> 
          : "No Image"
        ),
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
          {/* If status is Active, show the 'Set to Inactive' (cross) button */}
          {row.original.status === 'Active' && (
            <button 
              onClick={() => openConfirmationModal(row.original)} 
              className="text-red-500 hover:text-red-700" 
              title="Set to Inactive"
            >
              <FaTimes />
            </button>
          )}
          {/* If status is Inactive, show the 'Set to Active' (checkmark) button */}
          {row.original.status === 'Inactive' && (
            <button 
              onClick={() => openConfirmationModal(row.original)} 
              className="text-green-500 hover:text-green-700" 
              title="Set to Active"
            >
              <FaCheck />
            </button>
          )}
          <button 
            onClick={() => navigate(`/admin/menusetup/menu/edit/${row.original.id}`)} 
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
        Ltext="Menu List" 
        Rtext="Add Menu" 
        data={data}
        columns={columns}
        addPath="/admin/menusetup/menu/add"
        onOpenSort={() => setShowSortModal(true)} 
      />
      <SortMenuController
        open={showSortModal}
        onClose={() => setShowSortModal(false)}
        items={data}
        onSave={handleSaveOrder}
        title="Reorder Menus"
        displayKey="title_en"
        secondaryKey="title_od"
      />

  
       {modalState.isOpen && (
        <DeleteConfirmationModal
          onClose={closeConfirmationModal}
          onConfirm={handleStatusUpdateConfirm}
          title="Confirm Status Change"
          message={`Are you sure you want to set "${modalState.itemToUpdate?.title_en}" to ${modalState.itemToUpdate?.status === 'Active' ? 'Inactive' : 'Active'}?`}
          icon={AlertTriangle}
          // Pass the correct button text based on the action
          confirmText={modalState.itemToUpdate?.status === 'Active' ? 'Inactive' : 'Active'}
          // Pass the correct style variant based on the action
          confirmButtonVariant={modalState.itemToUpdate?.status === 'Active' ? 'danger' : 'success'}
        />
      )}
    </div>
  );
};

export default Menu;