import { useState } from "react";
import { motion } from "framer-motion";
import { useSidebarStore, Block } from "../hooks/useSidebarStore";
import { BlockCategory } from "./BlockCategory";

export const Sidebar = ({ focusMode }: { focusMode: boolean }) => {
  const {
    categories,
    favorites,
    addCategory,
    removeCategory,
    addBlock,
    removeBlock,
    toggleFavorite,
    resetSidebar,
  } = useSidebarStore();

  const [search, setSearch] = useState("");
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const [newCategory, setNewCategory] = useState("");
  const [newBlock, setNewBlock] = useState({
    label: "",
    type: "",
    color: "#FF5555",
    shape: "rectangle",
    category: "",
  });

  const onDragStart = (e: React.DragEvent, block: Block) => {
    e.dataTransfer.setData("application/reactflow", JSON.stringify(block));
    e.dataTransfer.effectAllowed = "move";
  };

  const filtered = categories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter((i) =>
        i.label.toLowerCase().includes(search.toLowerCase()),
      ),
    }))
    .filter((cat) => cat.items.length > 0 || search.length === 0);

  const favoritesItems = categories
    .flatMap((c) => c.items)
    .filter((i) => favorites.includes(i.type));

  return (
    <>
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`flex h-screen w-72 flex-col gap-5 overflow-auto border-r border-neutral-200 bg-white px-2 pb-20 pt-5 text-neutral-900 backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/80 dark:text-white ${focusMode ? "hidden" : "block"}`}
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">📦 Blocos</h2>
          <input
            className="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-3 text-xs text-white shadow-lg placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#FF5555] dark:border-neutral-700 dark:bg-neutral-800"
            placeholder="🔍 Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {favoritesItems.length > 0 && (
          <BlockCategory
            name="⭐ Favoritos"
            items={favoritesItems}
            onDragStart={onDragStart}
            onToggleFavorite={toggleFavorite}
            onRemove={removeBlock}
            isFavorites
          />
        )}

        {filtered.map((cat) => (
          <BlockCategory
            key={cat.name}
            name={cat.name}
            items={cat.items}
            onDragStart={onDragStart}
            onToggleFavorite={toggleFavorite}
            onRemove={removeBlock}
            onRemoveCategory={removeCategory}
          />
        ))}

        <div className="mt-2 flex flex-col gap-3">
          <button
            onClick={() => setShowAddBlock(true)}
            className="rounded-md border-gray-200 bg-gray-100 px-3 py-1.5 text-sm shadow-lg hover:bg-gray-300/60 dark:bg-neutral-800 dark:text-neutral-300 hover:dark:bg-neutral-700/60"
          >
            ➕ Adicionar Bloco
          </button>
          <button
            onClick={() => setShowAddCategory(true)}
            className="rounded-md border-gray-200 bg-gray-100 px-3 py-1.5 text-sm shadow-lg hover:bg-gray-300/60 dark:bg-neutral-800 dark:text-neutral-300 hover:dark:bg-neutral-700/60"
          >
            ➕ Adicionar Categoria
          </button>
          <button
            onClick={resetSidebar}
            className="rounded-md bg-[#FF5555] px-2 py-2 text-sm text-white shadow-lg hover:bg-[#FF5555]/80"
          >
            ♻️ Resetar Sidebar
          </button>
        </div>
      </motion.aside>
      {showAddBlock && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAddBlock(false)}
        >
          <motion.div
            className="relative h-auto max-h-[90%] w-[95%] max-w-2xl rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-700 dark:bg-neutral-950"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 🔥 Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                ➕ Novo Bloco
              </h2>
              <button
                className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm text-neutral-700 shadow-md transition hover:bg-[#FF5555] hover:text-white dark:border-neutral-700 dark:text-white"
                onClick={() => setShowAddBlock(false)}
              >
                Fechar
              </button>
            </div>

            {/* 🔥 Form */}
            <div className="flex max-h-[70vh] flex-col gap-4 overflow-auto">
              <input
                className="w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF5555] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                placeholder="Nome do bloco"
                value={newBlock.label}
                onChange={(e) =>
                  setNewBlock({ ...newBlock, label: e.target.value })
                }
              />

              <input
                className="w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF5555] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                placeholder="ID único"
                value={newBlock.type}
                onChange={(e) =>
                  setNewBlock({ ...newBlock, type: e.target.value })
                }
              />

              {/* 🔥 Select de Categoria */}
              <select
                value={newBlock.category}
                onChange={(e) =>
                  setNewBlock({ ...newBlock, category: e.target.value })
                }
                className="w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#FF5555] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                value={newBlock.shape}
                onChange={(e) =>
                  setNewBlock({ ...newBlock, shape: e.target.value as any })
                }
                className="w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#FF5555] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              >
                <option value="rectangle">Retângulo</option>
                <option value="circle">Círculo</option>
                <option value="diamond">Losango</option>
                <option value="hexagon">Hexágono</option>
              </select>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  Cor do bloco
                </label>
                <input
                  type="color"
                  className="h-10 w-full rounded-md border border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800"
                  value={newBlock.color}
                  onChange={(e) =>
                    setNewBlock({ ...newBlock, color: e.target.value })
                  }
                />
              </div>

              <button
                onClick={() => {
                  const label = newBlock.label.trim();
                  const type = newBlock.type.trim();
                  const category = newBlock.category.trim();

                  if (label === "" || type === "" || category === "") {
                    alert("Preencha todos os campos!");
                    return;
                  }

                  const categoryExists = categories.find(
                    (c) => c.name.toLowerCase() === category.toLowerCase(),
                  );

                  if (!categoryExists) {
                    alert("Categoria não encontrada!");
                    return;
                  }

                  const blockAlreadyExists = categoryExists.items.find(
                    (b) => b.type === type,
                  );

                  if (blockAlreadyExists) {
                    alert("Já existe um bloco com esse ID!");
                    return;
                  }

                  addBlock(category, {
                    type,
                    label,
                    shape: newBlock.shape as any,
                    color: newBlock.color,
                  });

                  setShowAddBlock(false);
                  setNewBlock({
                    label: "",
                    type: "",
                    color: "#FF5555",
                    shape: "rectangle",
                    category: "",
                  });
                }}
                className="mt-2 w-full rounded-md bg-[#FF5555] px-4 py-2 text-sm font-medium text-white shadow-md transition hover:bg-[#FF5555]/80"
              >
                ➕ Adicionar Bloco
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showAddCategory && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAddCategory(false)}
        >
          <motion.div
            className="relative h-auto max-h-[90%] w-[95%] max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-700 dark:bg-neutral-950"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 🔥 Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                ➕ Nova Categoria
              </h2>
              <button
                className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm text-neutral-700 shadow-md transition hover:bg-[#FF5555] hover:text-white dark:border-neutral-700 dark:text-white"
                onClick={() => setShowAddCategory(false)}
              >
                Fechar
              </button>
            </div>

            {/* 🔥 Form */}
            <div className="flex flex-col gap-4">
              <input
                className="w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF5555] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                placeholder="Nome da categoria"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />

              <button
                onClick={() => {
                  const name = newCategory.trim();
                  if (name === "") {
                    alert("O nome da categoria não pode estar vazio.");
                    return;
                  }

                  const exists = categories.find(
                    (c) => c.name.toLowerCase() === name.toLowerCase(),
                  );

                  if (exists) {
                    alert("Essa categoria já existe!");
                    return;
                  }

                  addCategory(name);
                  setNewCategory("");
                  setShowAddCategory(false);
                }}
                className="mt-2 w-full rounded-md bg-[#FF5555] px-4 py-2 text-sm font-medium text-white shadow-md transition hover:bg-[#FF5555]/80"
              >
                ➕ Adicionar Categoria
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};
