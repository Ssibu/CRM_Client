import React, { useEffect, useState, useMemo } from "react";
import MenuTable from "../../../Components/Menu/MenuTable";
import DeleteConfirmationModal from "../../../Components/DeleteConfirmationModal/DeleteConfirmationModal";
import { FaEdit } from "react-icons/fa";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

const HomepageBannerList = () => {
  const [banners, setBanners] = useState([]);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/image-setup/allhomepagebanners`,
          { withCredentials: true }
        );
        setBanners(res.data.banners || []);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  const openStatusModal = (banner) => {
    setSelectedBanner(banner);
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setSelectedBanner(null);
    setIsStatusModalOpen(false);
  };

  const confirmStatusToggle = async () => {
    if (!selectedBanner) return;

    try {
      // Call the toggle status API endpoint
      await axios.put(
        `${process.env.REACT_APP_API_URL}/image-setup/homepage/banner/toggle-status/${selectedBanner.id}`,
        {}, // no body needed for toggle
        { withCredentials: true }
      );

      // Update UI state after successful toggle
      setBanners((prev) =>
        prev.map((b) =>
          b.id === selectedBanner.id ? { ...b, is_active: !b.is_active } : b
        )
      );

      console.log(
        `Banner ID ${selectedBanner.id} status toggled to ${
          !selectedBanner.is_active ? "Active" : "Inactive"
        }`
      );
    } catch (error) {
      console.error(
        "Error updating banner status:",
        error.response?.data || error.message
      );
    } finally {
      closeStatusModal();
    }
  };

  const bannerColumns = useMemo(
    () => [
      {
        header: "SL.No",
        accessor: "id",
        cell: ({ pageContext }) => {
          if (!pageContext) return null;
          const { currentPage, entriesPerPage, index } = pageContext;
          return (currentPage - 1) * entriesPerPage + index + 1;
        },
      },
      {
        header: "Image",
        accessor: "banner",
        cell: ({ row }) => {
          let imagePath = row.original.banner; // e.g. "\uploads\banners\banner-xxx.jpg"

          if (!imagePath) return <div className="text-gray-500">No Image</div>;

          // Normalize backslashes to forward slashes
          imagePath = imagePath.replace(/\\/g, "/");

          // Remove leading "/uploads/" or "uploads/" if present
          imagePath = imagePath.replace(/^\/?uploads\//, "");

          const imgSrc = `${process.env.REACT_APP_API_URL}/uploads/${imagePath}`;

          return (
            <img
              src={imgSrc}
              alt={`Banner ${row.original.id}`}
              className="h-12 w-24 rounded object-cover"
            />
          );
        },
      },
      {
        header: "Status",
        accessor: "is_active",
        cell: ({ row }) => <StatusBadge isActive={row.original.is_active} />,
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(`edit/${row.original.id}`)}
              className="text-blue-500 hover:text-blue-700 transition"
              title="Edit Banner"
            >
              <FaEdit />
            </button>

            <button
              onClick={() => openStatusModal(row.original)}
              className={`text-xl ${
                row.original.is_active ? "text-green-600" : "text-red-600"
              }`}
              title={row.original.is_active ? "Set Inactive" : "Set Active"}
            >
              {row.original.is_active ? "✔" : "✖"}
            </button>
          </div>
        ),
      },
    ],
    [navigate]
  );

  return (
    <div className="p-6">
      <MenuTable
        Ltext="Homepage Banners"
        Rtext="Add Banner"
        data={banners}
        columns={bannerColumns}
        addPath="add"
      />

      {isStatusModalOpen && selectedBanner && (
        <DeleteConfirmationModal
          onClose={closeStatusModal}
          onConfirm={confirmStatusToggle}
          title={`${selectedBanner.is_active ? "Deactivate" : "Activate"} Banner`}
          message={`Are you sure you want to ${
            selectedBanner.is_active ? "deactivate" : "activate"
          } banner ID ${selectedBanner.id}?`}
          icon={Trash2}
          confirmText="Confirm"
          cancelText="Cancel"
          confirmButtonClassName={
            selectedBanner.is_active
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }
          iconColorClass={
            selectedBanner.is_active ? "text-red-500" : "text-green-500"
          }
        />
      )}
    </div>
  );
};

export default HomepageBannerList;
