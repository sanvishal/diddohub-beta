import { YouTubeEvent } from "react-youtube";
import create from "zustand";

interface IEditorProxyStore {
  videoRef: YouTubeEvent | null;
  setVideoRef: (ref: YouTubeEvent) => void;
}

export const useEditorProxyStore = create<IEditorProxyStore>((set) => ({
  videoRef: null,
  setVideoRef: (ref: YouTubeEvent) => set((state) => ({ videoRef: ref })),
}));
