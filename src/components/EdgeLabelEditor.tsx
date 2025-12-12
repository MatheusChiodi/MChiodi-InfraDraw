import React, { useState } from "react";
import { X } from "lucide-react";
import { Edge } from "reactflow";

interface EdgeLabelEditorProps {
  edge: Edge;
  onSave: (edgeId: string, label: string) => void;
  onClose: () => void;
}

export const EdgeLabelEditor = ({
  edge,
  onSave,
  onClose,
}: EdgeLabelEditorProps) => {
  const [label, setLabel] = useState(
    typeof edge.label === "string" ? edge.label : "",
  );

  const handleSave = () => {
    onSave(edge.id, label);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-96 rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Editar Rótulo da Conexão
          </h2>
          <button
            onClick={onClose}
            className="rounded p-1 hover:bg-gray-100 dark:hover:bg-neutral-800"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <label>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Rótulo
            </span>
            <input
              className="mt-1 w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900 shadow-lg placeholder:text-neutral-500 focus:ring-1 focus:ring-[#FF5555] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Digite o rótulo..."
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") onClose();
              }}
            />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded bg-neutral-300 px-3 py-1 text-gray-950 shadow-lg hover:bg-neutral-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="rounded-md bg-[#FF5555] px-4 py-2 text-sm text-white shadow-lg hover:bg-[#FF5555]/80"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};
