import { create } from "zustand";

export const usePosts = create((set) => ({
	posts: [],
	setPosts: (newPosts) => set({ posts: newPosts }),
}));
