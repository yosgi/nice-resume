"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Bars3Icon } from "@heroicons/react/24/outline";

const SortableItem = <T,>({
  id,
  item,
  index,
  renderItem,
  itemClassName,
  dragLabel,
}: {
  id: UniqueIdentifier;
  item: T;
  index: number;
  renderItem: (
    item: T,
    index: number,
    dragHandle: React.ReactNode
  ) => React.ReactNode;
  itemClassName: string;
  dragLabel: string;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const dragHandle = (
    <button
      type="button"
      aria-label={dragLabel}
      title={dragLabel}
      className="cursor-grab touch-none rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <Bars3Icon className="h-5 w-5" aria-hidden="true" />
    </button>
  );

  return (
    <div
      ref={setNodeRef}
      className={`${itemClassName} ${
        isDragging
          ? "relative z-20 scale-[1.015] opacity-90 shadow-xl ring-2 ring-sky-300"
          : "z-0"
      }`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition || "transform 220ms cubic-bezier(0.2, 0, 0, 1)",
      }}
    >
      {renderItem(item, index, dragHandle)}
    </div>
  );
};

export const SortableList = <T,>({
  items,
  getKey,
  onReorder,
  renderItem,
  className = "",
  itemClassName = "",
  dragLabel,
  strategy = "vertical",
}: {
  items: T[];
  getKey: (item: T, index: number) => UniqueIdentifier;
  onReorder: (fromIndex: number, toIndex: number) => void;
  renderItem: (
    item: T,
    index: number,
    dragHandle: React.ReactNode
  ) => React.ReactNode;
  className?: string;
  itemClassName?: string;
  dragLabel: string;
  strategy?: "vertical" | "rect";
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const ids = items.map(getKey);

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const fromIndex = ids.indexOf(active.id);
    const toIndex = ids.indexOf(over.id);
    if (fromIndex >= 0 && toIndex >= 0) onReorder(fromIndex, toIndex);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={ids}
        strategy={
          strategy === "rect"
            ? rectSortingStrategy
            : verticalListSortingStrategy
        }
      >
        <div className={className}>
          {items.map((item, index) => (
            <SortableItem
              key={getKey(item, index)}
              id={getKey(item, index)}
              item={item}
              index={index}
              renderItem={renderItem}
              itemClassName={itemClassName}
              dragLabel={dragLabel}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
