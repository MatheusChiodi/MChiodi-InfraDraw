import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Canvas } from "./components/Canvas";
import { Loading } from "./components/Loading";
import { ReactFlowProvider } from "reactflow";
import { useDeviceCheck } from "./hooks/useDeviceCheck";

export default function App() {
  const [focusMode, setFocusMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isAllowed = useDeviceCheck();
  // Carrega mais rápido se já visitou recentemente
  const getInitialLoadingState = () => {
    const lastVisit = localStorage.getItem("lastVisit");
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    return !lastVisit || now - parseInt(lastVisit, 10) > oneHour;
  };

  const [isLoading, setIsLoading] = useState(getInitialLoadingState);

  useEffect(() => {
    if (isLoading) {
      const lastVisit = localStorage.getItem("lastVisit");
      const now = Date.now();
      if (!lastVisit || now - parseInt(lastVisit, 10) > 60 * 60 * 1000) {
        localStorage.setItem("lastVisit", now.toString());
      }
      // Mostra loading apenas por 1 segundo para primeira visita
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const handleToggleFocus = () => {
    setFocusMode((prev) => !prev);
  };

  if (!isAllowed) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-neutral-900 px-5 text-center">
        <div className="max-w-sm rounded-lg bg-neutral-800 p-6 shadow-lg">
          <h1 className="text-2xl font-bold text-white">
            🚫 Dispositivo não suportado
          </h1>
          <p className="mt-4 text-sm text-neutral-400">
            Este aplicativo foi desenvolvido para uso em{" "}
            <strong>notebooks, desktops e tablets</strong>.<br />
            Por favor, acesse através de um dispositivo com uma tela maior.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-neutral-900">
        <Loading />
      </div>
    );
  } else {
    return (
      <ReactFlowProvider>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex h-screen w-screen flex-col"
        >
          <Header
            onToggleFocus={handleToggleFocus}
            focusMode={focusMode}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex flex-1 overflow-hidden"
          >
            <Sidebar focusMode={focusMode} isOpen={sidebarOpen} />
            <Canvas focusMode={focusMode} />
          </motion.div>
        </motion.div>
      </ReactFlowProvider>
    );
  }
}
