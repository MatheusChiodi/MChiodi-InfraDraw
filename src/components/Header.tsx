import React from "react";
import { useTheme } from "../hooks/useTheme";
import { motion } from "framer-motion";
import { HeaderButton } from "./HeaderButton";

type HeaderProps = {
  onToggleFocus: () => void;
  focusMode: boolean;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
};

export const Header = ({
  onToggleFocus,
  focusMode,
  sidebarOpen,
  onToggleSidebar,
}: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.8,
      }}
      className="relative flex h-14 items-center justify-between border-b border-neutral-200/80 bg-white/80 px-6 shadow-sm backdrop-blur-xl dark:border-neutral-700/80 dark:bg-neutral-950/80"
    >
      {/* Gradient overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-[#FF5555]/5 to-transparent opacity-0"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
      />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="relative z-10 flex items-center gap-2"
      >
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="text-lg font-bold text-neutral-900 dark:text-white"
        >
          🧠 InfraDraw
        </motion.span>
        <motion.a
          href="https://matheuschiodi.github.io/Portfolio/"
          className="text-xs text-neutral-500 transition-colors hover:text-[#FF5555] hover:underline"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          by MChiodi
        </motion.a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="relative z-10 flex items-center gap-3"
      >
        <HeaderButton
          label={sidebarOpen ? "Fechar Menu" : "Abrir Menu"}
          icon={sidebarOpen ? "📂" : "📁"}
          onClick={onToggleSidebar}
          active={sidebarOpen}
        />

        <HeaderButton
          label={focusMode ? "Sair do Foco" : "Modo Foco"}
          icon="🔍"
          onClick={onToggleFocus}
          active={focusMode}
        />

        <HeaderButton
          label={theme === "dark" ? "Tema Claro" : "Tema Escuro"}
          icon={theme === "dark" ? "🌞" : "🌙"}
          onClick={toggleTheme}
        />
      </motion.div>
    </motion.header>
  );
};
