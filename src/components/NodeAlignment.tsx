import React from "react";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowUp,
  Minus,
  ArrowDown,
} from "lucide-react";
import { Node } from "reactflow";

type AlignmentType =
  | "left"
  | "center"
  | "right"
  | "top"
  | "middle"
  | "bottom"
  | "distribute-h"
  | "distribute-v";

interface NodeAlignmentProps {
  selectedNodes: Node[];
  onAlign: (type: AlignmentType) => void;
}

export const NodeAlignment = ({
  selectedNodes,
  onAlign,
}: NodeAlignmentProps) => {
  if (selectedNodes.length < 2) return null;

  return (
    <div className="fixed top-32 right-6 z-50 flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
      <div className="mb-1 text-xs font-semibold text-gray-600 dark:text-gray-400">
        Alinhar
      </div>
      <div className="grid grid-cols-3 gap-1">
        <button
          onClick={() => onAlign("left")}
          className="rounded p-2 hover:bg-gray-100 dark:hover:bg-neutral-800"
          title="Alinhar à esquerda"
        >
          <AlignLeft size={16} className="text-gray-700 dark:text-gray-300" />
        </button>
        <button
          onClick={() => onAlign("center")}
          className="rounded p-2 hover:bg-gray-100 dark:hover:bg-neutral-800"
          title="Alinhar ao centro"
        >
          <AlignCenter size={16} className="text-gray-700 dark:text-gray-300" />
        </button>
        <button
          onClick={() => onAlign("right")}
          className="rounded p-2 hover:bg-gray-100 dark:hover:bg-neutral-800"
          title="Alinhar à direita"
        >
          <AlignRight size={16} className="text-gray-700 dark:text-gray-300" />
        </button>
        <button
          onClick={() => onAlign("top")}
          className="rounded p-2 hover:bg-gray-100 dark:hover:bg-neutral-800"
          title="Alinhar ao topo"
        >
          <ArrowUp size={16} className="text-gray-700 dark:text-gray-300" />
        </button>
        <button
          onClick={() => onAlign("middle")}
          className="rounded p-2 hover:bg-gray-100 dark:hover:bg-neutral-800"
          title="Alinhar ao meio"
        >
          <Minus size={16} className="text-gray-700 dark:text-gray-300" />
        </button>
        <button
          onClick={() => onAlign("bottom")}
          className="rounded p-2 hover:bg-gray-100 dark:hover:bg-neutral-800"
          title="Alinhar à base"
        >
          <ArrowDown size={16} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>
      <div className="mt-1 border-t border-gray-200 pt-1 dark:border-neutral-700">
        <button
          onClick={() => onAlign("distribute-h")}
          className="w-full rounded px-2 py-1 text-xs hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800"
          title="Distribuir horizontalmente"
        >
          Distribuir H
        </button>
        <button
          onClick={() => onAlign("distribute-v")}
          className="w-full rounded px-2 py-1 text-xs hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800"
          title="Distribuir verticalmente"
        >
          Distribuir V
        </button>
      </div>
    </div>
  );
};
