import { useState } from "react";

type NodeEditorProps = {
  isOpen: boolean;
  onClose: () => void;
  nodeId: string;
  label: string;
  description: string;
  color: string;
  shape: string;
  onSave: (data: {
    label: string;
    description: string;
    color: string;
    shape: string;
  }) => void;
};

export const NodeEditor = ({
  isOpen,
  onClose,
  nodeId,
  label,
  description,
  color,
  shape,
  onSave,
}: NodeEditorProps) => {
  const [newLabel, setNewLabel] = useState(label);
  const [newDescription, setNewDescription] = useState(description);
  const [newColor, setNewColor] = useState(color);
  const [newShape, setNewShape] = useState(shape || "rectangle");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-96 rounded-lg bg-gray-100 p-6 shadow-lg dark:bg-black border border-gray-200 dark:border-neutral-700">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Editar Bloco
        </h2>
        <div className="flex flex-col gap-3">
          <label>
            <span className="text-md font-medium text-gray-900 dark:text-white">
              Título
            </span>
            <input
              className="w-full rounded-md border border-gray-200 bg-gray-100 px-2 py-3 text-sm text-gray-900 shadow-lg placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#FF5555] dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
            />
          </label>

          <label>
            <span className="text-md font-medium text-gray-900 dark:text-white">
              Descrição
            </span>
            <textarea
              className="w-full rounded-md border border-gray-200 bg-gray-100 px-2 py-3 text-sm text-gray-900 shadow-lg placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#FF5555] dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </label>

          <label>
            <span className="text-md font-medium text-gray-900 dark:text-white">
              Cor
            </span>
            <input
              type="color"
              className="h-20 w-full rounded-md border border-gray-200 bg-gray-100 px-2 py-3 text-sm text-gray-900 shadow-lg placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#FF5555] dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
            />
          </label>

          <label>
            <span className="text-md font-medium text-gray-900 dark:text-white">
              Formato
            </span>
            <select
              className="w-full rounded-md border border-gray-200 bg-gray-100 px-2 py-3 text-sm text-gray-900 shadow-lg placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#FF5555] dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
              value={newShape}
              onChange={(e) => setNewShape(e.target.value)}
            >
              <option value="rectangle">Retângulo</option>
              <option value="circle">Círculo</option>
              <option value="diamond">Losango</option>
            </select>
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
            onClick={() => {
              onSave({
                label: newLabel,
                description: newDescription,
                color: newColor,
                shape: newShape,
              });
              onClose();
            }}
            className="rounded-md bg-[#FF5555] px-2 py-2 text-sm text-white shadow-lg hover:bg-[#FF5555]/80"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};
