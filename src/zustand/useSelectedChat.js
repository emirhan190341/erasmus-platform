import { create } from "zustand";

export const useSelectedChat = create((set) => ({
	selectedChat: null,
	setSelectedChat: (selectedChat) => set({ selectedChat }),
}));
