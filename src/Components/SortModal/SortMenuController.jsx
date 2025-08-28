// components/SortModal/SortMenuController.jsx
import React, { useState } from "react";
import SortModal from "./SortModal";
import SortableList from "./SortableList";
import { motion } from "framer-motion";

/**
 * SortMenuController
 * - open (bool)
 * - onClose()
 * - items (array)
 * - onSave(newItems)
 */
const SortMenuController = ({ open, onClose, items = [], onSave }) => {
  const [localItems, setLocalItems] = useState(items);

  // when items prop changes from parent, sync
  React.useEffect(() => setLocalItems(items), [items]);

  const handleChange = (newList) => setLocalItems(newList);

  const handleSave = () => {
    onSave?.(localItems);
    onClose?.();
  };

  return (
    <SortModal
      isOpen={open}
      onClose={onClose}
      title="Reorder Menu Items"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm hover:bg-white/5 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md bg-yellow-400 hover:bg-yellow-500 text-black font-semibold transition"
          >
            Save Order
          </button>
        </>
      }
    >
      <div className="max-h-[60vh] overflow-auto pr-2">
        <SortableList items={localItems} onChange={handleChange} />
      </div>
    </SortModal>
  );
};

export default SortMenuController;
