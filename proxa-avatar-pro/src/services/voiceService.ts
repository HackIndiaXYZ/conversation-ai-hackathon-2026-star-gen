import { useStore } from "../store/useStore";

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: any) => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

class VoiceService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis = window.speechSynthesis;
  private isListening: boolean = false;

  constructor() {
    this.startListening = this.startListening.bind(this);
    this.stopListening = this.stopListening.bind(this);
    this.speak = this.speak.bind(this);

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (Recognition) {
      this.recognition = new Recognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = "en-US";

      this.recognition.onend = () => {
        this.isListening = false;
        if (useStore.getState().status === "listening") {
          useStore.getState().setStatus("idle");
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        this.isListening = false;
        useStore.getState().setStatus("idle");
      };
    }

    // Ensure voices are loaded
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = () => {
        console.log("System Voices Loaded:", this.synthesis.getVoices().length);
      };
    }
  }

  startListening(onResult: (text: string, isFinal: boolean) => void) {
    if (!this.recognition || this.isListening) return;
    
    this.isListening = true;
    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let final = "";
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript;
        else interim += event.results[i][0].transcript;
      }
      if (final) onResult(final, true);
      else if (interim) onResult(interim, false);
    };

    this.recognition.start();
    useStore.getState().setStatus("listening");
  }

  stopListening() {
    if (!this.recognition) return;
    this.recognition.stop();
    this.isListening = false;
    useStore.getState().setStatus("idle");
  }

  speak(text: string, onStart?: () => void, onEnd?: () => void) {
    if (useStore.getState().isMuted) {
      onEnd?.();
      return;
    }

    // Cancel existing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a good voice
    const voices = this.synthesis.getVoices();
    const premiumVoice = voices.find(v => v.name.includes("Google") || v.name.includes("Premium")) || voices[0];
    if (premiumVoice) utterance.voice = premiumVoice;
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      useStore.getState().setStatus("speaking");
      onStart?.();
    };

    utterance.onend = () => {
      useStore.getState().setStatus("idle");
      onEnd?.();
    };

    // Lip sync integration logic would go here
    // We can use boundary events to trigger lip sync
    utterance.onboundary = (event) => {
       if (event.name === 'word') {
          // Emit event for mouth movement
          window.dispatchEvent(new CustomEvent('lip-sync', { detail: { word: text.slice(event.charIndex, event.charIndex + event.charLength) } }));
       }
    };

    this.synthesis.speak(utterance);
  }

  cancel() {
    this.synthesis.cancel();
    this.stopListening();
  }
}

export const voiceService = new VoiceService();
