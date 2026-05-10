import { create } from "zustand";
import { Persona, DEFAULT_PERSONA, MODELS } from "../lib/constants";

export type Status = "idle" | "listening" | "thinking" | "speaking";
export type Emotion = "neutral" | "engaged" | "positive" | "skeptical";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface AppState {
  status: Status;
  emotion: Emotion;
  persona: Persona;
  messages: Message[];
  selectedModel: string;
  isMuted: boolean;
  isFullscreen: boolean;
  networkLatency: number;
  
  setStatus: (status: Status) => void;
  setEmotion: (emotion: Emotion) => void;
  setPersona: (persona: Persona) => void;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  setSelectedModel: (model: string) => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  setNetworkLatency: (latency: number) => void;
  resetSession: () => void;
}

export const useStore = create<AppState>((set) => ({
  status: "idle",
  emotion: "neutral",
  persona: DEFAULT_PERSONA,
  messages: [],
  selectedModel: MODELS[0].id,
  isMuted: false,
  isFullscreen: false,
  networkLatency: 0,

  setStatus: (status) => set({ status }),
  setEmotion: (emotion) => set({ emotion }),
  setPersona: (persona) => set({ persona }),
  addMessage: (msg) => set((state) => ({
    messages: [...state.messages, { ...msg, id: Math.random().toString(36).substring(7), timestamp: Date.now() }]
  })),
  setSelectedModel: (model) => set({ selectedModel: model }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
  setNetworkLatency: (latency) => set({ networkLatency: latency }),
  resetSession: () => set({ messages: [], status: "idle", emotion: "neutral" }),
}));
