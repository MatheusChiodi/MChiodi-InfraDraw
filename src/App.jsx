import { useState, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carrega mais rápido se já visitou recentemente
    const lastVisit = localStorage.getItem("lastVisit");
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    if (!lastVisit || now - parseInt(lastVisit, 10) > oneHour) {
      localStorage.setItem("lastVisit", now.toString());
      // Mostra loading apenas por 1 segundo para primeira visita
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Se visitou recentemente, carrega imediatamente
      setIsLoading(false);
    }
  }, []);

  const handleToggleFocus = () => {
    setFocusMode((prev) => !prev);
  };

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
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
        <div className="flex h-screen w-screen flex-col">
          <Header
            onToggleFocus={handleToggleFocus}
            focusMode={focusMode}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={handleToggleSidebar}
          />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar focusMode={focusMode} sidebarOpen={sidebarOpen} />
            <Canvas focusMode={focusMode} />
          </div>
        </div>
      </ReactFlowProvider>
    );
  }
}
