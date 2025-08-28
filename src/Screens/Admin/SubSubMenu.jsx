// import React from 'react'
// import MenuTable from "../../Components/Menu/MenuTable";
// import SubMenuData from "../../Components/Data/MenuData/SubMenu";

// const SubSubMenu = () => {
//   return (
//     <div className="min-h-[80vh]  py-4 font-sans">
//       <MenuTable Ltext="Sub-submenu List" Rtext="Add Sub-submenu" data={SubMenuData}/>
//     </div>
//   )
// }

// export default SubSubMenu
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTimes, FaCheck } from 'react-icons/fa'; // Import FaCheck
import { AlertTriangle } from 'lucide-react';
import axios from 'axios';

// Reusable Components
import MenuTable from "../../Components/Menu/MenuTable"; 
import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal/DeleteConfirmationModal"; 
import SortMenuController from '../../Components/SortModal/SortMenuController'; 

// Backend API URLs
const API_URL = "http://localhost:7777/api/subsubmenus"; 
const API_BASE_URL = "http://localhost:7777";

const SubSubMenu = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [showSortModal, setShowSortModal] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, itemToUpdate: null });

  // 1. Function to fetch all sub-submenus
  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching Sub-SubMenus:", error);
      alert("Failed to fetch Sub-SubMenu data from the server.");
    }
  };

  // 2. Fetch data on component load
  useEffect(() => {
    fetchData();
  }, []);

  // 3. Modal management functions
  const openConfirmationModal = (item) => setModalState({ isOpen: true, itemToUpdate: item });
  const closeConfirmationModal = () => setModalState({ isOpen: false, itemToUpdate: null });

  // 4. ✅ FIX: Make the confirmation handler dynamic
  const handleStatusUpdateConfirm = async () => {
    const item = modalState.itemToUpdate;
    if (!item) return;

    // Determine the new status based on the current status
    const newStatus = item.status === 'Active' ? 'Inactive' : 'Active';
    
    try {
      await axios.put(`${API_URL}/status/${item.id}`, { status: newStatus });
      
      setData(prevData => 
        prevData.map(ssm => 
          ssm.id === item.id ? { ...ssm, status: newStatus } : ssm
        )
      );
      alert(`Sub-SubMenu status set to "${newStatus}" successfully!`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    } finally {
      closeConfirmationModal();
    }
  };

  // 5. Sort logic
  const handleSaveOrder = async (newOrder) => { /* ... No changes needed here ... */ };
  
  // 6. Columns definition (UPDATED Actions column)
  const columns = useMemo(() => [
    // { header: "SL.No", cell: ({ pageContext }) => (pageContext.currentPage - 1) * pageContext.entriesPerPage + pageContext.index + 1 },
    { header: "Parent Menu", cell: ({ row }) => row.original.SubMenu?.Menu?.title_en || 'N/A', isSearchable: true },
    { header: "Parent SubMenu", cell: ({ row }) => row.original.SubMenu?.title_en || 'N/A', isSearchable: true },
    { header: "Sub-SubMenu (in English)", accessor: "title_en", isSearchable: true },
    { header: "Sub-SubMenu (in Odia)", accessor: "title_od", isSearchable: true },
    {
        header: "Image",
        accessor: "image_url",
        cell: ({ row }) => {
            const filename = row.original.image_url;
            if (!filename) return <div className="text-gray-500 text-xs">No Image</div>;
            const finalSrc = `${API_BASE_URL}/uploads/subsubmenus/${filename}`;
            return <img src={finalSrc} alt={row.original.title_en} className="h-12 w-16 object-cover rounded"/>;
        }
    },
    {
      header: "Status",
      accessor: "status",
      cell: ({ row }) => (<span className={`px-2 py-1 text-xs font-semibold rounded-full ${row.original.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{row.original.status}</span>),
    },
    {
      // ✅ FIX: Update the "Actions" column to show both toggle buttons
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          {row.original.status === 'Active' && (
            <button 
              onClick={() => openConfirmationModal(row.original)} 
              className="text-red-500 hover:text-red-700" 
              title="Set to Inactive"
            >
              <FaTimes />
            </button>
          )}
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
            onClick={() => navigate(`/admin/menusetup/subsubmenu/edit/${row.original.id}`)} 
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
        Ltext="Sub-SubMenu List" 
        Rtext="Add Sub-SubMenu" 
        data={data}
        columns={columns}
        addPath="/admin/menusetup/subsubmenu/create"
        onOpenSort={() => setShowSortModal(true)} 
      />
      <SortMenuController
        open={showSortModal}
        onClose={() => setShowSortModal(false)}
        items={data}
        onSave={handleSaveOrder}
        title="Reorder Sub-SubMenus"
        displayKey="title_en"
        secondaryKey="title_od"
      />
      {/* ✅ FIX: Make the modal dynamic */}
      {modalState.isOpen && (
        <DeleteConfirmationModal
          onClose={closeConfirmationModal}
          onConfirm={handleStatusUpdateConfirm}
          title="Confirm Status Change"
          message={`Are you sure you want to set "${modalState.itemToUpdate?.title_en}" to ${modalState.itemToUpdate?.status === 'Active' ? 'Inactive' : 'Active'}?`}
          icon={AlertTriangle}
          confirmText={modalState.itemToUpdate?.status === 'Active' ? 'Inactive' : 'Active'}
          confirmButtonVariant={modalState.itemToUpdate?.status === 'Active' ? 'danger' : 'success'}
        />
      )}
    </div>
  );
};

export default SubSubMenu;