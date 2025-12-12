import React, { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ChevronUp } from "lucide-react";

type ToolbarProps = {
  focusMode: boolean;
  onSave: () => void;
  onLoad: () => void;
  onImport?: () => void;
  onExportJson: () => void;
  onClear: () => void;
  onExportPng: () => void;
  onExportSvg: () => void;
  onExportPdf: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
};

export const Toolbar = ({
  focusMode,
  onSave,
  onLoad,
  onImport,
  onExportJson,
  onClear,
  onExportPng,
  onExportSvg,
  onExportPdf,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}: ToolbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (focusMode) return null;

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    // Se arrastar para baixo ou para cima mais de 80px, fecha o menu
    if (Math.abs(info.offset.y) > 80 || info.velocity.y > 500) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Botão flutuante para abrir */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          className="fixed bottom-6 left-1/2 z-50 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-white/90 shadow-2xl backdrop-blur-2xl transition-all hover:bg-white dark:bg-neutral-900/90 hover:dark:bg-neutral-900"
          title="Abrir menu de ferramentas"
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronUp
              size={24}
              className="text-gray-700 transition-colors hover:text-[#FF5555] dark:text-gray-300 hover:dark:text-[#FF5555]"
            />
          </motion.div>
        </motion.button>
      )}

      {/* Overlay escuro com animação melhorada */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/50"
          />
        )}
      </AnimatePresence>

      {/* BottomSheet - centralizado na tela */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 50,
              filter: "blur(10px)",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: 50,
              filter: "blur(10px)",
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              mass: 0.8,
            }}
            drag="y"
            dragConstraints={{ top: -100, bottom: 100 }}
            dragElastic={0.3}
            onDragEnd={handleDragEnd}
            className="fixed left-1/2 top-1/2 z-50 w-[400px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[32px] bg-white/95 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] backdrop-blur-2xl dark:bg-neutral-900/95"
          >
            {/* Handle (pega) no topo */}
            <div className="flex h-10 cursor-grab items-center justify-center active:cursor-grabbing">
              <motion.div
                className="h-1 w-10 rounded-full bg-gray-300 dark:bg-neutral-600"
                whileHover={{ scaleX: 1.2 }}
                transition={{ duration: 0.2 }}
              />
            </div>

            {/* Conteúdo com scroll */}
            <div className="max-h-[500px] overflow-y-auto overflow-x-hidden px-5 pb-6">
              <div className="flex flex-wrap gap-2.5">
                {onUndo && (
                  <ToolbarButton
                    label="Desfazer"
                    icon="↶"
                    onClick={onUndo}
                    disabled={!canUndo}
                    title="Ctrl+Z"
                  />
                )}
                {onRedo && (
                  <ToolbarButton
                    label="Refazer"
                    icon="↷"
                    onClick={onRedo}
                    disabled={!canRedo}
                    title="Ctrl+Shift+Z"
                  />
                )}
                {(onUndo || onRedo) && <Separator />}
                <ToolbarButton
                  label="Salvar"
                  icon="💾"
                  onClick={onSave}
                  title="Ctrl+S"
                />
                <ToolbarButton label="Carregar" icon="📂" onClick={onLoad} />
                {onImport && (
                  <ToolbarButton
                    label="Importar"
                    icon="📥"
                    onClick={onImport}
                  />
                )}
                <ToolbarButton
                  label="Exportar"
                  icon="🔄"
                  onClick={onExportJson}
                  title="Ctrl+E"
                />
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

type ToolbarButtonProps = {
  label: string;
  icon: string;
  onClick: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
  title?: string;
};

const ToolbarButton = ({
  label,
  icon,
  onClick,
  variant = "default",
  disabled = false,
  title,
}: ToolbarButtonProps) => {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium transition-all duration-200 ${
        disabled
          ? "cursor-not-allowed opacity-40"
          : "cursor-pointer active:scale-95"
      } ${
        variant === "danger"
          ? "bg-red-500/90 text-white hover:bg-red-600 dark:bg-red-600/90 dark:hover:bg-red-700"
          : "bg-gray-100/80 text-gray-800 hover:bg-gray-200/90 dark:bg-neutral-800/80 dark:text-neutral-200 dark:hover:bg-neutral-700/90"
      }`}
    >
      <span className="text-base leading-none">{icon}</span>
      <span className="leading-tight">{label}</span>

      {/* Efeito de brilho no hover */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.button>
  );
};

const Separator = () => (
  <div className="h-6 w-px bg-gray-200/60 dark:bg-neutral-700/60"></div>
);
