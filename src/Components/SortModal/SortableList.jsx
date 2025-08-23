// components/SortModal/SortableList.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";

/**
 * SortableItem
 * - id: unique id
 * - item: object (display props)
 */
const SortableItem = ({ id, item, listeners, attributes, isDragging, transform, transition }) => {
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.995 }}
      className={`flex items-center gap-4 p-3 rounded-xl cursor-grab shadow-sm
                  ${isDragging ? "ring-2 ring-yellow-300/40 bg-white/8" : "bg-white/3 hover:bg-white/5"}
                  border border-white/6`}
      style={style}
      {...listeners}
      {...attributes}
      role="button"
      aria-roledescription="sortable"
      aria-label={`Drag ${item.en}`}
    >
      {/* drag handle icon */}
      <div className="p-2 rounded-md bg-white/4 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blac" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h16" />
        </svg>
      </div>

      {/* content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium truncate">{item.en}</div>
          <div className="text-xs text-gray-300">{item.status || ""}</div>
        </div>
        <div className="text-xs text-gray-400 mt-1 truncate">{item.od}</div>
      </div>
    </motion.div>
  );
};

/**
 * SortableList - wraps dnd-kit behavior
 * - items: array of objects with `.id` and display props
 * - onChange: (newOrderedItems) => void
 */
const SortableList = ({ items = [], onChange }) => {
  // local copy so drag overlay can render
  const [local, setLocal] = useState(items);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => setLocal(items), [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = local.findIndex((i) => i.id === active.id);
      const newIndex = local.findIndex((i) => i.id === over.id);
      const newList = arrayMove(local, oldIndex, newIndex);
      setLocal(newList);
      onChange?.(newList);
    }
  };

  const handleDragCancel = () => setActiveId(null);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={local.map((i) => i.id)} strategy={rectSortingStrategy}>
        <div className="flex flex-col gap-3">
          {local.map((item) => (
            <SortableRow key={item.id} id={item.id} item={item} />
          ))}
        </div>
      </SortableContext>

      <DragOverlay dropAnimation={{ duration: 160 }}>
        {activeId ? (
          (() => {
            const activeItem = local.find((i) => i.id === activeId);
            if (!activeItem) return null;
            return (
              <div className="w-[min(640px,80vw)] p-3 rounded-xl shadow-xl bg-white/7 border border-white/8">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-md bg-white/4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h16" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{activeItem.en}</div>
                    <div className="text-xs text-gray-400 truncate">{activeItem.od}</div>
                  </div>
                </div>
              </div>
            );
          })()
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

/**
 * SortableRow - wrapper to create a sortable hook
 */
function SortableRow({ id, item }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div ref={setNodeRef}>
      <SortableItem
        id={id}
        item={item}
        listeners={listeners}
        attributes={attributes}
        isDragging={isDragging}
        transform={transform}
        transition={transition}
      />
    </div>
  );
}

export default SortableList;
