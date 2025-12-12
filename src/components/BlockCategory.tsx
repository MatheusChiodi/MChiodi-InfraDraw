import React from "react";
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
        <div key={node.type} className="flex flex-col gap-1">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: items.indexOf(node) * 0.03 }}
            onDragStart={(e) => {
              const dragEvent = e as unknown as React.DragEvent;
              onDragStart(dragEvent, node);
            }}
            draggable
            whileHover={{ scale: 1.03, y: -2, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.97 }}
            className={`group relative flex cursor-grab items-center gap-3 rounded-lg border border-gray-200/80 bg-white/60 px-4 py-2.5 shadow-md backdrop-blur-sm transition-all hover:bg-white/90 hover:border-[#FF5555]/30 active:cursor-grabbing dark:border-neutral-700/80 dark:bg-neutral-800/60 hover:dark:bg-neutral-700/80 hover:dark:border-[#FF5555]/30`}
          >
            <ShapePreview shape={node.shape} color={node.color} />
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-medium">{node.label}</span>
              {(node as any).description && (
                <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {(node as any).description}
                </span>
              )}
            </div>

            <div className="ml-auto flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onToggleFavorite(node.type);
                }}
                className="text-neutral-400 hover:text-yellow-400"
                title="Favoritar"
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
                title="Remover"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Enhanced Tooltip */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-900/90 px-2.5 py-1.5 text-[10px] font-medium text-white shadow-lg backdrop-blur-sm pointer-events-none z-50"
            >
              Arraste para criar {node.label}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                <div className="border-4 border-transparent border-t-neutral-900/90" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      ))}
    </div>
  );
};
