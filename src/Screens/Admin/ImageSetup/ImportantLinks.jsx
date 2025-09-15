
//with proper image preview
import React, { useState, useMemo, useCallback } from "react";
import axios from "axios";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MenuTable from "@/Components/Admin/Menu/MenuTable";
import DeleteConfirmationModal from "@/Components/Admin/DeleteConfirmationModal/DeleteConfirmationModal";
import { useServerSideTable } from "@/hooks/useServerSideTable";
import { useModal } from "@/context/ModalProvider";
import ImageModal from "@/Components/Admin/ImageModal/ImageModal"; // import ImageModal

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StatusBadge = ({ isActive }) => {
  const text = isActive ? "Active" : "Inactive";
  const classes = isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes}`}>{text}</span>;
};

const ImportantLinks = () => {
  const navigate = useNavigate();
  const { showModal } = useModal();

  const {
    data: importantLinks,
    setData,
    tableState,
  } = useServerSideTable(`${API_BASE_URL}/image-setup/importantlinks`);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // New state for image preview modal
  const [previewImage, setPreviewImage] = useState(null);

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const handleToggleStatus = useCallback(async () => {
    if (!selectedItem) return;

    try {
      const res = await axios.patch(
        `${API_BASE_URL}/image-setup/importantlinks/${selectedItem.id}/status`,
        null,
        { withCredentials: true }
      );

      const updatedItem = res.data.importantLink;

      setData((prev) =>
        prev.map((item) =>
          item.id === updatedItem.id ? { ...item, is_active: updatedItem.is_active } : item
        )
      );

      showModal("success", res.data.message || "Status updated successfully!");
    } catch (error) {
      showModal("error", "Failed to toggle status.");
    } finally {
      closeModal();
    }
  }, [selectedItem, setData, showModal]);

  const columns = useMemo(
    () => [
      {
        header: "SL.No",
        cell: ({ index }) =>
          (tableState.currentPage - 1) * tableState.entriesPerPage + index + 1,
      },
      {
        header: "Image",
        accessor: "image",
        cell: ({ row }) => {
          const imgSrc = row.original.image_url;
          return imgSrc ? (
            <img
              src={imgSrc}
              alt="Link"
              className="h-12 w-24 object-cover rounded cursor-pointer hover:opacity-80"
              onClick={() => setPreviewImage(imgSrc)} // open modal on click
            />
          ) : (
            <div className="text-gray-500 text-xs">No Image</div>
          );
        },
      },
      {
        header: "Link URL",
        accessor: "url",
        isSortable: true,
        cell: ({ row }) => {
          const url = row.original.url;
          return url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm"
            >
              {url}
            </a>
          ) : (
            <span className="text-gray-400 text-sm">No URL</span>
          );
        },
      },
      {
        header: "Status",
        accessor: "is_active",
        isSortable: true,
        cell: ({ row }) => <StatusBadge isActive={row.original.is_active} />,
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => openModal(row.original)}
              className={row.original.is_active ? "text-red-600" : "text-green-600"}
              title={row.original.is_active ? "Deactivate" : "Activate"}
            >
              {row.original.is_active ? <FaTimes /> : <FaCheck />}
            </button>
            <button
              onClick={() =>
                navigate(`/admin/image-setup/important-links/edit/${row.original.id}`)
              }
              className="text-blue-600 hover:text-blue-800 transition"
              title="Edit Link"
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
    <div className="min-h-[80vh]">
      <MenuTable
        Ltext="Important Links"
        Rtext="Add Link"
        data={importantLinks}
        columns={columns}
        addPath="add"
        tableState={tableState}
      />

      {isModalOpen && selectedItem && (
        <DeleteConfirmationModal
          onClose={closeModal}
          onConfirm={handleToggleStatus}
          title={"Change Status"}
          message={`Are you sure you want to ${
            selectedItem.is_active ? "deactivate" : "activate"
          } this link?`}
          icon={selectedItem.is_active ? XCircle : CheckCircle}
          confirmText={"Yes"}
          cancelText="Cancel"
        />
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <ImageModal imageUrl={previewImage} onClose={() => setPreviewImage(null)} />
      )}
    </div>
  );
};

export default ImportantLinks;







