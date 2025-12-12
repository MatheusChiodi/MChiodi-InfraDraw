import React from "react";
import { useTheme } from "../hooks/useTheme";
import { useCallback, useState, useRef, useEffect, useMemo } from "react";
import {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  MarkerType,
  NodeMouseHandler,
  ConnectionLineType,
  Position,
} from "reactflow";

import { NodeEditor } from "./NodeEditor";
import { NodeComponent } from "./NodeComponent";
import { Toolbar } from "./Toolbar";
import { ToastContainer } from "./Toast";
import { SearchBar } from "./SearchBar";
import { NodeAlignment } from "./NodeAlignment";
import { EdgeLabelEditor } from "./EdgeLabelEditor";
import { saveToLocal, loadFromLocal, clearLocal } from "../utils/storage";
import { exportAsPng, exportAsSvg, exportAsPdf } from "../utils/export";
import { useAutoSave } from "../hooks/useAutoSave";
import { useUndoRedo } from "../hooks/useUndoRedo";
import { useToast } from "../hooks/useToast";
import {
  alignNodes,
  duplicateNodes,
  copyNodesToClipboard,
  pasteNodesFromClipboard,
} from "../utils/nodeUtils";
import "reactflow/dist/style.css";
import ReactFlow, { useReactFlow } from "reactflow";

const nodeTypes = {
  customNode: NodeComponent,
};

export const Canvas = ({ focusMode }: { focusMode: boolean }) => {
  const { theme } = useTheme();
  const { toasts, removeToast, success, error, info } = useToast();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [clipboard, setClipboard] = useState<string>("");
  const reactFlowInstance = useReactFlow();

  // Undo/Redo
  const {
    currentState: historyState,
    getCurrentState,
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
  } = useUndoRedo(nodes, edges);

  // Auto-save
  useAutoSave(nodes, edges, true, 2000);

  // Carrega dados salvos na inicialização
  useEffect(() => {
    const data = loadFromLocal();
    if (data && data.nodes && data.edges) {
      setNodes(data.nodes || []);
      setEdges(data.edges || []);
      resetHistory(data.nodes || [], data.edges || []);
      info("Projeto carregado automaticamente");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Ref para rastrear se estamos atualizando do histórico (para evitar loops)
  const isUpdatingFromHistoryRef = useRef(false);

  // Função para atualizar do histórico
  const updateFromHistory = useCallback(() => {
    const state = getCurrentState();
    if (state) {
      isUpdatingFromHistoryRef.current = true;
      setNodes(state.nodes);
      setEdges(state.edges);
      setTimeout(() => {
        isUpdatingFromHistoryRef.current = false;
      }, 100);
    }
  }, [getCurrentState, setNodes, setEdges]);

  // Atualiza nós selecionados
  useEffect(() => {
    const selected = nodes.filter((node) => node.selected);
    setSelectedNodes(selected);
  }, [nodes]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      setEdges((eds) => {
        const newEdges = addEdge(
          {
            ...params,
            markerEnd: { type: MarkerType.ArrowClosed },
            label: "",
          },
          eds,
        );
        // Adiciona ao histórico após conectar
        if (!isUpdatingFromHistoryRef.current) {
          setTimeout(() => {
            addToHistory(nodes, newEdges);
          }, 100);
        }
        return newEdges;
      });
    },
    [setEdges, nodes, addToHistory],
  );

  const onEdgeDoubleClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
  }, []);

  const handleSaveEdgeLabel = useCallback(
    (edgeId: string, label: string) => {
      setEdges((eds) => {
        const newEdges = eds.map((e) =>
          e.id === edgeId ? { ...e, label } : e,
        );
        if (!isUpdatingFromHistoryRef.current) {
          setTimeout(() => {
            addToHistory(nodes, newEdges);
          }, 100);
        }
        return newEdges;
      });
      success("Rótulo da conexão atualizado");
    },
    [setEdges, nodes, addToHistory, success],
  );

  const onNodeDoubleClick: NodeMouseHandler = (_, node) => {
    setSelectedNode(node);
  };

  const onSaveNode = useCallback(
    (data: {
      label: string;
      description: string;
      color: string;
      shape: string;
    }) => {
      setNodes((nds) => {
        const newNodes = nds.map((n) =>
          n.id === selectedNode?.id
            ? {
                ...n,
                data: {
                  ...n.data,
                  label: data.label,
                  description: data.description,
                  color: data.color,
                  shape: data.shape,
                },
              }
            : n,
        );
        // Adiciona ao histórico após salvar nó
        if (!isUpdatingFromHistoryRef.current) {
          setTimeout(() => {
            addToHistory(newNodes, edges);
          }, 100);
        }
        return newNodes;
      });
      success("Nó atualizado");
    },
    [selectedNode, setNodes, edges, addToHistory, success],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = (
        event.target as HTMLElement
      ).getBoundingClientRect();

      const data = event.dataTransfer.getData("application/reactflow");
      if (!data) return;

      const block = JSON.parse(data);

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode: Node = {
        id: `${block.type}-${+new Date()}`,
        type: "customNode",
        position,
        data: {
          label: block.label,
          description: "",
          color: block.color,
          shape: block.shape,
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };

      setNodes((nds) => {
        const newNodes = nds.concat(newNode);
        // Adiciona ao histórico após adicionar nó
        if (!isUpdatingFromHistoryRef.current) {
          setTimeout(() => {
            addToHistory(newNodes, edges);
          }, 100);
        }
        return newNodes;
      });
      success(`${block.label} adicionado`);
    },
    [setNodes, edges, addToHistory, success],
  );

  const handleSave = useCallback(() => {
    try {
      saveToLocal({ nodes, edges });
      success("Projeto salvo no navegador!");
    } catch (err) {
      error("Erro ao salvar projeto");
    }
  }, [nodes, edges, success, error]);

  const handleLoad = useCallback(() => {
    try {
      const data = loadFromLocal();
      if (data && (data.nodes || data.edges)) {
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
        resetHistory(data.nodes || [], data.edges || []);
        success("Projeto carregado com sucesso!");
      } else {
        info("Nenhum projeto salvo encontrado.");
      }
    } catch (err) {
      error("Erro ao carregar projeto");
    }
  }, [setNodes, setEdges, resetHistory, success, info, error]);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          if (json.nodes || json.edges) {
            setNodes(json.nodes || []);
            setEdges(json.edges || []);
            resetHistory(json.nodes || [], json.edges || []);
            success("Projeto importado com sucesso!");
          } else {
            error("Arquivo inválido");
          }
        } catch (err) {
          error("Erro ao ler arquivo JSON");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [setNodes, setEdges, resetHistory, success, error]);

  const handleExport = useCallback(() => {
    try {
      const json = JSON.stringify({ nodes, edges }, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "InfraDraw-project.json";
      a.click();
      URL.revokeObjectURL(url);
      success("Projeto exportado com sucesso!");
    } catch (err) {
      error("Erro ao exportar projeto");
    }
  }, [nodes, edges, success, error]);

  const handleClear = useCallback(() => {
    if (
      window.confirm(
        "Tem certeza que deseja limpar o projeto? Esta ação não pode ser desfeita.",
      )
    ) {
      clearLocal();
      setNodes([]);
      setEdges([]);
      resetHistory([], []);
      success("Projeto limpo!");
    }
  }, [setNodes, setEdges, resetHistory, success]);

  const handleDeleteNodes = useCallback(() => {
    if (selectedNodes.length === 0) return;

    const nodeIds = selectedNodes.map((n) => n.id);
    setNodes((nds) => {
      const newNodes = nds.filter((n) => !nodeIds.includes(n.id));
      return newNodes;
    });
    setEdges((eds) => {
      const newEdges = eds.filter(
        (e) => !nodeIds.includes(e.source) && !nodeIds.includes(e.target),
      );
      // Adiciona ao histórico após deletar
      if (!isUpdatingFromHistoryRef.current) {
        setTimeout(() => {
          const updatedNodes = nodes.filter((n) => !nodeIds.includes(n.id));
          addToHistory(updatedNodes, newEdges);
        }, 100);
      }
      return newEdges;
    });
    setSelectedNodes([]);
    success(`${selectedNodes.length} nó(s) removido(s)`);
  }, [selectedNodes, setNodes, setEdges, nodes, addToHistory, success]);

  const handleDuplicateNodes = useCallback(() => {
    if (selectedNodes.length === 0) return;
    const nodeIds = selectedNodes.map((n) => n.id);
    const newNodes = duplicateNodes(nodes, nodeIds);
    setNodes(newNodes);
    if (!isUpdatingFromHistoryRef.current) {
      setTimeout(() => {
        addToHistory(newNodes, edges);
      }, 100);
    }
    success(`${selectedNodes.length} nó(s) duplicado(s)`);
  }, [selectedNodes, nodes, edges, setNodes, addToHistory, success]);

  const handleCopyNodes = useCallback(() => {
    if (selectedNodes.length === 0) return;
    const nodeIds = selectedNodes.map((n) => n.id);
    const clipboardData = copyNodesToClipboard(nodes, nodeIds);
    setClipboard(clipboardData);
    success(`${selectedNodes.length} nó(s) copiado(s)`);
  }, [selectedNodes, nodes, success]);

  const handlePasteNodes = useCallback(() => {
    if (!clipboard) return;
    const newNodes = pasteNodesFromClipboard(clipboard);
    if (newNodes.length > 0) {
      setNodes((nds) => [...nds, ...newNodes]);
      if (!isUpdatingFromHistoryRef.current) {
        setTimeout(() => {
          addToHistory([...nodes, ...newNodes], edges);
        }, 100);
      }
      success(`${newNodes.length} nó(s) colado(s)`);
    }
  }, [clipboard, nodes, edges, setNodes, addToHistory, success]);

  const handleAlignNodes = useCallback(
    (
      alignment:
        | "left"
        | "center"
        | "right"
        | "top"
        | "middle"
        | "bottom"
        | "distribute-h"
        | "distribute-v",
    ) => {
      if (selectedNodes.length < 2) return;
      const nodeIds = selectedNodes.map((n) => n.id);
      const alignedNodes = alignNodes(nodes, nodeIds, alignment);
      setNodes(alignedNodes);
      if (!isUpdatingFromHistoryRef.current) {
        setTimeout(() => {
          addToHistory(alignedNodes, edges);
        }, 100);
      }
      success("Nós alinhados");
    },
    [selectedNodes, nodes, edges, setNodes, addToHistory, success],
  );

  const handleSelectNode = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        setNodes((nds) =>
          nds.map((n) => ({
            ...n,
            selected: n.id === nodeId,
          })),
        );
        // Foca no nó após um pequeno delay para garantir que o ReactFlow está pronto
        setTimeout(() => {
          const reactFlowElement = document.querySelector(
            ".react-flow__viewport",
          ) as HTMLElement;
          if (reactFlowElement) {
            reactFlowElement.scrollTo({
              left: node.position.x - window.innerWidth / 2,
              top: node.position.y - window.innerHeight / 2,
              behavior: "smooth",
            });
          }
        }, 100);
      }
    },
    [nodes, setNodes],
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const handleExportPng = useCallback(() => {
    if (containerRef.current) {
      try {
        exportAsPng(containerRef.current);
        success("Imagem PNG exportada!");
      } catch (err) {
        error("Erro ao exportar PNG");
      }
    }
  }, [success, error]);

  const handleExportSvg = useCallback(() => {
    if (containerRef.current) {
      try {
        exportAsSvg(containerRef.current);
        success("Imagem SVG exportada!");
      } catch (err) {
        error("Erro ao exportar SVG");
      }
    }
  }, [success, error]);

  const handleExportPdf = useCallback(() => {
    if (containerRef.current) {
      try {
        exportAsPdf(containerRef.current);
        success("PDF exportado!");
      } catch (err) {
        error("Erro ao exportar PDF");
      }
    }
  }, [success, error]);

  // Memoiza nodeTypes para evitar re-renders
  const memoizedNodeTypes = useMemo(() => nodeTypes, []);

  // Atalhos de teclado - deve vir depois de todas as declarações de funções
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+Z ou Cmd+Z para undo
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "z" &&
        !event.shiftKey
      ) {
        event.preventDefault();
        if (canUndo) {
          undo();
          setTimeout(() => {
            updateFromHistory();
            info("Desfeito");
          }, 50);
        }
      }

      // Ctrl+Shift+Z ou Cmd+Shift+Z para redo
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "z" &&
        event.shiftKey
      ) {
        event.preventDefault();
        if (canRedo) {
          redo();
          setTimeout(() => {
            updateFromHistory();
            info("Refeito");
          }, 50);
        }
      }

      // Ctrl+Y para redo (alternativa)
      if ((event.ctrlKey || event.metaKey) && event.key === "y") {
        event.preventDefault();
        if (canRedo) {
          redo();
          setTimeout(() => {
            updateFromHistory();
            info("Refeito");
          }, 50);
        }
      }

      // Ctrl+S para salvar
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        handleSave();
      }

      // Ctrl+F para buscar
      if ((event.ctrlKey || event.metaKey) && event.key === "f") {
        event.preventDefault();
        setShowSearch(true);
      }

      // Ctrl+D para duplicar
      if ((event.ctrlKey || event.metaKey) && event.key === "d") {
        event.preventDefault();
        if (selectedNodes.length > 0) {
          handleDuplicateNodes();
        }
      }

      // Ctrl+C para copiar
      if ((event.ctrlKey || event.metaKey) && event.key === "c") {
        if (selectedNodes.length > 0 && !event.shiftKey) {
          event.preventDefault();
          handleCopyNodes();
        }
      }

      // Ctrl+V para colar
      if ((event.ctrlKey || event.metaKey) && event.key === "v") {
        if (clipboard && !event.shiftKey) {
          event.preventDefault();
          handlePasteNodes();
        }
      }

      // Delete para remover nós selecionados
      if (event.key === "Delete" || event.key === "Backspace") {
        if (selectedNodes.length > 0) {
          event.preventDefault();
          handleDeleteNodes();
        }
      }

      // ESC para fechar busca
      if (event.key === "Escape") {
        setShowSearch(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    canUndo,
    canRedo,
    undo,
    redo,
    selectedNodes,
    updateFromHistory,
    handleSave,
    handleDeleteNodes,
    info,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="h-full w-full">
      <ReactFlowProvider>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <SearchBar
          nodes={nodes}
          onSelectNode={handleSelectNode}
          isOpen={showSearch}
          onClose={() => setShowSearch(false)}
        />
        <NodeAlignment
          selectedNodes={selectedNodes}
          onAlign={handleAlignNodes}
        />
        <Toolbar
          focusMode={focusMode}
          onSave={handleSave}
          onLoad={handleLoad}
          onImport={handleImport}
          onExportJson={handleExport}
          onClear={handleClear}
          onExportPng={handleExportPng}
          onExportSvg={handleExportSvg}
          onExportPdf={handleExportPdf}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={() => {
            undo();
            setTimeout(() => updateFromHistory(), 50);
          }}
          onRedo={() => {
            redo();
            setTimeout(() => updateFromHistory(), 50);
          }}
        />

        <div ref={containerRef} className="h-[100%] w-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeDoubleClick={onNodeDoubleClick}
            onEdgeDoubleClick={onEdgeDoubleClick}
            fitView
            nodeTypes={memoizedNodeTypes}
            connectionLineType={ConnectionLineType.SmoothStep}
            className="bg-white text-black dark:bg-neutral-900 dark:text-white"
            deleteKeyCode={["Delete", "Backspace"]}
            multiSelectionKeyCode={["Meta", "Control"]}
            zoomOnScroll
            zoomOnPinch
            panOnScroll
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          >
            <Background gap={16} color={theme === "dark" ? "#444" : "#aaa"} />
            <Controls />
            <MiniMap
              nodeColor={() => "#FF5555"}
              maskColor={"rgba(255,255,255,0.7)"}
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow:
                  theme === "dark"
                    ? "0 2px 8px rgba(0, 0, 0, 0.7)"
                    : "0 2px 8px rgba(0, 0, 0, 0.08)",
              }}
            />
          </ReactFlow>
        </div>

        {selectedNode && (
          <NodeEditor
            isOpen={!!selectedNode}
            nodeId={selectedNode.id}
            label={selectedNode.data.label}
            description={selectedNode.data.description || ""}
            color={selectedNode.data.color || "#FF5555"}
            shape={selectedNode.data.shape || "rectangle"}
            onClose={() => setSelectedNode(null)}
            onSave={onSaveNode}
          />
        )}

        {selectedEdge && (
          <EdgeLabelEditor
            edge={selectedEdge}
            onSave={handleSaveEdgeLabel}
            onClose={() => setSelectedEdge(null)}
          />
        )}
      </ReactFlowProvider>
    </div>
  );
};
