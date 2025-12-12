import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X } from "lucide-react";
import { Node } from "reactflow";
import { NodeComponent } from "./NodeComponent";

interface NodePreviewProps {
  node: Node;
  onClose: () => void;
}

export const NodePreview = ({ node, onClose }: NodePreviewProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-neutral-800"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>

          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              {node.data.label}
            </h2>
            {node.data.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {node.data.description}
              </p>
            )}
          </div>

          <div className="mb-6 flex items-center justify-center rounded-lg bg-gray-50 p-8 dark:bg-neutral-800">
            <div className="scale-150">
              <div
                className={`rounded-lg border-2 px-4 py-2 text-sm shadow-md ${
                  node.data.shape === "circle"
                    ? "h-28 w-28 rounded-full"
                    : node.data.shape === "diamond"
                      ? "h-24 w-24 rotate-45"
                      : "rounded-lg"
                }`}
                style={{
                  backgroundColor: node.data.color || "#FF5555",
                  color: "white",
                }}
              >
                <div
                  className={
                    node.data.shape === "diamond" ? "rotate-[-45deg]" : ""
                  }
                >
                  {node.data.label}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                Formato
              </span>
              <p className="text-sm text-gray-900 dark:text-white">
                {node.data.shape || "rectangle"}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                Cor
              </span>
              <div className="flex items-center gap-2">
                <div
                  className="h-6 w-6 rounded border border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: node.data.color || "#FF5555" }}
                />
                <p className="text-sm text-gray-900 dark:text-white">
                  {node.data.color || "#FF5555"}
                </p>
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                Posição
              </span>
              <p className="text-sm text-gray-900 dark:text-white">
                X: {Math.round(node.position.x)}, Y:{" "}
                {Math.round(node.position.y)}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                ID
              </span>
              <p className="truncate text-sm text-gray-900 dark:text-white">
                {node.id}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
