import React, { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Node } from "reactflow";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  nodes: Node[];
  onSelectNode: (nodeId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const SearchBar = ({
  nodes,
  onSelectNode,
  isOpen,
  onClose,
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNodes = nodes.filter(
    (node) =>
      node.data.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.data.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSelect = useCallback(
    (nodeId: string) => {
      onSelectNode(nodeId);
      setSearchTerm("");
      onClose();
    },
    [onSelectNode, onClose],
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-20 left-1/2 z-[100] w-full max-w-md -translate-x-1/2"
      >
        <div className="rounded-lg border border-gray-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
          <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3 dark:border-neutral-700">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Buscar nós..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none dark:text-white"
              autoFocus
            />
            <button
              onClick={onClose}
              className="rounded p-1 hover:bg-gray-100 dark:hover:bg-neutral-800"
            >
              <X size={16} />
            </button>
          </div>

          {searchTerm && (
            <div className="max-h-64 overflow-auto">
              {filteredNodes.length > 0 ? (
                filteredNodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => handleSelect(node.id)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:text-white dark:hover:bg-neutral-800"
                  >
                    <div className="font-medium">{node.data.label}</div>
                    {node.data.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {node.data.description}
                      </div>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  Nenhum nó encontrado
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
