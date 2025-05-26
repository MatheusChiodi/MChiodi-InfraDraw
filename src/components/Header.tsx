import { useTheme } from "../hooks/useTheme";
import { motion } from "framer-motion";
import { HeaderButton } from "./HeaderButton";

type HeaderProps = {
  onToggleFocus: () => void;
  focusMode: boolean;
};

export const Header = ({ onToggleFocus, focusMode }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-6 shadow-sm backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-950"
    >
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-neutral-900 dark:text-white">
          🧠 InfraDraw
        </span>
        <a
          href="https://matheuschiodi.github.io/Portfolio/"
          className="text-xs text-neutral-500 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          by MChiodi
        </a>
      </div>

      <div className="flex items-center gap-3">
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
      </div>
    </motion.header>
  );
};
