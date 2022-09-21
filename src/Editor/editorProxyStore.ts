import { YouTubeEvent } from "react-youtube";
import create from "zustand";
import type EditorJS from "@editorjs/editorjs";

type QuoteBlockState = {
  isOpen: boolean;
  id: string;
};

interface IEditorProxyStore {
  videoRef: YouTubeEvent | null;
  setVideoRef: (ref: YouTubeEvent) => void;
  editorRef: EditorJS | null;
  setEditorRef: (ref: EditorJS | null) => void;
  quoteBlockState: QuoteBlockState;
  addQuoteBlock: (qbState: QuoteBlockState) => void;
}

export const useEditorProxyStore = create<IEditorProxyStore>((set) => ({
  videoRef: null,
  setVideoRef: (ref: YouTubeEvent) => set(() => ({ videoRef: ref })),

  editorRef: null,
  setEditorRef: (ref: EditorJS | null) => set(() => ({ editorRef: ref })),

  quoteBlockState: { isOpen: false, id: "" },
  addQuoteBlock: (qbState: QuoteBlockState) => set(() => ({ quoteBlockState: qbState })),
}));
