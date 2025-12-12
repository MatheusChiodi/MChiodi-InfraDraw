import { useEffect, useRef } from "react";
import { Node, Edge } from "reactflow";
import { saveToLocal } from "../utils/storage";

/**
 * Hook para auto-save do canvas
 * Salva automaticamente após um período de inatividade (debounce)
 */
export const useAutoSave = (
  nodes: Node[],
  edges: Edge[],
  enabled: boolean = true,
  delay: number = 2000,
) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>("");

  useEffect(() => {
    if (!enabled) return;

    // Serializa o estado atual para comparar
    const currentState = JSON.stringify({ nodes, edges });

    // Se não houve mudanças, não salva
    if (currentState === lastSavedRef.current) return;

    // Limpa o timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Cria um novo timeout para salvar após o delay
    timeoutRef.current = setTimeout(() => {
      try {
        saveToLocal({ nodes, edges });
        lastSavedRef.current = currentState;
      } catch (error) {
        console.error("Auto-save error:", error);
      }
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [nodes, edges, enabled, delay]);
};
