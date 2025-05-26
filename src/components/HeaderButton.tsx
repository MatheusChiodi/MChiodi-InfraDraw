import { motion } from "framer-motion";

type HeaderButtonProps = {
  label: string;
  icon: string;
  onClick: () => void;
  active?: boolean;
};

export const HeaderButton = ({
  label,
  icon,
  onClick,
  active,
}: HeaderButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium shadow-lg ${
        active
          ? "bg-[#ff5555] text-white hover:bg-[#ff5555]/80"
          : "bg-gray-200 text-gray-900 hover:bg-gray-400/60 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
      } transition-all`}
    >
      <span className="text-sm">{icon}</span>
      {label}
    </motion.button>
  );
};
