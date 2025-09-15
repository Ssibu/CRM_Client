
//with proper preview
import React, { useState, useMemo, useCallback } from "react";
import axios from "axios";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MenuTable from "../../../Components/Admin/Menu/MenuTable";
import DeleteConfirmationModal from "../../../Components/Admin/DeleteConfirmationModal/DeleteConfirmationModal";
import { useServerSideTable } from "../../../hooks/useServerSideTable";
import { useModal } from "../../../context/ModalProvider";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StatusBadge = ({ isActive }) => {
  const text = isActive ? "Active" : "Inactive";
  const classes = isActive
    ? "bg-green-100 text-green-800"
    : "bg-red-100 text-red-800";
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes}`}>
      {text}
    </span>
  );
};

// ✅ Video Preview Modal
const VideoModal = ({ videoUrl, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute -top-2 -right-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>
        <video
          src={videoUrl}
          controls
          autoPlay
          className="w-full rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

const VideoGalleryList = () => {
  const navigate = useNavigate();
  const { showModal } = useModal();

  const { data: videoItems, setData, tableState } = useServerSideTable(
    `${API_BASE_URL}/image-setup/all-videos`
  );

  // status toggle modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // preview video modal
  const [previewVideo, setPreviewVideo] = useState(null);

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
        `${API_BASE_URL}/image-setup/toggle-video-status/${selectedItem.id}`,
        null,
        { withCredentials: true }
      );

      const updatedItem = res.data.video;
      setData((prev) =>
        prev.map((item) =>
          item.id === updatedItem.id ? { ...item, status: updatedItem.status } : item
        )
      );
      showModal("success", res.data.message);
    } catch (error) {
      showModal("error", "Failed to toggle status.");
    } finally {
      closeModal();
    }
  }, [selectedItem, setData, showModal]);

  const videoColumns = useMemo(
    () => [
      {
        header: "SL.No",
        cell: ({ index }) =>
          (tableState.currentPage - 1) * tableState.entriesPerPage + index + 1,
      },
      {
        header: "Category",
        accessor: "category_name",
        isSearchable: true,
        isSortable: true,
      },
      {
        header: "Title (English)",
        accessor: "en_title",
        isSearchable: true,
        isSortable: true,
      },
      {
        header: "Title (Odia)",
        accessor: "od_title",
        isSearchable: true,
        isSortable: true,
      },
      {
        header: "Video",
        accessor: "video_url",
        cell: ({ row }) => {
          const videoSrc = row.original.video_url;
          return videoSrc ? (
            <div
              className="cursor-pointer"
              onClick={() => setPreviewVideo(videoSrc)}
            >
              <video
                src={videoSrc}
                className="h-24 w-40 object-cover rounded shadow bg-black"
              />
            </div>
          ) : (
            <div className="text-gray-500 text-xs">No Video</div>
          );
        },
      },
      {
        header: "Status",
        accessor: "status",
        isSortable: true,
        cell: ({ row }) => <StatusBadge isActive={row.original.status} />,
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => openModal(row.original)}
              className={row.original.status ? "text-red-600" : "text-green-600"}
              title={row.original.status ? "Deactivate Video" : "Activate Video"}
            >
              {row.original.status ? <FaTimes /> : <FaCheck />}
            </button>
            <button
              onClick={() =>
                navigate(`/admin/image-setup/video-galary/edit/${row.original.id}`)
              }
              className="text-blue-600 hover:text-blue-800 transition"
              title="Edit Video"
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
        Ltext="Video Gallery"
        Rtext="Add Video"
        data={videoItems}
        columns={videoColumns}
        addPath="add"
        tableState={tableState}
      />

      {/* ✅ Status Change Modal */}
      {isModalOpen && selectedItem && (
        <DeleteConfirmationModal
          onClose={closeModal}
          onConfirm={handleToggleStatus}
          title={"Change Status"}
          message={`Are you sure you want to ${
            selectedItem.status ? "deactivate" : "activate"
          } "${selectedItem.en_title}"?`}
          icon={selectedItem.status ? XCircle : CheckCircle}
          confirmText={"Yes"}
          cancelText="Cancel"
        />
      )}

      {/* ✅ Video Preview Modal */}
      {previewVideo && (
        <VideoModal videoUrl={previewVideo} onClose={() => setPreviewVideo(null)} />
      )}
    </div>
  );
};

export default VideoGalleryList;