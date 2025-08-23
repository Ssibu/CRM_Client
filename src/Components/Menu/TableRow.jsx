import React, { useState } from "react";
import { FaEdit, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import ImageModal from "../ImageModal/ImageModal";
import DeleteConfirmationModal from "../DeleteConfirmationModal/DeleteConfirmationModal";
import { Trash2 } from "lucide-react";

const TableRow = ({
  item,
  idx,
  currentPage,
  entriesPerPage,
  highlightMatch,
  searchTerm,
}) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const imageUrl =
    "https://images.unsplash.com/photo-1754147388611-c0f0179a05b5?w=500&auto=format&fit=crop&q=60";

  const handleDelete = () => {
    console.log("Deleting item:", item); // Replace with actual logic
  };

  return (
    <>
      <motion.tr
        className="border-b hover:bg-gray-50 transition-all"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.05 }}
      >
        <td className="p-2">{(currentPage - 1) * entriesPerPage + idx + 1}</td>
        <td className="p-2">{highlightMatch(item.en, searchTerm)}</td>
        <td className="p-2 font-odia">{highlightMatch(item.od, searchTerm)}</td>
        <td className="p-2">
          <div
            className="w-10 h-10 bg-gray-200 rounded overflow-hidden cursor-pointer"
            onClick={() => setIsImageModalOpen(true)}
          >
            <img
              src={imageUrl}
              alt="Thumbnail"
              className="w-full h-full object-cover"
            />
          </div>
        </td>
        <td className="p-2 text-green-600 font-semibold">{item.status}</td>
        <td className="p-2 flex space-x-2">
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-red-500 hover:text-red-700 transition"
          >
            <FaTimes />
          </button>
          <button className="text-blue-500 hover:text-blue-700 transition">
            <FaEdit />
          </button>
        </td>
      </motion.tr>

      {isImageModalOpen && (
        <ImageModal
          imageUrl={imageUrl}
          onClose={() => setIsImageModalOpen(false)}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Delete Menu Item"
          message={`Are you sure you want to delete "${item.en}"? This action cannot be undone.`}
          icon={Trash2}
          confirmText=" Delete"
          cancelText="Cancel"
        />
      )}
    </>
  );
};

export default TableRow;
