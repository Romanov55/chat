import { create } from 'zustand';

export const useStore = create((set) => ({
  messages: [],
  setMessages: (newMessages) => set((state) => ({
    messages: Array.isArray(newMessages) ? newMessages : [...state.messages, newMessages],
  })),
}));
