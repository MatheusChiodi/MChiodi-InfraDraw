import { motion } from "framer-motion";

type ToolbarProps = {
  focusMode: boolean;
  onSave: () => void;
  onLoad: () => void;
  onExportJson: () => void;
  onClear: () => void;
  onExportPng: () => void;
  onExportSvg: () => void;
  onExportPdf: () => void;
};

export const Toolbar = ({
  focusMode,
  onSave,
  onLoad,
  onExportJson,
  onClear,
  onExportPng,
  onExportSvg,
  onExportPdf,
}: ToolbarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`toolbar fixed bottom-6 left-[25%] z-50 flex gap-3 rounded-2xl border dark:border-neutral-700 dark:bg-neutral-900/90 bg-gray-100 border-gray-200 px-6 py-3 shadow-xl backdrop-blur ${focusMode ? "hidden" : "flex"}`}
    >
      <ToolbarButton label="Salvar" icon="💾" onClick={onSave} />
      <ToolbarButton label="Carregar" icon="📂" onClick={onLoad} />
      <ToolbarButton label="JSON" icon="🔄" onClick={onExportJson} />
      <Separator />
      <ToolbarButton label="PNG" icon="🖼️" onClick={onExportPng} />
      <ToolbarButton label="SVG" icon="🧠" onClick={onExportSvg} />
      <ToolbarButton label="PDF" icon="📄" onClick={onExportPdf} />
      <Separator />
      <ToolbarButton
        label="Limpar"
        icon="🗑️"
        onClick={onClear}
        variant="danger"
      />
    </motion.div>
  );
};

type ToolbarButtonProps = {
  label: string;
  icon: string;
  onClick: () => void;
  variant?: "default" | "danger";
};

const ToolbarButton = ({
  label,
  icon,
  onClick,
  variant = "default",
}: ToolbarButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-xs ${
        variant === "danger"
          ? "bg-red-600 text-white hover:bg-red-700"
          : "dark:bg-neutral-800 bg-gray-200 dark:text-neutral-300 text-gray-950 hover:dark:bg-neutral-700 hover:bg-gray-300 shadow-lg"
      } transition-all`}
    >
      <span>{icon}</span>
      {label}
    </motion.button>
  );
};

const Separator = () => (
  <div className="h-5 w-px bg-neutral-700 opacity-60 max-sm:h-px max-sm:w-5"></div>
);
