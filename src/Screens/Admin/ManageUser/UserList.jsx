

import React, { useState, useMemo, useCallback } from "react";
import axios from "axios";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa"; // Using FaCheck to match PageList
import { useNavigate } from "react-router-dom";
import MenuTable from "../../../Components/Admin/Menu/MenuTable";
import DeleteConfirmationModal from "../../../Components/Admin/DeleteConfirmationModal/DeleteConfirmationModal";
import ImageModal from "../../../Components/Admin/ImageModal/ImageModal";  // <-- Import ImageModal
import { useServerSideTable } from "../../../hooks/useServerSideTable";
import { useModal } from "../../../context/ModalProvider";

const StatusBadge = ({ isActive }) => {
  const text = isActive ? "Active" : "Inactive";
  const classes = isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes}`}>
      {text}
    </span>
  );
};

const UserList = () => {
  const navigate = useNavigate();
  const { showModal } = useModal();

  const {
    data: users,
    setData,
    tableState,
    refreshData,
  } = useServerSideTable(`${import.meta.env.VITE_API_BASE_URL}/admin/allusers`);

  const [modalState, setModalState] = useState({ isOpen: false, user: null });

  // Image preview modal state
  const [previewImage, setPreviewImage] = useState(null);

  const handleToggleClick = (user) => {
    setModalState({ isOpen: true, user });
  };

  const closeStatusModal = () => {
    setModalState({ isOpen: false, user: null });
  };

  const confirmStatusToggle = useCallback(async () => {
    const { user } = modalState;
    if (!user) return;

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/users/${user.id}/status`,
        {},
        { withCredentials: true }
      );

      const updatedUser = response.data.user;

      setData((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      refreshData();
      showModal("success", response.data.message);
    } catch (error) {
      showModal("error", error.response?.data?.message || "Error updating status.");
    } finally {
      closeStatusModal();
    }
  }, [modalState, setData, showModal]);

  const userColumns = useMemo(
    () => [
      {
        header: "SL.No",
        cell: ({ index }) =>
          (tableState.currentPage - 1) * tableState.entriesPerPage + index + 1,
      },
      { header: "Name", accessor: "name", isSearchable: true, isSortable: true },
      { header: "Email", accessor: "email", isSearchable: true, isSortable: true },
      { header: "Mobile", accessor: "mobile", isSearchable: true, isSortable: true },
      {
        header: "Image",
        accessor: "profilePic_url", // <-- use profilePic_url accessor
        cell: ({ row }) => {
          const src = row.original.profilePic_url;
          if (!src) return <div className="text-gray-500 text-xs">No Image</div>;
          return (
            <img
              src={src}
              alt={row.original.name}
              className="h-10 w-10 rounded-full object-cover cursor-pointer hover:opacity-80"
              onClick={() => setPreviewImage(src)} // open image modal on click
            />
          );
        },
      },
      {
        header: "Status",
        accessor: "isActive",
        isSortable: true,
        cell: ({ row }) => <StatusBadge isActive={row.original.isActive} />,
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center justify-center space-x-3">
         

            <button
              onClick={() => handleToggleClick(row.original)}
              title={row.original.isActive ? "Deactivate User" : "Activate User"}
            >
              {row.original.isActive ? (
                <FaTimes className="text-red-600"  />
              ) : (
                <FaCheck className="text-green-600" />
              )}
            </button>
               <button
              onClick={() => navigate(`edit/${row.original.id}`)}
              className="text-blue-500 hover:text-blue-700 transition"
              title="Edit User"
            >
              <FaEdit />
            </button>
          </div>
        ),
      },
    ],
    [navigate, tableState.currentPage, tableState.entriesPerPage]
  );

  return (
    <div>
      <MenuTable
        Ltext="Users"
        Rtext="Add User"
        data={users}
        columns={userColumns}
        addPath="add"
        tableState={tableState}
      />

      {modalState.isOpen && modalState.user && (
        <DeleteConfirmationModal
          onClose={closeStatusModal}
          onConfirm={confirmStatusToggle}
          title={modalState.user.isActive ? "Deactivate User" : "Activate User"}
          message={`Are you sure you want to ${
            modalState.user.isActive ? "deactivate" : "activate"
          } "${modalState.user.name}"?`}
          icon={modalState.user.isActive ? FaTimes : FaCheck}
          confirmText="Confirm"
          cancelText="Cancel"
          confirmButtonClassName={
            modalState.user.isActive
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }
        />
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <ImageModal
          imageUrl={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </div>
  );
};

export default UserList;




