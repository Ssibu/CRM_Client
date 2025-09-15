import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTimes, FaCheck } from "react-icons/fa";
import MenuTable from "../../../Components/Admin/Menu/MenuTable";
import DeleteConfirmationModal from "../../../Components/Admin/DeleteConfirmationModal/DeleteConfirmationModal";
import { useServerSideTable } from "../../../hooks/useServerSideTable";
import { useModal } from "../../../context/ModalProvider";
import { chatbotCategoryAPI } from "../../../services/api"; 

const StatusBadge = ({ status }) => {
  const isActive = status === 'Active';
  const text = isActive ? "Active" : "Inactive";
  const classes = isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes}`}>{text}</span>;
};

const ChatbotCategoryListPage = () => {
  const navigate = useNavigate();
  const { showModal } = useModal();
  
  const {
    data: categories,
    setData,
    refreshData,
    tableState
  } = useServerSideTable(`${import.meta.env.VITE_API_BASE_URL}/api/chatbot-categories`); 

  const [modalState, setModalState] = useState({ isOpen: false, category: null });

  const openModal = (category) => {
    setModalState({ isOpen: true, category });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, category: null });
  };

  const handleToggleStatus = useCallback(async () => {
    const { category } = modalState;
    if (!category) return;

    try {
      const newStatus = category.status === "Active" ? "Inactive" : "Active";
      const response = await chatbotCategoryAPI.update(category.id, { status: newStatus });
      
      const updatedCategory = response.data; 

      setData(prev =>
        prev.map(cat => (cat.id === updatedCategory.id ? updatedCategory : cat))
      );
      refreshData()
      showModal("success", `Category status updated successfully!`);
    } catch (error) {
      showModal("error", "Failed to update status.");
    } finally {
      closeModal();
    }
  }, [modalState, setData, showModal]);

  const columns = useMemo(() => [
    {
      header: "SL.No",
      cell: ({ index }) => (tableState.currentPage - 1) * tableState.entriesPerPage + index + 1,
    },
    { 
      header: "Category (English)", 
      accessor: "en_title", 
      isSearchable: true, 
      isSortable: true 
    },
    { 
      header: "Category (Odia)", 
      accessor: "od_title", 
      isSearchable: true, 
      isSortable: true 
    },
    {
      header: "Status",
      accessor: "status",
      isSortable: true,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">

          <button
            onClick={() => openModal(row.original)}
            className={row.original.status === "Active" ? "text-red-500" : "text-green-500"}
            title={row.original.status === "Active" ? "Deactivate" : "Activate"}
          >
            {row.original.status === "Active" ? <FaTimes /> : <FaCheck />}
          </button>

                    <button
            onClick={() => navigate(`/admin/manage-chatbot/edit-category/${row.original.id}`)}
            className="text-blue-500 hover:text-blue-700"
            title="Edit"
          >
            <FaEdit />
          </button>
        </div>
      ),
    },
  ], [tableState.currentPage, tableState.entriesPerPage, navigate]);

  return (
    <div className="min-h-[80vh]">
      <MenuTable
        Ltext="Chatbot Categories"
        Rtext="Add Category"
        data={categories}
        columns={columns}
        addPath="/admin/manage-chatbot/add-category"
        tableState={tableState}
      />

      {modalState.isOpen && modalState.category && (
        <DeleteConfirmationModal
          onClose={closeModal}
          onConfirm={handleToggleStatus}
          title={`${modalState.category.status === 'Active' ? "Deactivate" : "Activate"} Category`}
          message={`Are you sure you want to ${
            modalState.category.status === 'Active' ? "deactivate" : "activate"
          } "${modalState.category.en_title}"?`}
        />
      )}
    </div>
  );
};

export default ChatbotCategoryListPage;