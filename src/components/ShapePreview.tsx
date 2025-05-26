export const ShapePreview = ({ shape, color }: { shape: string; color: string }) => {
  const style = { backgroundColor: color };

  switch (shape) {
    case "circle":
      return <div className="h-4 w-4 rounded-full" style={style} />;
    case "diamond":
      return (
        <div
          className="h-4 w-4"
          style={{ ...style, transform: "rotate(45deg)" }}
        />
      );
    case "hexagon":
      return (
        <div
          className="h-4 w-4"
          style={{
            ...style,
            clipPath:
              "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
          }}
        />
      );
    case "rectangle":
    default:
      return <div className="h-4 w-4 rounded-sm" style={style} />;
  }
};
