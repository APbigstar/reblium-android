import { create } from "zustand";

interface MessageStore {
  isProcessingMessage: boolean;
  lastBotMessage: string;
  messageTimestamp: number;
  setIsProcessingMessage: (value: boolean) => void;
  setLastBotMessage: (message: string) => void;
}

// Create message store with zustand
export const useMessageStore = create<MessageStore>((set) => ({
  isProcessingMessage: false,
  lastBotMessage: "",
  messageTimestamp: Date.now(),
  setIsProcessingMessage: (value) => set({ isProcessingMessage: value }),
  setLastBotMessage: (message) => set({ lastBotMessage: message }),
}));
