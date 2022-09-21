import { EditorConfig } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";
import Delimiter from "@editorjs/delimiter";
import Marker from "@editorjs/marker";
import List from "@editorjs/list";
import InlineCode from "@editorjs/inline-code";
import VideoNote from "./customTools/VideoNote";
import ImageBlock from "./customTools/ImageBlock";
import Code from "@calumk/editorjs-codeflask";
import QuoteBlock from "./customTools/QuoteBlock";

export const editorTools: EditorConfig["tools"] = {
  paragraph: {
    class: Paragraph,
    config: {
      placeholder: "Shift+Tab to add new block, Tab to open settings",
    },
  },
  delimiter: Delimiter,
  header: Header,
  marker: { class: Marker, shortcut: "CMD+SHIFT+M" },
  list: { class: List, inlineToolbar: true },
  inlineCode: { class: InlineCode, shortcut: "CMD+SHIFT+K" },
  code: { class: Code, config: { placeholder: "Press TAB to select language", preserveBlank: false }, shortcut: "CMD+SHIFT+C" },
  videoNote: {
    // @ts-ignore
    class: VideoNote,
    inlineToolbar: true,
  },
  // @ts-ignore
  image: { class: ImageBlock, inlineToolbar: true },
  quote: QuoteBlock,
};
