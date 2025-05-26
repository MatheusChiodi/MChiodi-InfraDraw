import { create } from "zustand";

export type Block = {
  label: string;
  type: string;
  color: string;
  shape: "rectangle" | "circle" | "diamond";
};

export type Category = {
  name: string;
  items: Block[];
};

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

export const useSidebarStore = create<SidebarState>((set) => ({
  categories: [
    {
      name: "Frontend",
      items: [
        {
          label: "React Component",
          type: "react-component",
          color: "#FF5555",
          shape: "rectangle",
        },
        {
          label: "Button UI",
          type: "button-ui",
          color: "#34d399",
          shape: "rectangle",
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
          label: "Database",
          type: "database",
          color: "#f87171",
          shape: "circle",
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
          label: "Deployment",
          type: "deployment",
          color: "#f472b6",
          shape: "diamond",
        },
      ],
    },
  ],

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

  resetSidebar: () => ({
    categories: [],
    favorites: [],
  }),
}));
