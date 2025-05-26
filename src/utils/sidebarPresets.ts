import { Category } from "../hooks/useSidebarStore";

export const defaultCategories: Category[] = [
  {
    name: "Frontend",
    items: [
      {
        type: "frontend",
        label: "💻 Frontend",
        color: "bg-green-500",
        shape: "rectangle",
      },
    ],
  },
  {
    name: "Backend",
    items: [
      { type: "api", label: "🛠️ API", color: "bg-blue-500", shape: "hexagon" },
      {
        type: "service",
        label: "⚙️ Service",
        color: "bg-red-500",
        shape: "rectangle",
      },
      {
        type: "queue",
        label: "📦 Queue",
        color: "bg-purple-500",
        shape: "diamond",
      },
    ],
  },
  {
    name: "Dados",
    items: [
      {
        type: "database",
        label: "🗄️ Database",
        color: "bg-yellow-500",
        shape: "circle",
      },
    ],
  },
];
