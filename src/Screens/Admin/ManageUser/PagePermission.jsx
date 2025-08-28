
// import React, { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import MenuTable from "../../../Components/Menu/MenuTable"; 
// import { useModal } from "../../../context/ModalProvider"; 

// const API_BASE_URL =   `${process.env.REACT_APP_API_URL}/permissions`; 

// const AssignPermissionPage = () => {
//   const [users, setUsers] = useState([]);
//   const [pages, setPages] = useState([]);
  
//   const [selectedUserId, setSelectedUserId] = useState('');
//   const [assignedPageIds, setAssignedPageIds] = useState(new Set());
//   const [isLoading, setIsLoading] = useState(false);

//   const { showModal } = useModal();

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/data`);
//         setUsers(response.data.users);
//         setPages(response.data.pages);
//       } catch (error) {
//         showModal("error", "Failed to load data", error.message);
//       }
//     };
//     fetchInitialData();
//   }, []);

//   useEffect(() => {
//     if (!selectedUserId) {
//       setAssignedPageIds(new Set());
//       return;
//     }

//     const fetchUserPermissions = async () => {
//       setIsLoading(true);
//       try {
//         const response = await axios.get(`${API_BASE_URL}/user/${selectedUserId}`);
//         setAssignedPageIds(new Set(response.data.pageIds));
//       } catch (error) {
//         showModal("error", "Failed to load user permissions.", error.message);
//         setAssignedPageIds(new Set());
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchUserPermissions();
//   }, [selectedUserId, showModal]);



//   const handlePermissionChange = (pageId) => {
//     setAssignedPageIds(prevIds => {
//       const newIds = new Set(prevIds);
//       if (newIds.has(pageId)) {
//         newIds.delete(pageId);
//       } else {
//         newIds.add(pageId);
//       }
//       return newIds;
//     });
//   };

//   const handleSelectAll = (isChecked) => {
//     if (isChecked) {
//       setAssignedPageIds(new Set(pages.map(p => p.id)));
//     } else {
//       setAssignedPageIds(new Set());
//     }
//   };

//   const handleSubmit = async () => {
//     if (!selectedUserId) {
//       showModal("error", "Please select a user first");
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const response = await axios.post(`${API_BASE_URL}/assign`, {
//         userId: Number(selectedUserId),
//         pageIds: Array.from(assignedPageIds),
//       });
//       showModal("success", response.data.message);
//     } catch (error) {
//       showModal("error", "Failed to save permissions.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const permissionColumns = useMemo(() => {
//     return [
//       {
//         header: "SL.No",
//         accessor: "id",
//         cell: ({ pageContext }) => {
//           if (!pageContext) return null;
//           const { currentPage, entriesPerPage, index } = pageContext;
//           return (currentPage - 1) * entriesPerPage + index + 1;
//         },
//       },
//       { header: "Page Name", accessor: "pageName", isSearchable: true },
//       { header: "Short Code", accessor: "shortCode", isSearchable: true },
//       {
//         header: "Assign",
//         accessor: 'permission',
//         cell: ({ row }) => (
//           <div >
//             <input
//               type="checkbox"
//               className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//               checked={assignedPageIds.has(row.original.id)}
//               onChange={() => handlePermissionChange(row.original.id)}
//             />
//           </div>
//         ),
//       },
//     ];
//   }, [assignedPageIds]);

//   const areAllSelected = useMemo(() => 
//     pages.length > 0 && assignedPageIds.size === pages.length,
//     [pages, assignedPageIds]
//   );

//   return (
//     <div className="p-6 space-y-6 min-h-[80vh]">
//       <div className="p-6 bg-white shadow rounded-lg">
//         <h1 className="text-xl font-bold text-gray-800">Manage page permission</h1>

 

//    <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mt-6 items-end">
//   <div>
//     <label
//       htmlFor="user-select"
//       className="block text-sm font-medium text-gray-700 mb-1"
//     >
//       Select User
//     </label>
//     <select
//       id="user-select"
//       value={selectedUserId}
//       onChange={(e) => setSelectedUserId(e.target.value)}
//       className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//       disabled={isLoading}
//     >
//       <option value="">-- Select a User --</option>
//       {users.map((user) => (
//         <option key={user.id} value={user.id}>
//           {user.name} ({user.email})
//         </option>
//       ))}
//     </select>
//   </div>

//   <div className="flex items-center space-x-4">
//     {selectedUserId && (
//       <button
//         onClick={handleSubmit}
//         disabled={isLoading || !selectedUserId}
//         className="bg-green-500 py-1 px-4 rounded text-white"
//       >
//         {isLoading ? "Assigning..." : "Assign"}
//       </button>
//     )}
// { selectedUserId &&
//     <div className="flex items-center space-x-2">
//       <input
//         type="checkbox"
//         id="select-all-pages"
//         className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//         checked={areAllSelected}
//         onChange={(e) => handleSelectAll(e.target.checked)}
//       />
//       <label
//         htmlFor="select-all-pages"
//         className="text-sm font-medium text-gray-700"
//       >
//         Select All Permissions
//       </label>
//     </div>
// }
//   </div>
// </div>

//       </div>

//       {selectedUserId && (
//         <div className="bg-white shadow rounded-lg overflow-hidden">
         
//           <MenuTable
//               data={pages}
//               columns={permissionColumns}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default AssignPermissionPage;


import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import MenuTable from "../../../Components/Menu/MenuTable"; 
import { useModal } from "../../../context/ModalProvider"; 
import { useServerSideTable } from "../../../hooks/useServerSideTable"; // 1. Import the hook

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/permissions`; 

const AssignPermissionPage = () => {
  // 2. Use the hook for the pages table
  const { data: pages, tableState } = useServerSideTable(`${API_BASE_URL}/pages`);

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  
  // This state remains client-side. It holds ALL assigned IDs for the selected user.
  const [assignedPageIds, setAssignedPageIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false); // For user-specific actions

  const { showModal } = useModal();

  // Fetch the list of users once on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users`);
        setUsers(response.data.users);
      } catch (error) {
        showModal("error", "Failed to load user list", error.message);
      }
    };
    fetchUsers();
  }, [showModal]);

  // Fetch permissions when a user is selected
  useEffect(() => {
    if (!selectedUserId) {
      setAssignedPageIds(new Set());
      return;
    }
    const fetchUserPermissions = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/user/${selectedUserId}`);
        setAssignedPageIds(new Set(response.data.pageIds));
      } catch (error) {
        showModal("error", "Failed to load user permissions.", error.message);
        setAssignedPageIds(new Set());
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserPermissions();
  }, [selectedUserId, showModal]);

  // Handle individual checkbox clicks
  const handlePermissionChange = useCallback((pageId) => {
    setAssignedPageIds(prevIds => {
      const newIds = new Set(prevIds);
      newIds.has(pageId) ? newIds.delete(pageId) : newIds.add(pageId);
      return newIds;
    });
  }, []);

  // IMPORTANT: "Select All" now only applies to the currently visible page
  const handleSelectAllOnPage = (isChecked) => {
    setAssignedPageIds(prevIds => {
      const newIds = new Set(prevIds);
      if (isChecked) {
        pages.forEach(p => newIds.add(p.id)); // Add all visible pages
      } else {
        pages.forEach(p => newIds.delete(p.id)); // Remove all visible pages
      }
      return newIds;
    });
  };

  const handleSubmit = async () => {
    if (!selectedUserId) {
      showModal("error", "Please select a user first");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/assign`, {
        userId: Number(selectedUserId),
        pageIds: Array.from(assignedPageIds),
      });
      showModal("success", response.data.message);
    } catch (error) {
      showModal("error", "Failed to save permissions.");
    } finally {
      setIsLoading(false);
    }
  };


  // 3. Update columns to be sortable and use tableState
  const permissionColumns = useMemo(() => {
    return [
      {
        header: "SL.No",
        cell: ({ index }) => (tableState.currentPage - 1) * tableState.entriesPerPage + index + 1,
      },
      { header: "Page Name", accessor: "pageName", isSearchable: true, isSortable: true },
      { header: "Short Code", accessor: "shortCode", isSearchable: true, isSortable: true },
      {
        header: "Assign",
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            checked={assignedPageIds.has(row.original.id)}
            onChange={() => handlePermissionChange(row.original.id)}
          />
        ),
      },
    ];
  }, [assignedPageIds, handlePermissionChange, tableState.currentPage, tableState.entriesPerPage]);

  const areAllOnPageSelected = useMemo(() => 
    pages.length > 0 && pages.every(p => assignedPageIds.has(p.id)),
    [pages, assignedPageIds]
  );

  return (
    <div className="p-6 space-y-6 min-h-[80vh]">
      <div className="p-6 bg-white shadow rounded-lg">
              <h1 className="text-xl font-bold text-gray-800">Manage page permission</h1>

 

    <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mt-6 items-end">
   <div>
     <label
      htmlFor="user-select"
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      Select User
    </label>
    <select
      id="user-select"
      value={selectedUserId}
      onChange={(e) => setSelectedUserId(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      disabled={isLoading}
    >
      <option value="">-- Select a User --</option>
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.name} ({user.email})
        </option>
      ))}
    </select>
  </div>

  <div className="flex items-center space-x-4">
    {selectedUserId && (
      <button
        onClick={handleSubmit}
        disabled={isLoading || !selectedUserId}
        className="bg-green-500 py-1 px-4 rounded text-white"
      >
        {isLoading ? "Assigning..." : "Assign"}
      </button>
    )}
        {/* Updated "Select All" functionality */}
        { selectedUserId &&
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="select-all-pages"
                checked={areAllOnPageSelected}
                onChange={(e) => handleSelectAllOnPage(e.target.checked)}
              />
              <label htmlFor="select-all-pages">Select All on Page</label>
            </div>
        }
      </div>
      </div>


      {selectedUserId && (
        <MenuTable
            Ltext={`Assigning Permissions for ${users.find(u => u.id === Number(selectedUserId))?.name || 'User'}`}
            data={pages} // Data comes from the hook now
            columns={permissionColumns}
            tableState={tableState} 
        />
      )}
      </div>
</div>

  );
};

export default AssignPermissionPage;