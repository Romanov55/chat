import { create } from 'zustand'

type Store = {
  isActiveChat: boolean;
  setActiveChat: (e: boolean) => void;
  receiverId: string;
  setReceiverId: (e: string) => void;
}

export const useStore = create<Store>()((set) => ({
  isActiveChat: false,
  setActiveChat: (e) => set({ isActiveChat: e }),
  receiverId: '',
  setReceiverId: (e) => set({ receiverId: e }),
})) 