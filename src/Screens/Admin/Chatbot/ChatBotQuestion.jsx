import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTimes, FaCheck } from "react-icons/fa";
import MenuTable from "../../../Components/Admin/Menu/MenuTable";
import DeleteConfirmationModal from "../../../Components/Admin/DeleteConfirmationModal/DeleteConfirmationModal";
import { useServerSideTable } from "../../../hooks/useServerSideTable";
import { useModal } from "../../../context/ModalProvider";
import chatbotQuestionAPI from "../../../services/chatbotQuestionAPI";

const StatusBadge = ({ status }) => {
  const isActive = status === 'Active';
  const text = isActive ? "Active" : "Inactive";
  const classes = isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes}`}>{text}</span>;
};

const ChatbotQuestionListPage = () => {
  const navigate = useNavigate();
  const { showModal } = useModal();
  
  const {
    data: questions,
    setData,
    refreshData,
    tableState
  } = useServerSideTable(`${import.meta.env.VITE_API_BASE_URL}/api/chatbot-questions`);

  const [modalState, setModalState] = useState({ isOpen: false, question: null });

  const openModal = (question) => {
    setModalState({ isOpen: true, question });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, question: null });
  };

  const handleToggleStatus = useCallback(async () => {
    const { question } = modalState;
    if (!question) return;

    try {
      const newStatus = question.status === "Active" ? "Inactive" : "Active";
      const response = await chatbotQuestionAPI.update(question.id, { status: newStatus });
      const updatedQuestion = response.data;

      setData(prev =>
        prev.map(q => (q.id === updatedQuestion.id ? updatedQuestion : q))
      );
      refreshData()
      showModal("success", `Question status updated successfully!`);
    } catch (error) {
      showModal("error", "Failed to update question status.");
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
      header: "Category", 
      accessor: "category_name",
      isSearchable: true, 
      isSortable: true 
    },
    { 
      header: "Question (English)", 
      accessor: "en_question", 
      isSearchable: true, 
      isSortable: true 
    },
    { 
      header: "Question (Odia)", 
      accessor: "od_question", 
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
            onClick={() => navigate(`/admin/manage-chatbot/edit-question/${row.original.id}`)}
            className="text-blue-500 hover:text-blue-700"
            title="Edit Question"
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
        Ltext="Chatbot Questions"
        Rtext="Add Question"
        data={questions}
        columns={columns}
        addPath="/admin/manage-chatbot/add-question"
        tableState={tableState}
      />

      {modalState.isOpen && modalState.question && (
        <DeleteConfirmationModal
          onClose={closeModal}
          onConfirm={handleToggleStatus}
          title={`${modalState.question.status === 'Active' ? "Deactivate" : "Activate"} Question`}
          message={`Are you sure you want to ${
            modalState.question.status === 'Active' ? "deactivate" : "activate"
          } "${modalState.question.en_question}"?`}
        />
      )}
    </div>
  );
};

export default ChatbotQuestionListPage;