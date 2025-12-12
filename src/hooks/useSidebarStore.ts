import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Block = {
  label: string;
  type: string;
  color: string;
  shape: "rectangle" | "circle" | "diamond" | "hexagon";
};

export type Category = {
  name: string;
  items: Block[];
};

const DEFAULT_CATEGORIES: Category[] = [
  {
    name: "React",
    items: [
      {
        label: "React Component",
        type: "react-component",
        color: "#61DAFB",
        shape: "rectangle",
      },
      {
        label: "React Hook",
        type: "react-hook",
        color: "#61DAFB",
        shape: "circle",
      },
      {
        label: "React Context",
        type: "react-context",
        color: "#61DAFB",
        shape: "diamond",
      },
      {
        label: "React Provider",
        type: "react-provider",
        color: "#61DAFB",
        shape: "hexagon",
      },
      {
        label: "React Router",
        type: "react-router",
        color: "#CA4245",
        shape: "rectangle",
      },
      {
        label: "Redux Store",
        type: "redux-store",
        color: "#764ABC",
        shape: "rectangle",
      },
      {
        label: "Redux Action",
        type: "redux-action",
        color: "#764ABC",
        shape: "diamond",
      },
      {
        label: "Redux Reducer",
        type: "redux-reducer",
        color: "#764ABC",
        shape: "circle",
      },
      {
        label: "Custom Hook",
        type: "custom-hook",
        color: "#61DAFB",
        shape: "hexagon",
      },
      {
        label: "React Form",
        type: "react-form",
        color: "#60A5FA",
        shape: "rectangle",
      },
      {
        label: "React Modal",
        type: "react-modal",
        color: "#A78BFA",
        shape: "rectangle",
      },
      {
        label: "React Table",
        type: "react-table",
        color: "#34d399",
        shape: "rectangle",
      },
      {
        label: "React Button",
        type: "react-button",
        color: "#34d399",
        shape: "rectangle",
      },
      {
        label: "React Input",
        type: "react-input",
        color: "#60A5FA",
        shape: "rectangle",
      },
      {
        label: "React Card",
        type: "react-card",
        color: "#F59E0B",
        shape: "rectangle",
      },
      {
        label: "React Layout",
        type: "react-layout",
        color: "#8B5CF6",
        shape: "rectangle",
      },
      {
        label: "React API Service",
        type: "react-api-service",
        color: "#F87171",
        shape: "diamond",
      },
      {
        label: "React State",
        type: "react-state",
        color: "#61DAFB",
        shape: "circle",
      },
    ],
  },
  {
    name: "Java",
    items: [
      {
        label: "Java Class",
        type: "java-class",
        color: "#ED8B00",
        shape: "rectangle",
      },
      {
        label: "Java Service",
        type: "java-service",
        color: "#ED8B00",
        shape: "rectangle",
      },
      {
        label: "Java Controller",
        type: "java-controller",
        color: "#ED8B00",
        shape: "diamond",
      },
      {
        label: "Java Repository",
        type: "java-repository",
        color: "#ED8B00",
        shape: "circle",
      },
      {
        label: "Java Entity",
        type: "java-entity",
        color: "#ED8B00",
        shape: "rectangle",
      },
      {
        label: "Java DTO",
        type: "java-dto",
        color: "#ED8B00",
        shape: "hexagon",
      },
      {
        label: "Java Model",
        type: "java-model",
        color: "#ED8B00",
        shape: "rectangle",
      },
      {
        label: "Spring Boot",
        type: "spring-boot",
        color: "#6DB33F",
        shape: "rectangle",
      },
      {
        label: "Spring Controller",
        type: "spring-controller",
        color: "#6DB33F",
        shape: "diamond",
      },
      {
        label: "Spring Service",
        type: "spring-service",
        color: "#6DB33F",
        shape: "rectangle",
      },
      {
        label: "Spring Repository",
        type: "spring-repository",
        color: "#6DB33F",
        shape: "circle",
      },
      {
        label: "Spring Component",
        type: "spring-component",
        color: "#6DB33F",
        shape: "hexagon",
      },
      {
        label: "Spring Bean",
        type: "spring-bean",
        color: "#6DB33F",
        shape: "circle",
      },
      {
        label: "Spring MVC",
        type: "spring-mvc",
        color: "#6DB33F",
        shape: "diamond",
      },
      {
        label: "REST Controller",
        type: "rest-controller",
        color: "#F59E0B",
        shape: "diamond",
      },
      {
        label: "JPA Entity",
        type: "jpa-entity",
        color: "#6DB33F",
        shape: "rectangle",
      },
      {
        label: "Java Interface",
        type: "java-interface",
        color: "#ED8B00",
        shape: "hexagon",
      },
      {
        label: "Java Exception",
        type: "java-exception",
        color: "#EF4444",
        shape: "diamond",
      },
      {
        label: "Java Utility",
        type: "java-utility",
        color: "#ED8B00",
        shape: "circle",
      },
      {
        label: "Java Config",
        type: "java-config",
        color: "#6DB33F",
        shape: "hexagon",
      },
    ],
  },
  {
    name: "Backend",
    items: [
      {
        label: "API Endpoint",
        type: "api-endpoint",
        color: "#fbbf24",
        shape: "diamond",
      },
      {
        label: "REST API",
        type: "rest-api",
        color: "#F59E0B",
        shape: "diamond",
      },
      {
        label: "GraphQL",
        type: "graphql",
        color: "#E10098",
        shape: "diamond",
      },
      {
        label: "Database",
        type: "database",
        color: "#f87171",
        shape: "circle",
      },
      {
        label: "PostgreSQL",
        type: "postgresql",
        color: "#336791",
        shape: "circle",
      },
      {
        label: "MongoDB",
        type: "mongodb",
        color: "#47A248",
        shape: "circle",
      },
      {
        label: "Redis",
        type: "redis",
        color: "#DC382D",
        shape: "circle",
      },
      {
        label: "Microservice",
        type: "microservice",
        color: "#8B5CF6",
        shape: "rectangle",
      },
    ],
  },
  {
    name: "DevOps",
    items: [
      {
        label: "Server",
        type: "server",
        color: "#a78bfa",
        shape: "rectangle",
      },
      {
        label: "Docker",
        type: "docker",
        color: "#2496ED",
        shape: "rectangle",
      },
      {
        label: "Kubernetes",
        type: "kubernetes",
        color: "#326CE5",
        shape: "hexagon",
      },
      {
        label: "Deployment",
        type: "deployment",
        color: "#f472b6",
        shape: "diamond",
      },
      {
        label: "CI/CD Pipeline",
        type: "cicd",
        color: "#FF6B6B",
        shape: "rectangle",
      },
      {
        label: "Load Balancer",
        type: "load-balancer",
        color: "#4ECDC4",
        shape: "diamond",
      },
    ],
  },
  {
    name: "Cloud",
    items: [
      {
        label: "AWS",
        type: "aws",
        color: "#FF9900",
        shape: "rectangle",
      },
      {
        label: "Azure",
        type: "azure",
        color: "#0078D4",
        shape: "rectangle",
      },
      {
        label: "GCP",
        type: "gcp",
        color: "#4285F4",
        shape: "rectangle",
      },
      {
        label: "S3 Storage",
        type: "s3",
        color: "#569A31",
        shape: "circle",
      },
      {
        label: "Cloud Function",
        type: "cloud-function",
        color: "#F58536",
        shape: "diamond",
      },
      {
        label: "CDN",
        type: "cdn",
        color: "#00A8E8",
        shape: "hexagon",
      },
    ],
  },
  {
    name: "Security",
    items: [
      {
        label: "Firewall",
        type: "firewall",
        color: "#EF4444",
        shape: "rectangle",
      },
      {
        label: "Auth Service",
        type: "auth-service",
        color: "#10B981",
        shape: "diamond",
      },
      {
        label: "OAuth",
        type: "oauth",
        color: "#3B82F6",
        shape: "circle",
      },
      {
        label: "SSL/TLS",
        type: "ssl",
        color: "#F59E0B",
        shape: "hexagon",
      },
    ],
  },
  {
    name: "Message Queue",
    items: [
      {
        label: "RabbitMQ",
        type: "rabbitmq",
        color: "#FF6600",
        shape: "circle",
      },
      {
        label: "Kafka",
        type: "kafka",
        color: "#231F20",
        shape: "rectangle",
      },
      {
        label: "SQS",
        type: "sqs",
        color: "#FF9900",
        shape: "diamond",
      },
      {
        label: "Event Bus",
        type: "event-bus",
        color: "#8B5CF6",
        shape: "hexagon",
      },
    ],
  },
  {
    name: "Monitoring",
    items: [
      {
        label: "Monitoring",
        type: "monitoring",
        color: "#10B981",
        shape: "rectangle",
      },
      {
        label: "Logging",
        type: "logging",
        color: "#6366F1",
        shape: "circle",
      },
      {
        label: "Analytics",
        type: "analytics",
        color: "#EC4899",
        shape: "diamond",
      },
      {
        label: "Alerting",
        type: "alerting",
        color: "#F59E0B",
        shape: "hexagon",
      },
    ],
  },
];

type SidebarState = {
  categories: Category[];
  favorites: string[];
  addCategory: (name: string) => void;
  removeCategory: (name: string) => void;
  addBlock: (categoryName: string, block: Block) => void;
  removeBlock: (blockType: string) => void;
  toggleFavorite: (blockType: string) => void;
  resetSidebar: () => void;
};

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      categories: DEFAULT_CATEGORIES,
      favorites: [],

      addCategory: (name) =>
        set((state) => {
          const exists = state.categories.find(
            (c) => c.name.toLowerCase() === name.toLowerCase(),
          );
          if (exists) return state;
          return {
            categories: [...state.categories, { name, items: [] }],
          };
        }),

      removeCategory: (name) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.name !== name),
        })),

      addBlock: (categoryName, block) =>
        set((state) => ({
          categories: state.categories.map((category) => {
            if (category.name === categoryName) {
              const exists = category.items.find((b) => b.type === block.type);
              if (exists) return category;
              return {
                ...category,
                items: [...category.items, block],
              };
            }
            return category;
          }),
        })),

      removeBlock: (blockType) =>
        set((state) => ({
          categories: state.categories.map((category) => ({
            ...category,
            items: category.items.filter((item) => item.type !== blockType),
          })),
          favorites: state.favorites.filter((type) => type !== blockType),
        })),

      toggleFavorite: (blockType) =>
        set((state) => ({
          favorites: state.favorites.includes(blockType)
            ? state.favorites.filter((type) => type !== blockType)
            : [...state.favorites, blockType],
        })),

      resetSidebar: () =>
        set({
          categories: DEFAULT_CATEGORIES,
          favorites: [],
        }),
    }),
    {
      name: "infradraw-sidebar-storage",
    },
  ),
);
