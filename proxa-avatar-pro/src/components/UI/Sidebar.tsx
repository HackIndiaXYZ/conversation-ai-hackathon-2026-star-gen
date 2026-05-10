import { useStore } from "../../store/useStore";
import { MODELS } from "../../lib/constants";
import { Settings, User, Bot, Sliders, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

export default function Sidebar() {
  const { persona, setPersona, selectedModel, setSelectedModel, networkLatency } = useStore();

  return (
    <div className="w-[260px] flex flex-col h-full bg-[#0a0a0f]/60 backdrop-blur-[20px] border-r border-white/8 overflow-y-auto custom-scrollbar">
      {/* Profile Section */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center font-bold text-white shadow-lg">
            P
          </div>
          <span className="font-bold text-lg tracking-tight text-white font-sans">Proxa Labs</span>
        </div>

        {/* Model Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
             <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Neural Model</label>
             <span className="text-[10px] font-mono text-emerald-400">{networkLatency}MS</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all border",
                  selectedModel === m.id 
                    ? "bg-blue-500/10 border-blue-500 text-blue-400" 
                    : "bg-transparent border-white/5 text-slate-400 hover:bg-white/5"
                )}
              >
                {m.name}
                {selectedModel === m.id && <ChevronRight className="w-3 h-3" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Persona Config */}
      <div className="p-6 space-y-6">
        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Core Personality</label>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-[11px] text-slate-400 uppercase tracking-tight">Name</span>
            <input 
              type="text" 
              value={persona.name}
              onChange={(e) => setPersona({ ...persona, name: e.target.value })}
              className="w-full bg-white/3 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] text-slate-400 uppercase tracking-tight">Persona Type</span>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setPersona({ ...persona, tone: "professional and elite" })}
                className={cn(
                  "px-2 py-1.5 rounded-lg border text-[10px] font-medium transition-all",
                  persona.tone === "professional and elite" ? "border-blue-500 bg-blue-500/10 text-white" : "border-white/5 text-slate-500"
                )}
              >
                Professional
              </button>
              <button 
                onClick={() => setPersona({ ...persona, tone: "playful and witty" })}
                className={cn(
                  "px-2 py-1.5 rounded-lg border text-[10px] font-medium transition-all",
                  persona.tone === "playful and witty" ? "border-blue-500 bg-blue-500/10 text-white" : "border-white/5 text-slate-500"
                )}
              >
                Casual
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Persona Badge */}
      <div className="mt-auto p-6 border-t border-white/5">
        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-3">Live Persona</div>
        <div className="flex items-center gap-3 p-2 bg-white/3 rounded-xl">
           <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-indigo-600 to-cyan-500 shrink-0" />
           <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">{persona.name}</div>
              <div className="text-[10px] text-slate-500 truncate">{persona.role}</div>
           </div>
        </div>
      </div>
    </div>
  );
}
