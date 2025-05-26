import { Handle, NodeProps, Position } from "reactflow";

export const NodeComponent = ({ data }: NodeProps) => {
  const shape = data.shape || "rectangle";

  const baseClass = `
    border-2 
    px-4 py-2 
    text-sm 
    shadow-md 
    flex flex-col 
    items-center 
    justify-center 
    transition-all
    text-white dark:text-white
  `;

  const colorStyle = {
    backgroundColor: data.color || "#282A36",
    borderColor: "#282A36",
  };

  const shapeClass = (() => {
    switch (shape) {
      case "circle":
        return "rounded-full w-28 h-28";
      case "diamond":
        return "rotate-45 w-24 h-24";
      case "hexagon":
        return "hexagon-shape";
      default:
        return "rounded-lg";
    }
  })();

  return (
    <div className={`${baseClass} ${shapeClass}`} style={colorStyle}>
      <div
        className={`font-bold ${shape === "diamond" ? "rotate-[-45deg]" : ""}`}
      >
        {data.label}
      </div>

      {data.description && (
        <div
          className={`text-xs opacity-80 ${shape === "diamond" ? "rotate-[-45deg]" : ""}`}
        >
          {data.description}
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        id="t"
        className="!border !border-black !bg-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="l"
        className="!border !border-black !bg-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="r"
        className="!border !border-black !bg-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        className="!border !border-black !bg-white"
      />
    </div>
  );
};
