import { useState, useCallback, useRef } from "react";
import { Node, Edge } from "reactflow";

interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

/**
 * Hook para funcionalidade de Undo/Redo
 * Mantém um histórico de estados do canvas
 */
export const useUndoRedo = (initialNodes: Node[], initialEdges: Edge[]) => {
  const [history, setHistory] = useState<HistoryState[]>([
    { nodes: initialNodes, edges: initialEdges },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isUpdatingRef = useRef(false);
  const currentIndexRef = useRef(0);

  // Atualiza ref quando currentIndex muda
  currentIndexRef.current = currentIndex;

  // Estado atual
  const currentState = history[currentIndex];

  // Adiciona um novo estado ao histórico
  const addToHistory = useCallback((nodes: Node[], edges: Edge[]) => {
    // Previne loops infinitos
    if (isUpdatingRef.current) return;

    setHistory((prevHistory) => {
      const newState = { nodes, edges };
      const idx = currentIndexRef.current;

      // Remove estados futuros se houver (quando fazemos undo e depois uma nova ação)
      const newHistory = prevHistory.slice(0, idx + 1);

      // Adiciona o novo estado
      newHistory.push(newState);

      // Limita o histórico a 50 estados para evitar uso excessivo de memória
      const limitedHistory = newHistory.slice(-50);

      setCurrentIndex(limitedHistory.length - 1);
      currentIndexRef.current = limitedHistory.length - 1;
      return limitedHistory;
    });
  }, []);

  // Desfazer - retorna o estado anterior
  const undo = useCallback(() => {
    setHistory((prevHistory) => {
      const idx = currentIndexRef.current;
      if (idx > 0) {
        isUpdatingRef.current = true;
        const newIndex = idx - 1;
        setCurrentIndex(newIndex);
        currentIndexRef.current = newIndex;
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 100);
        return prevHistory;
      }
      return prevHistory;
    });
    return currentIndexRef.current > 0;
  }, []);

  // Refazer - retorna o próximo estado
  const redo = useCallback(() => {
    setHistory((prevHistory) => {
      const idx = currentIndexRef.current;
      if (idx < prevHistory.length - 1) {
        isUpdatingRef.current = true;
        const newIndex = idx + 1;
        setCurrentIndex(newIndex);
        currentIndexRef.current = newIndex;
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 100);
        return prevHistory;
      }
      return prevHistory;
    });
    return currentIndexRef.current < history.length - 1;
  }, [history.length]);

  // Verifica se pode desfazer
  const canUndo = currentIndex > 0;

  // Verifica se pode refazer
  const canRedo = currentIndex < history.length - 1;

  // Reseta o histórico
  const resetHistory = useCallback((nodes: Node[], edges: Edge[]) => {
    setHistory([{ nodes, edges }]);
    setCurrentIndex(0);
    currentIndexRef.current = 0;
    isUpdatingRef.current = false;
  }, []);

  // Função para obter o estado atual (para uso em callbacks)
  const getCurrentState = useCallback(() => {
    return history[currentIndexRef.current];
  }, [history]);

  return {
    currentState,
    getCurrentState,
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
  };
};
