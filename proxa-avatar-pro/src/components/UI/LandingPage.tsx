import { motion } from "motion/react";
import { Sparkles, ArrowRight, Shield, Zap, Globe, Cpu } from "lucide-react";

export default function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto overflow-x-hidden relative custom-scrollbar">
      {/* Abstract Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-8 pt-32 pb-40 relative z-10">
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 mb-10 shadow-2xl"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Next-Gen Virtual Intelligence</span>
        </motion.div>

        {/* Hero Headline */}
        <div className="max-w-4xl mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] mb-8"
          >
            THE FUTURE<br/>OF <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">PRESENCE.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl font-medium leading-relaxed"
          >
            Scale your digital engagement with hyper-realistic AI avatars that listen, speak, and emote in real-time. Designed for the high-performance commercial enterprise.
          </motion.p>
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center gap-4"
        >
          <button 
            onClick={onStart}
            className="group flex items-center gap-3 px-8 py-5 bg-white text-slate-950 font-bold rounded-2xl transition-all hover:bg-blue-50 hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/5"
          >
            Launch Command Center
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-5 text-white font-bold rounded-2xl border border-slate-800 transition-all hover:bg-slate-900">
            View API Docs
          </button>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-48">
           <FeatureCard 
             icon={<Zap className="w-5 h-5 text-amber-400" />}
             title="Ultra-Low Latency"
             desc="Lip-sync and response times under 300ms for natural flow."
           />
           <FeatureCard 
             icon={<Shield className="w-5 h-5 text-blue-400" />}
             title="Enterprise Security"
             desc="Data isolation and end-to-end encryption for every session."
           />
           <FeatureCard 
             icon={<Globe className="w-5 h-5 text-indigo-400" />}
             title="Multilingual"
             desc="Communicate across 50+ languages with native precision."
           />
        </div>

        {/* Partners */}
        <div className="mt-48 pt-12 border-t border-slate-900 flex flex-col items-center">
           <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-600 mb-12 text-center">Powered by Core Infrastructure</span>
           <div className="flex flex-wrap justify-center gap-16 opacity-30 grayscale saturate-0">
              <div className="flex items-center gap-3"><Cpu className="w-8 h-8" /><span className="text-2xl font-black">NVIDIA</span></div>
              <div className="flex items-center gap-3"><Sparkles className="w-8 h-8" /><span className="text-2xl font-black">OPENAI</span></div>
              <div className="flex items-center gap-3"><Globe className="w-8 h-8" /><span className="text-2xl font-black">AWS</span></div>
           </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-20 py-12 px-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-xs">P</div>
            <span className="font-bold text-white tracking-tighter">PROXA LABS</span>
          </div>
          <div className="flex gap-12">
            <a href="#" className="text-xs font-mono text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Safety</a>
            <a href="#" className="text-xs font-mono text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Status</a>
            <a href="#" className="text-xs font-mono text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Privacy</a>
          </div>
          <span className="text-[10px] text-slate-600 font-mono">© 2026 PROXA LABS SYSTEM CORP.</span>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm group hover:border-slate-700 transition-all shadow-lg hover:shadow-2xl">
      <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}
