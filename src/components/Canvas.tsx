import { useTheme } from "../hooks/useTheme";
import { useCallback, useState, useRef } from "react";
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
} from "reactflow";

import { NodeEditor } from "./NodeEditor";
import { NodeComponent } from "./NodeComponent";
import { Toolbar } from "./Toolbar";
import { saveToLocal, loadFromLocal, clearLocal } from "../utils/storage";
import { exportAsPng, exportAsSvg, exportAsPdf } from "../utils/export";
import "reactflow/dist/style.css";
import ReactFlow from "reactflow";

const nodeTypes = {
  customNode: NodeComponent,
};

export const Canvas = ({ focusMode }: { focusMode: boolean }) => {
  const { theme } = useTheme();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = (params: Edge | Connection) =>
    setEdges((eds) =>
      addEdge(
        {
          ...params,
          markerEnd: { type: MarkerType.ArrowClosed },
        },
        eds,
      ),
    );

  const onNodeDoubleClick: NodeMouseHandler = (_, node) => {
    setSelectedNode(node);
  };

  const onSaveNode = (data: {
    label: string;
    description: string;
    color: string;
    shape: string;
  }) => {
    setNodes((nds) =>
      nds.map((n) =>
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
      ),
    );
  };

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
        sourcePosition: "right",
        targetPosition: "left",
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes],
  );

  const handleSave = () => {
    saveToLocal({ nodes, edges });
    alert("Projeto salvo no navegador!");
  };

  const handleLoad = () => {
    const data = loadFromLocal();
    if (data) {
      setNodes(data.nodes || []);
      setEdges(data.edges || []);
    } else {
      alert("Nenhum projeto salvo encontrado.");
    }
  };

  const handleExport = () => {
    const json = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "InfraDraw-project.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    clearLocal();
    setNodes([]);
    setEdges([]);
    alert("Projeto apagado!");
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const handleExportPng = () => {
    if (containerRef.current) {
      exportAsPng(containerRef.current);
    }
  };

  const handleExportSvg = () => {
    if (containerRef.current) {
      exportAsSvg(containerRef.current);
    }
  };

  const handleExportPdf = () => {
    if (containerRef.current) {
      exportAsPdf(containerRef.current);
    }
  };

  return (
    <div className="h-full w-full">
      <ReactFlowProvider>
        <Toolbar
          focusMode={focusMode}
          onSave={handleSave}
          onLoad={handleLoad}
          onExportJson={handleExport}
          onClear={handleClear}
          onExportPng={handleExportPng}
          onExportSvg={handleExportSvg}
          onExportPdf={handleExportPdf}
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
            fitView
            nodeTypes={nodeTypes}
            connectionLineType={ConnectionLineType.SmoothStep}
            className="bg-white text-black dark:bg-neutral-900 dark:text-white"
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
      </ReactFlowProvider>
    </div>
  );
};
