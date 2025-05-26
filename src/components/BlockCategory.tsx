import { motion } from "framer-motion";
import { Trash2, Star } from "lucide-react";
import { Block } from "../hooks/useSidebarStore";
import { ShapePreview } from "./ShapePreview";

export const BlockCategory = ({
  name,
  items,
  onDragStart,
  onToggleFavorite,
  onRemove,
  onRemoveCategory,
  isFavorites = false,
}: {
  name: string;
  items: Block[];
  onDragStart: (e: React.DragEvent, block: Block) => void;
  onToggleFavorite: (type: string) => void;
  onRemove: (type: string) => void;
  onRemoveCategory?: (name: string) => void;
  isFavorites?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold dark:text-neutral-400">{name}</h3>
        {!isFavorites && onRemoveCategory && (
          <button
            onClick={() => onRemoveCategory(name)}
            className="text-xs text-red-500 hover:text-red-600"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>

      {items.map((node) => (
        <motion.div
          key={node.type}
          onDragStart={(e) => onDragStart(e, node)}
          draggable
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`group relative flex cursor-grab items-center gap-3 rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 shadow-md backdrop-blur transition-all hover:dark:bg-neutral-700/60 hover:bg-gray-300/60 active:cursor-grabbing dark:border-neutral-700 dark:bg-neutral-800/70`}
        >
          <ShapePreview shape={node.shape} color={node.color} />
          <span className="text-sm font-medium">{node.label}</span>

          <div className="ml-auto flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onToggleFavorite(node.type);
              }}
              className="text-neutral-400 hover:text-yellow-400"
            >
              <Star size={14} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onRemove(node.type);
              }}
              className="text-neutral-400 hover:text-red-500"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* 🧠 Tooltip */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-[10px] text-white opacity-0 transition-all group-hover:opacity-100">
            Arraste para criar {node.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
