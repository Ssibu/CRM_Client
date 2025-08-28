import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaToggleOn, FaToggleOff, FaFilePdf, FaFileWord, FaFileImage, FaFileAlt, FaFileExcel } from 'react-icons/fa';
import { VscVmActive } from "react-icons/vsc";
import axios from 'axios';

// --- Import your components AND the hook ---
import MenuTable from "../../Components/Menu/MenuTable";
import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal/DeleteConfirmationModal";
import { useServerSideTable } from '../../hooks/useServerSideTable';
import { useModal } from '../../context/ModalProvider';

const API_URL = "http://localhost:7777/api/policies";

const Policy = () => {
  // --- USE THE HOOK ---
  const { data, refreshData, tableState } = useServerSideTable(API_URL);
  
  const navigate = useNavigate();
  const { showModal } = useModal();
  
  const [modalState, setModalState] = useState({ isOpen: false, itemToToggle: null, nextStatus: '' });

  const handleToggleConfirm = async () => {
    if (modalState.itemToToggle) {
      try {
        await axios.patch(`${API_URL}/status/${modalState.itemToToggle.id}`);
        showModal("success", "Status updated successfully!");
        refreshData(); // Tell the hook to refetch its data
      } catch (error) {
        showModal("error", "Failed to update status.");
      } finally {
        closeToggleModal();
      }
    }
  };
  
  const openToggleModal = (item) => {
    const nextStatus = !item.is_active ? 'Active' : 'Inactive';
    setModalState({ isOpen: true, itemToToggle: item, nextStatus });
  };
  const closeToggleModal = () => setModalState({ isOpen: false, itemToToggle: null, nextStatus: '' });

  const columns = useMemo(() => [
    {
      header: "SL.No",
      cell: ({ index }) => (tableState.currentPage - 1) * tableState.entriesPerPage + index + 1,
    },
    { header: "Title (English)", accessor: "en_title", isSearchable: true, isSortable: true },
    { header: "Title (Odia)", accessor: "od_title", isSearchable: true, isSortable: true },
    {
      header: "Document",
      accessor: "document",
      cell: ({ row }) => {
        const filename = row.original.document || '';
        const fileUrl = `http://localhost:8080${filename.startsWith('/') ? '' : '/'}${filename}`;
        const extension = filename.split('.').pop().toLowerCase();
        const getIcon = () => {
          if (['pdf'].includes(extension)) return <FaFilePdf className="text-red-500" size={22} />;
          if (['doc', 'docx'].includes(extension)) return <FaFileWord className="text-blue-500" size={22} />;
          return <FaFileAlt className="text-gray-500" size={22} />;
        };
        return <a href={fileUrl} target="_blank" rel="noopener noreferrer" title={filename.split('/').pop()}>{getIcon()}</a>;
      },
    },
    {
      header: "Status",
      accessor: "is_active",
      isSortable: true,
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
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button onClick={() => openToggleModal(row.original)} title="Toggle Status">
            {row.original.is_active ? <FaToggleOn size={20} className="text-green-500" /> : <FaToggleOff size={20} className="text-red-500" />}
          </button>
          <button onClick={() => navigate(`/admin/notifications/policy/edit/${row.original.id}`)} title="Edit">
            <FaEdit className="text-blue-500" />
          </button>
        </div>
      ),
    },
  ], [tableState.currentPage, tableState.entriesPerPage, navigate]);

  return (
    <div className="min-h-[80vh] py-4 font-sans">
      <MenuTable 
        Ltext="Policy List" 
        Rtext="Add Policy" 
        data={data}
        columns={columns}
        addPath="/admin/notifications/policy/add"
        tableState={tableState}
      />

      {/* The SortMenuController is not needed as sorting is handled on table headers */}

      {modalState.isOpen && (
        <DeleteConfirmationModal
          onClose={closeToggleModal}
          onConfirm={handleToggleConfirm}
          title="Confirm Status Change"
          message={`Change status of "${modalState.itemToToggle?.en_title}" to "${modalState.nextStatus}"?`}
          icon={VscVmActive}
          confirmText={`Set to ${modalState.nextStatus}`}
        />
      )}
    </div>
  );
};

export default Policy;