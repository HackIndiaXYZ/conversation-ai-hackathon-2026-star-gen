import { useStore } from "./store/useStore";
import Sidebar from "./components/UI/Sidebar";
import AvatarCanvas from "./components/Avatar/AvatarCanvas";
import ChatPanel from "./components/UI/ChatPanel";
import LandingPage from "./components/UI/LandingPage";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Code, Terminal, Activity } from "lucide-react";

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const isFullscreen = useStore((state) => state.isFullscreen);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-blue-500/30">
      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <LandingPage onStart={() => setHasStarted(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex"
          >
            {/* Main Application Layout */}
            {!isFullscreen && <Sidebar />}
            
            <main className="flex-1 flex flex-col relative overflow-hidden bg-[#050508]">
               {/* Top Bar */}
               {!isFullscreen && (
                 <header className="h-16 px-8 flex items-center justify-between border-b border-white/5 bg-[#050508]/40 backdrop-blur-[10px]">
                    <div className="flex gap-6 text-sm font-medium text-slate-400">
                       <span>Latency: <span className="text-emerald-500">{useStore.getState().networkLatency}ms</span></span>
                       <span>Model: <span className="text-white">Claude 3.5 Sonnet</span></span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                       <div className="flex gap-2 p-1 bg-black/20 rounded-full border border-white/5">
                          <button className="px-3 py-1 bg-blue-600 rounded-full text-white text-[10px] font-bold">Video On</button>
                          <button className="px-3 py-1 text-slate-400 text-[10px]">Audio Only</button>
                       </div>
                       <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10" />
                    </div>
                 </header>
               )}

               <div className="flex-1 flex overflow-hidden">
                  <AvatarCanvas />
                  {!isFullscreen && (
                    <div className="w-[450px]">
                      <ChatPanel />
                    </div>
                  )}
               </div>
            </main>

            {/* Global Overlay Elements if needed */}
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
        
        @theme {
          --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
          --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}} />
    </div>
  );
}
