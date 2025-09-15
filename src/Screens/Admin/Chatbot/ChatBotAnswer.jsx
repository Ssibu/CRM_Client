import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTimes, FaCheck } from "react-icons/fa";
import MenuTable from "../../../Components/Admin/Menu/MenuTable";
import DeleteConfirmationModal from "../../../Components/Admin/DeleteConfirmationModal/DeleteConfirmationModal";
import { useServerSideTable } from "../../../hooks/useServerSideTable";
import { useModal } from "../../../context/ModalProvider";
import chatbotAnswerAPI from "../../../services/chatbotAnswerAPI";
import DOMPurify from "dompurify";

const StatusBadge = ({ status }) => {
  const isActive = status === 'Active';
  const text = isActive ? "Active" : "Inactive";
  const classes = isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes}`}>{text}</span>;
};

const truncateText = (text, limit = 50) => {
    if (!text) return "N/A";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
};

const ChatbotAnswerListPage = () => {
  const navigate = useNavigate();
  const { showModal } = useModal();
  
  const {
    data: answers,
    setData,
    refreshData,
    tableState
  } = useServerSideTable(`${import.meta.env.VITE_API_BASE_URL}/api/chatbot-answers`);

  const [modalState, setModalState] = useState({ isOpen: false, answer: null });

  const openModal = (answer) => {
    setModalState({ isOpen: true, answer });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, answer: null });
  };

  const handleToggleStatus = useCallback(async () => {
    const { answer } = modalState;
    if (!answer) return;

    try {
      const newStatus = answer.status === "Active" ? "Inactive" : "Active";
      const response = await chatbotAnswerAPI.update(answer.id, { status: newStatus });
      const updatedAnswer = response.data;

      setData(prev =>
        prev.map(a => (a.id === updatedAnswer.id ? updatedAnswer : a))
      );
      refreshData()
      showModal("success", `Answer status updated successfully!`);
    } catch (error) {
      showModal("error", "Failed to update answer status.");
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
      header: "Question", 
      accessor: "question_name",
      isSearchable: true, 
      isSortable: true,
      cell: ({ row }) => truncateText(row.original.question_name)
    },
    { 
      header: "Answer (English)", 
      accessor: "en_answer", 
      isSearchable: true, 
      isSortable: true,
    cell: ({ row }) => (
  <div
    dangerouslySetInnerHTML={{
      __html: DOMPurify.sanitize(truncateText(row.original.en_answer)),
    }}
  />
)
    },
     { 
      header: "Answer (Odia)", 
      accessor: "od_answer", 
      isSearchable: true, 
      isSortable: true,
    cell: ({ row }) => (
  <div
    dangerouslySetInnerHTML={{
      __html: DOMPurify.sanitize(truncateText(row.original.od_answer)),
    }}
  />
)
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
            onClick={() => navigate(`/admin/manage-chatbot/edit-answer/${row.original.id}`)}
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
        Ltext="Chatbot Answers"
        Rtext="Add Answer"
        data={answers}
        columns={columns}
        addPath="/admin/manage-chatbot/add-answer"
        tableState={tableState}
      />

      {modalState.isOpen && modalState.answer && (
        <DeleteConfirmationModal
          onClose={closeModal}
          onConfirm={handleToggleStatus}
          title={`${modalState.answer.status === 'Active' ? "Deactivate" : "Activate"} Answer`}
          message={`Are you sure you want to ${
            modalState.answer.status === 'Active' ? "deactivate" : "activate"
          } this answer?`}
        />
      )}
    </div>
  );
};

export default ChatbotAnswerListPage;