import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, Send, RotateCcw, Volume2, VolumeX, Maximize2, Minimize2, Sparkles } from "lucide-react";
import { useStore } from "../../store/useStore";
import { cn } from "../../lib/utils";
import { aiService } from "../../services/aiService";
import { voiceService } from "../../services/voiceService";

export default function ChatPanel() {
  const { 
    messages, addMessage, status, selectedModel, setStatus, 
    resetSession, isMuted, toggleMute, isFullscreen, toggleFullscreen 
  } = useStore();
  
  const [input, setInput] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, interimTranscript]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    addMessage({ role: "user", content: text });
    setInput("");
    setStatus("thinking");

    try {
      let fullResponse = "";
      await aiService.chat([...messages, { role: "user", content: text }], selectedModel, (chunk) => {
        fullResponse += chunk;
      });

      // Extract emotion if present like [ENGAGED]
      const emotionMatch = fullResponse.match(/\[(NEUTRAL|ENGAGED|POSITIVE|SKEPTICAL)\]/i);
      if (emotionMatch) {
        const emo = emotionMatch[1].toLowerCase() as any;
        useStore.getState().setEmotion(emo);
        fullResponse = fullResponse.replace(/\[(NEUTRAL|ENGAGED|POSITIVE|SKEPTICAL)\]/i, "").trim();
      }

      addMessage({ role: "assistant", content: fullResponse });
      voiceService.speak(fullResponse);
    } catch (error) {
      console.error(error);
      setStatus("idle");
    }
  };

  const startVoiceInput = () => {
    voiceService.startListening((text, isFinal) => {
      if (isFinal) {
        setInterimTranscript("");
        handleSend(text);
      } else {
        setInterimTranscript(text);
      }
    });
  };

  return (
    <div className="w-[300px] flex flex-col h-full bg-[#0a0a0f]/60 backdrop-blur-[20px] border-l border-white/8 p-6 overflow-y-auto custom-scrollbar">
      <h3 className="text-sm font-semibold text-white mb-5 uppercase tracking-tight">Persona Output</h3>
      
      {/* Session History Style */}
      <div className="flex-1 space-y-5 mb-8">
        <AnimatePresence>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-1"
            >
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                {m.role === "user" ? "Client Input" : "Neural Response"}
              </div>
              <div className={cn(
                "text-sm leading-relaxed",
                m.role === "user" ? "text-slate-400" : "text-white font-medium"
              )}>
                {m.content}
              </div>
            </motion.div>
          ))}
          
          {interimTranscript && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm italic text-blue-400/60">
              {interimTranscript}...
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-auto space-y-4">
         {/* Live Transcription Box like HUD */}
         <div className="p-4 rounded-xl bg-white/3 border border-white/10">
            <div className="text-[10px] text-slate-600 uppercase tracking-widest mb-2">Live Stream</div>
            <div className="text-xs text-slate-300 leading-relaxed min-h-[40px]">
               {status === "listening" ? interimTranscript || "Waiting for audio..." : "System dormant. Type or Speak."}
            </div>
         </div>

         {/* Text Input Fallback */}
         <div className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
              placeholder="Command override..."
              className="w-full bg-white/3 border border-white/5 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
            />
         </div>

         {/* Controls */}
         <div className="flex items-center gap-2">
            <button 
               onClick={() => status === "listening" ? voiceService.stopListening() : startVoiceInput()}
               className={cn(
                 "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all",
                 status === "listening" ? "bg-red-500 border-red-400 text-white" : "bg-blue-600 border-blue-500 text-white"
               )}
            >
               <Mic className="w-4 h-4" />
               <span className="text-xs font-bold">{status === "listening" ? "Stop" : "Speak"}</span>
            </button>
            <button onClick={() => toggleMute()} className="p-3 bg-white/5 border border-white/10 rounded-xl">
               {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
         </div>
      </div>
    </div>
  );
}
