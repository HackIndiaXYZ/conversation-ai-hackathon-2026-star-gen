import { Canvas } from "@react-three/fiber";
import Avatar from "./Avatar";
import { useStore } from "../../store/useStore";
import { cn } from "../../lib/utils";
import { motion } from "motion/react";

export default function AvatarCanvas() {
  const isFullscreen = useStore((state) => state.isFullscreen);
  const status = useStore((state) => state.status);

  return (
    <div className={cn(
      "relative transition-all duration-500 ease-in-out bg-slate-950",
      isFullscreen ? "fixed inset-0 z-50" : "flex-1 min-h-[400px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl"
    )}>
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 40 }}>
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        <Avatar />
      </Canvas>

      {/* Active Status Badge from Design */}
      <div className="absolute bottom-10 inset-x-0 flex justify-center pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest",
            status === "idle" ? "bg-slate-900 border-slate-700 text-slate-400" :
            status === "listening" ? "bg-red-500/10 border-red-500 text-red-500" :
            status === "thinking" ? "bg-blue-500/10 border-blue-500 text-blue-500" :
            "bg-emerald-500/10 border-emerald-500 text-emerald-500"
          )}
        >
          <div className={cn("w-1.5 h-1.5 rounded-full", 
            status === "idle" ? "bg-slate-600" :
            status === "listening" ? "bg-red-500 animate-pulse" :
            status === "thinking" ? "bg-blue-500 animate-bounce" :
            "bg-emerald-500"
          )} />
          {status === "idle" ? "System Standby" : status === "listening" ? "Listening" : status === "thinking" ? "Thinking" : "Engaged"}
        </motion.div>
      </div>
    </div>
  );
}

function StatusIndicator() {
  const status = useStore((state) => state.status);
  
  const config = {
    idle: { color: "bg-slate-400", label: "System Idle" },
    listening: { color: "bg-red-500 animate-pulse", label: "IRIS Listening..." },
    thinking: { color: "bg-blue-500 animate-bounce", label: "Thinking..." },
    speaking: { color: "bg-green-500", label: "IRIS Speaking" },
  };

  const { color, label } = config[status];

  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-2 h-2 rounded-full", color)} />
      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300">{label}</span>
    </div>
  );
}
