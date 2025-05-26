import { useEffect, useRef, useState } from "react";
import type { Node } from "reactflow";

export const usePresentation = (nodes: Node[]) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    setIsPlaying(true);
    setCurrentIndex(0);
  };

  const stop = () => {
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const next = prev + 1;
          if (next >= nodes.length) {
            stop();
            return prev;
          }
          return next;
        });
      }, 3000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, nodes.length]);

  const currentNode = nodes[currentIndex] || null;

  return { isPlaying, currentNode, start, stop };
};
