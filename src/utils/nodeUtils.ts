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

/**
 * Alinha nós selecionados
 */
export const alignNodes = (
  nodes: Node[],
  selectedNodeIds: string[],
  alignment: AlignmentType,
): Node[] => {
  if (selectedNodeIds.length < 2) return nodes;

  const selectedNodes = nodes.filter((n) => selectedNodeIds.includes(n.id));
  if (selectedNodes.length < 2) return nodes;

  const updatedNodes = [...nodes];

  switch (alignment) {
    case "left": {
      const minX = Math.min(...selectedNodes.map((n) => n.position.x));
      selectedNodes.forEach((node) => {
        const index = updatedNodes.findIndex((n) => n.id === node.id);
        if (index !== -1) {
          updatedNodes[index] = {
            ...updatedNodes[index],
            position: { ...updatedNodes[index].position, x: minX },
          };
        }
      });
      break;
    }

    case "right": {
      const maxX = Math.max(
        ...selectedNodes.map((n) => n.position.x + (n.width || 150)),
      );
      selectedNodes.forEach((node) => {
        const index = updatedNodes.findIndex((n) => n.id === node.id);
        if (index !== -1) {
          const nodeWidth = node.width || 150;
          updatedNodes[index] = {
            ...updatedNodes[index],
            position: { ...updatedNodes[index].position, x: maxX - nodeWidth },
          };
        }
      });
      break;
    }

    case "center": {
      const minX = Math.min(...selectedNodes.map((n) => n.position.x));
      const maxX = Math.max(
        ...selectedNodes.map((n) => n.position.x + (n.width || 150)),
      );
      const centerX = (minX + maxX) / 2;
      selectedNodes.forEach((node) => {
        const index = updatedNodes.findIndex((n) => n.id === node.id);
        if (index !== -1) {
          const nodeWidth = node.width || 150;
          updatedNodes[index] = {
            ...updatedNodes[index],
            position: {
              ...updatedNodes[index].position,
              x: centerX - nodeWidth / 2,
            },
          };
        }
      });
      break;
    }

    case "top": {
      const minY = Math.min(...selectedNodes.map((n) => n.position.y));
      selectedNodes.forEach((node) => {
        const index = updatedNodes.findIndex((n) => n.id === node.id);
        if (index !== -1) {
          updatedNodes[index] = {
            ...updatedNodes[index],
            position: { ...updatedNodes[index].position, y: minY },
          };
        }
      });
      break;
    }

    case "bottom": {
      const maxY = Math.max(
        ...selectedNodes.map((n) => n.position.y + (n.height || 100)),
      );
      selectedNodes.forEach((node) => {
        const index = updatedNodes.findIndex((n) => n.id === node.id);
        if (index !== -1) {
          const nodeHeight = node.height || 100;
          updatedNodes[index] = {
            ...updatedNodes[index],
            position: { ...updatedNodes[index].position, y: maxY - nodeHeight },
          };
        }
      });
      break;
    }

    case "middle": {
      const minY = Math.min(...selectedNodes.map((n) => n.position.y));
      const maxY = Math.max(
        ...selectedNodes.map((n) => n.position.y + (n.height || 100)),
      );
      const centerY = (minY + maxY) / 2;
      selectedNodes.forEach((node) => {
        const index = updatedNodes.findIndex((n) => n.id === node.id);
        if (index !== -1) {
          const nodeHeight = node.height || 100;
          updatedNodes[index] = {
            ...updatedNodes[index],
            position: {
              ...updatedNodes[index].position,
              y: centerY - nodeHeight / 2,
            },
          };
        }
      });
      break;
    }

    case "distribute-h": {
      const sorted = [...selectedNodes].sort(
        (a, b) => a.position.x - b.position.x,
      );
      const firstX = sorted[0].position.x;
      const lastX =
        sorted[sorted.length - 1].position.x +
        (sorted[sorted.length - 1].width || 150);
      const totalWidth = lastX - firstX;
      const spacing = totalWidth / (sorted.length - 1);

      sorted.forEach((node, index) => {
        const nodeIndex = updatedNodes.findIndex((n) => n.id === node.id);
        if (nodeIndex !== -1 && index > 0 && index < sorted.length - 1) {
          updatedNodes[nodeIndex] = {
            ...updatedNodes[nodeIndex],
            position: {
              ...updatedNodes[nodeIndex].position,
              x: firstX + spacing * index - (node.width || 150) / 2,
            },
          };
        }
      });
      break;
    }

    case "distribute-v": {
      const sorted = [...selectedNodes].sort(
        (a, b) => a.position.y - b.position.y,
      );
      const firstY = sorted[0].position.y;
      const lastY =
        sorted[sorted.length - 1].position.y +
        (sorted[sorted.length - 1].height || 100);
      const totalHeight = lastY - firstY;
      const spacing = totalHeight / (sorted.length - 1);

      sorted.forEach((node, index) => {
        const nodeIndex = updatedNodes.findIndex((n) => n.id === node.id);
        if (nodeIndex !== -1 && index > 0 && index < sorted.length - 1) {
          updatedNodes[nodeIndex] = {
            ...updatedNodes[nodeIndex],
            position: {
              ...updatedNodes[nodeIndex].position,
              y: firstY + spacing * index - (node.height || 100) / 2,
            },
          };
        }
      });
      break;
    }
  }

  return updatedNodes;
};

/**
 * Duplica nós selecionados
 */
export const duplicateNodes = (
  nodes: Node[],
  selectedNodeIds: string[],
): Node[] => {
  const selectedNodes = nodes.filter((n) => selectedNodeIds.includes(n.id));
  const newNodes: Node[] = selectedNodes.map((node) => ({
    ...node,
    id: `${node.id}-copy-${Date.now()}-${Math.random()}`,
    position: {
      x: node.position.x + 50,
      y: node.position.y + 50,
    },
    selected: false,
  }));

  return [...nodes, ...newNodes];
};

/**
 * Copia nós para clipboard
 */
export const copyNodesToClipboard = (
  nodes: Node[],
  selectedNodeIds: string[],
): string => {
  const selectedNodes = nodes.filter((n) => selectedNodeIds.includes(n.id));
  return JSON.stringify(selectedNodes);
};

/**
 * Cola nós do clipboard
 */
export const pasteNodesFromClipboard = (
  clipboardData: string,
  offset: { x: number; y: number } = { x: 50, y: 50 },
): Node[] => {
  try {
    const nodes: Node[] = JSON.parse(clipboardData);
    return nodes.map((node) => ({
      ...node,
      id: `${node.id}-paste-${Date.now()}-${Math.random()}`,
      position: {
        x: node.position.x + offset.x,
        y: node.position.y + offset.y,
      },
      selected: false,
    }));
  } catch {
    return [];
  }
};
