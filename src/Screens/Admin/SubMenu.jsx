
// import React, { useEffect, useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaEdit, FaTimes, FaCheck } from 'react-icons/fa'; // Import FaCheck
// import { AlertTriangle } from 'lucide-react';
// import axios from 'axios';

// // Reusable Components
// import MenuTable from "../../Components/Menu/MenuTable"; 
// import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal/DeleteConfirmationModal"; 
// import SortMenuController from '../../Components/SortModal/SortMenuController'; 

// // Backend API URLs
// const API_URL = "http://localhost:5000/api/submenus"; 
// const API_BASE_URL = "http://localhost:5000";

// const SubMenu = () => {
//   const [data, setData] = useState([]);
//   const navigate = useNavigate();
//   const [showSortModal, setShowSortModal] = useState(false);
//   const [modalState, setModalState] = useState({ isOpen: false, itemToUpdate: null });

//   // 1. Function to fetch all submenus (no change)
//   const fetchData = async () => {
//     try {
//       const response = await axios.get(API_URL);
//       setData(response.data);
//     } catch (error) {
//       console.error("Error fetching SubMenus:", error);
//       alert("Failed to fetch submenu data from the server.");
//     }
//   };

//   // 2. Fetch data on component load (no change)
//   useEffect(() => {
//     fetchData();
//   }, []);

//   // 3. Modal management functions (no change)
//   const openConfirmationModal = (item) => setModalState({ isOpen: true, itemToUpdate: item });
//   const closeConfirmationModal = () => setModalState({ isOpen: false, itemToUpdate: null });

//   // ✅ FIX #1: Make the confirmation handler dynamic
//   const handleStatusUpdateConfirm = async () => {
//     const item = modalState.itemToUpdate;
//     if (!item) return;

//     // Determine the new status based on the current status
//     const newStatus = item.status === 'Active' ? 'Inactive' : 'Active';
    
//     try {
//       await axios.put(`${API_URL}/status/${item.id}`, { status: newStatus });
      
//       setData(prevData => 
//         prevData.map(submenu => 
//           submenu.id === item.id ? { ...submenu, status: newStatus } : submenu
//         )
//       );
//       alert(`SubMenu status set to "${newStatus}" successfully!`);
//     } catch (error) {
//       console.error("Error updating submenu status:", error);
//       alert("Failed to update status.");
//     } finally {
//       closeConfirmationModal();
//     }
//   };

//   // 5. Sort logic (no change)
//   const handleSaveOrder = async (newOrder) => { /* ... no change ... */ };
  
//   // 6. Columns definition (UPDATED Actions column)
//   const columns = useMemo(() => [
//     // { header: "SL.No", cell: ({ pageContext }) => (pageContext.currentPage - 1) * pageContext.entriesPerPage + pageContext.index + 1 },
//     {
//       header: "Parent Menu",
//       cell: ({ row }) => row.original.Menu ? row.original.Menu.title_en : 'N/A',
//       isSearchable: true,
//     },
//     { header: "SubMenu (in English)", accessor: "title_en", isSearchable: true },
//     { header: "SubMenu (in Odia)", accessor: "title_od", isSearchable: true },
//     {
//         header: "Image",
//         accessor: "image_url",
     
//              cell: ({ row }) => (
//           row.original.image_url ? 
//           <img 
//             src={`${API_BASE_URL}/uploads/submenus/${row.original.image_url.split('/').pop()}`} 
//             alt={row.original.title_en} 
//             className="h-12 w-16 object-cover rounded"
//           /> 
//           : "No Image"
//         ),
//     },
//     {
//       header: "Status",
//       accessor: "status",
//       cell: ({ row }) => (<span className={`px-2 py-1 text-xs font-semibold rounded-full ${row.original.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{row.original.status}</span>),
//     },
//     {
//       // ✅ FIX #2: Update the "Actions" column to show the correct button
//       header: "Actions",
//       cell: ({ row }) => (
//         <div className="flex space-x-2">
//           {row.original.status === 'Active' && (
//             <button 
//               onClick={() => openConfirmationModal(row.original)} 
//               className="text-red-500 hover:text-red-700" 
//               title="Set to Inactive"
//             >
//               <FaTimes />
//             </button>
//           )}
//           {row.original.status === 'Inactive' && (
//             <button 
//               onClick={() => openConfirmationModal(row.original)} 
//               className="text-green-500 hover:text-green-700" 
//               title="Set to Active"
//             >
//               <FaCheck />
//             </button>
//           )}
//           <button 
//             onClick={() => navigate(`/admin/menusetup/submenu/edit/${row.original.id}`)} 
//             className="text-blue-500 hover:text-blue-700" 
//             title="Edit"
//           >
//             <FaEdit />
//           </button>
//         </div>
//       ),
//     },
//   ], [navigate]);

//   return (
//     <div className="min-h-[80vh] py-4 font-sans">
//       <MenuTable 
//         Ltext="SubMenu List" 
//         Rtext="Add SubMenu" 
//         data={data}
//         columns={columns}
//         addPath="/admin/menusetup/submenu/create"
//         onOpenSort={() => setShowSortModal(true)} 
//       />
//       <SortMenuController
//         open={showSortModal}
//         onClose={() => setShowSortModal(false)}
//         items={data}
//         onSave={handleSaveOrder}
//         title="Reorder SubMenus"
//         displayKey="title_en"
//         secondaryKey="title_od"
//       />
//       {/* The modal is already correctly configured from your provided code */}
//       {modalState.isOpen && (
//         <DeleteConfirmationModal
//           onClose={closeConfirmationModal}
//           onConfirm={handleStatusUpdateConfirm}
//           title="Confirm Status Change"
//           message={`Are you sure you want to set "${modalState.itemToUpdate?.title_en}" to ${modalState.itemToUpdate?.status === 'Active' ? 'Inactive' : 'Active'}?`}
//           icon={AlertTriangle}
//           confirmText={modalState.itemToUpdate?.status === 'Active' ? 'Inactive' : 'Active'}
//           confirmButtonVariant={modalState.itemToUpdate?.status === 'Active' ? 'danger' : 'success'}
//         />
//       )}
//     </div>
//   );
// };

// export default SubMenu;





// import React, { useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaEdit, FaTimes, FaCheck } from 'react-icons/fa';
// import { AlertTriangle } from 'lucide-react';
// import axios from 'axios';

// import MenuTable from "../../Components/Menu/MenuTable"; 
// import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal/DeleteConfirmationModal"; 
// import SortMenuController from '../../Components/SortModal/SortMenuController';
// import { useServerSideTable } from '../../hooks/useServerSideTable';
// import { useModal } from '../../context/ModalProvider';

// const API_BASE_URL = "http://localhost:5000";

// const SubMenu = () => {
//   const navigate = useNavigate();
//   const { showModal } = useModal();
  
//   const {
//     data: paginatedSubMenus,
//     setData: setPaginatedSubMenus,
//     tableState,
//     refreshData
//   } = useServerSideTable(`${API_BASE_URL}/api/submenus`);
  
//   const [showSortModal, setShowSortModal] = useState(false);
//   const [sortableItems, setSortableItems] = useState([]);
//   const [modalState, setModalState] = useState({ isOpen: false, itemToUpdate: null });

//   const fetchAllSubMenusForSorting = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/submenus/all`, { withCredentials: true });
//       setSortableItems(response.data);
//       setShowSortModal(true);
//     } catch (error) {
//       showModal("error", "Failed to load submenus for reordering.");
//     }
//   };

//   const openConfirmationModal = (item) => setModalState({ isOpen: true, itemToUpdate: item });
//   const closeConfirmationModal = () => setModalState({ isOpen: false, itemToUpdate: null });

//   const handleStatusUpdateConfirm = async () => {
//     const item = modalState.itemToUpdate;
//     if (!item) return;
//     const newStatus = item.status === 'Active' ? 'Inactive' : 'Active';
//     try {
//       const response = await axios.put(`${API_BASE_URL}/api/submenus/status/${item.id}`, { status: newStatus }, { withCredentials: true });
//       const updatedItem = response.data;
//       setPaginatedSubMenus(prevData => 
//         prevData.map(submenu => 
//           submenu.id === updatedItem.id ? updatedItem : submenu
//         )
//       );
//       showModal("success", `SubMenu status set to "${newStatus}" successfully!`);
//     } catch (error) {
//       showModal("error", "Failed to update status.");
//     } finally {
//       closeConfirmationModal();
//     }
//   };

//   const handleSaveOrder = async (newOrder) => {
//     if (Array.isArray(newOrder)) {
//       setSortableItems(newOrder);
//       return;
//     }
//     const orderIds = sortableItems.map(item => item.id);
//     try {
//       await axios.put(`${API_BASE_URL}/api/submenus/order`, { order: orderIds }, { withCredentials: true });
//       setShowSortModal(false);
//       showModal("success", "SubMenu order updated successfully!");
//       refreshData();
//     } catch (error) {
//       showModal("error", "Failed to update submenu order.");
//     }
//   };
  
//   const columns = useMemo(() => [
//     {
//       header: "SL.No",
//       cell: ({ index }) => (tableState.currentPage - 1) * tableState.entriesPerPage + index + 1,
//     },
//     {
//       header: "Parent Menu",
//       accessor: "parent_menu",
//       isSearchable: true,
//       isSortable: true,
//     },
//     { header: "SubMenu (in English)", accessor: "title_en", isSearchable: true, isSortable: true },
//     { header: "SubMenu (in Odia)", accessor: "title_od", isSearchable: true, isSortable: true },
//     {
//         header: "Image",
//         accessor: "image_url",
//         cell: ({ row }) => (
//           row.original.image_url ? 
//           <img 
//             src={`${API_BASE_URL}/uploads/submenus/${row.original.image_url.split('/').pop()}`} 
//             alt={row.original.title_en} 
//             className="h-12 w-16 object-cover rounded"
//           /> 
//           : "No Image"
//         ),
//     },
//     {
//       header: "Status",
//       accessor: "status",
//       isSortable: true,
//       cell: ({ row }) => (<span className={`px-2 py-1 text-xs font-semibold rounded-full ${row.original.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{row.original.status}</span>),
//     },
//     {
//       header: "Actions",
//       cell: ({ row }) => (
//         <div className="flex space-x-2">
//           <button 
//             onClick={() => openConfirmationModal(row.original)} 
//             className={row.original.status === 'Active' ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'} 
//             title={row.original.status === 'Active' ? 'Set to Inactive' : 'Set to Active'}>
//             {row.original.status === 'Active' ? <FaTimes /> : <FaCheck />}
//           </button>
//           <button 
//             onClick={() => navigate(`/admin/menusetup/submenu/edit/${row.original.id}`)} 
//             className="text-blue-500 hover:text-blue-700" 
//             title="Edit">
//             <FaEdit />
//           </button>
//         </div>
//       ),
//     },
//   ], [tableState.currentPage, tableState.entriesPerPage, navigate]);

//   return (
//     <div className="min-h-[80vh] py-4 font-sans">
//       <MenuTable 
//         Ltext="SubMenu List" 
//         Rtext="Add SubMenu" 
//         data={paginatedSubMenus}
//         columns={columns}
//         addPath="/admin/menusetup/submenu/create"
//         tableState={tableState}
//         onOpenSort={fetchAllSubMenusForSorting} 
//       />
//       <SortMenuController
//         open={showSortModal}
//         onClose={() => setShowSortModal(false)}
//         items={sortableItems}
//         onSave={handleSaveOrder}
//         title="Reorder SubMenus"
//         displayKey="title_en"
//         secondaryKey="title_od"
//       />
//       {modalState.isOpen && (
//         <DeleteConfirmationModal
//           onClose={closeConfirmationModal}
//           onConfirm={handleStatusUpdateConfirm}
//           title="Confirm Status Change"
//           message={`Are you sure you want to set "${modalState.itemToUpdate?.title_en}" to ${modalState.itemToUpdate?.status === 'Active' ? 'Inactive' : 'Active'}?`}
//           icon={AlertTriangle}
//           confirmText={modalState.itemToUpdate?.status === 'Active' ? 'Set to Inactive' : 'Set to Active'}
//           confirmButtonVariant={modalState.itemToUpdate?.status === 'Active' ? 'danger' : 'success'}
//         />
//       )}
//     </div>
//   );
// };

// export default SubMenu;


import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTimes, FaCheck } from 'react-icons/fa';
import { AlertTriangle } from 'lucide-react';
import axios from 'axios';

import MenuTable from "../../Components/Menu/MenuTable"; 
import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal/DeleteConfirmationModal"; 
import SortMenuController from '../../Components/SortModal/SortMenuController';
import { useServerSideTable } from '../../hooks/useServerSideTable';
import { useModal } from '../../context/ModalProvider';

const API_BASE_URL = "http://localhost:5000";

const SubMenu = () => {
  const navigate = useNavigate();
  const { showModal } = useModal();
  
  const {
    data: paginatedSubMenus,
    setData: setPaginatedSubMenus,
    tableState,
    refreshData
  } = useServerSideTable(`${API_BASE_URL}/api/submenus`);
  
  const [showSortModal, setShowSortModal] = useState(false);
  const [sortableItems, setSortableItems] = useState([]);
  const [modalState, setModalState] = useState({ isOpen: false, itemToUpdate: null });

  const fetchAllSubMenusForSorting = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/submenus/all`, { withCredentials: true });
      setSortableItems(response.data);
      setShowSortModal(true);
    } catch (error) {
      showModal("error", "Failed to load submenus for reordering.");
    }
  };

  const openConfirmationModal = (item) => setModalState({ isOpen: true, itemToUpdate: item });
  const closeConfirmationModal = () => setModalState({ isOpen: false, itemToUpdate: null });

  const handleStatusUpdateConfirm = async () => {
    const item = modalState.itemToUpdate;
    if (!item) return;
    const newStatus = item.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const response = await axios.put(`${API_BASE_URL}/api/submenus/status/${item.id}`, { status: newStatus }, { withCredentials: true });
      const updatedItem = response.data;
      setPaginatedSubMenus(prevData => 
        prevData.map(submenu => 
          submenu.id === updatedItem.id ? updatedItem : submenu
        )
      );
      showModal("success", `SubMenu status set to "${newStatus}" successfully!`);
      refreshData()
    } catch (error) {
      showModal("error", "Failed to update status.");
    } finally {
      closeConfirmationModal();
    }
  };

  const handleSaveOrder = async (newOrder) => {
    const orderIds = newOrder.map(item => item.id);
    try {
      await axios.put(`${API_BASE_URL}/api/submenus/order`, { order: orderIds }, { withCredentials: true });
      setShowSortModal(false);
      showModal("success", "SubMenu order updated successfully!");
      refreshData();
    } catch (error) {
      showModal("error", "Failed to update submenu order.");
    }
  };
  
  const columns = useMemo(() => [
    {
      header: "SL.No",
      cell: ({ index }) => (tableState.currentPage - 1) * tableState.entriesPerPage + index + 1,
    },
    {
      header: "Parent Menu",
      accessor: "parent_menu",
      isSearchable: true,
      isSortable: true,
    },
    { header: "SubMenu (in English)", accessor: "title_en", isSearchable: true, isSortable: true },
    { header: "SubMenu (in Odia)", accessor: "title_od", isSearchable: true, isSortable: true },
    {
        header: "Image",
        accessor: "image_url",
        cell: ({ row }) => (
          row.original.image_url ? 
          <img 
            src={`${API_BASE_URL}/uploads/submenus/${row.original.image_url.split('/').pop()}`} 
            alt={row.original.title_en} 
            className="h-12 w-16 object-cover rounded"
          /> 
          : "No Image"
        ),
    },
    {
      header: "Status",
      accessor: "status",
      isSortable: true,
      cell: ({ row }) => (<span className={`px-2 py-1 text-xs font-semibold rounded-full ${row.original.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{row.original.status}</span>),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => openConfirmationModal(row.original)} 
            className={row.original.status === 'Active' ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'} 
            title={row.original.status === 'Active' ? 'Set to Inactive' : 'Set to Active'}>
            {row.original.status === 'Active' ? <FaTimes /> : <FaCheck />}
          </button>
          <button 
            onClick={() => navigate(`/admin/menusetup/submenu/edit/${row.original.id}`)} 
            className="text-blue-500 hover:text-blue-700" 
            title="Edit">
            <FaEdit />
          </button>
        </div>
      ),
    },
  ], [tableState.currentPage, tableState.entriesPerPage, navigate]);

  return (
    <div className="min-h-[80vh] py-4 font-sans">
      <MenuTable 
        Ltext="SubMenu List" 
        Rtext="Add SubMenu" 
        data={paginatedSubMenus}
        columns={columns}
        addPath="/admin/menusetup/submenu/create"
        tableState={tableState}
        onOpenSort={fetchAllSubMenusForSorting} 
      />
      <SortMenuController
        open={showSortModal}
        onClose={() => setShowSortModal(false)}
        items={sortableItems}
        onSave={handleSaveOrder}
        title="Reorder SubMenus"
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
          confirmText={modalState.itemToUpdate?.status === 'Active' ? 'Set to Inactive' : 'Set to Active'}
          confirmButtonVariant={modalState.itemToUpdate?.status === 'Active' ? 'danger' : 'success'}
        />
      )}
    </div>
  );
};

export default SubMenu;