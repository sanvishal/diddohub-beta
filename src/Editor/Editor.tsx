import EditorJS, { API as EditorAPI, EditorConfig, LogLevels, OutputData } from "@editorjs/editorjs";
import { memo, useEffect, useRef, useState } from "react";
// @ts-ignore
import DragDrop from "editorjs-drag-drop";
import "./Editor.module.scss";
import { Box } from "@chakra-ui/react";

const DEFAULT_INITIAL_DATA = (): OutputData => {
  return {
    time: new Date().getTime(),
    blocks: [
      {
        type: "header",
        data: {
          text: "This is my awesome egdfgfdditor!",
          level: 1,
        },
      },
      {
        type: "videoNote",
        data: {
          text: "skfjdsfdsf",
          timestamp: 1234,
        },
      },
    ],
  };
};

const EDITOR_HOLDER_ID = "editorjs";

interface IEditorProps {
  onReady?: () => void;
  onChange?: (api: EditorAPI, event: CustomEvent<any>) => void;
  autoFocus?: boolean;
  initialData?: OutputData | undefined;
  tools?: EditorConfig["tools"];
  readOnly: boolean;
}

export const Editor = memo(({ onReady, onChange, autoFocus = true, initialData, tools, readOnly }: IEditorProps) => {
  const ejsInstance = useRef<EditorJS | null>();
  const [editorData, setEditorData] = useState(initialData ?? DEFAULT_INITIAL_DATA);

  useEffect(() => {
    if (!ejsInstance.current) {
      initEditor();
    }
    return () => {
      if (ejsInstance.current) {
        ejsInstance.current.destroy();
        ejsInstance.current = null;
      }
    };
  }, []);

  const initEditor = () => {
    const editor = new EditorJS({
      holder: EDITOR_HOLDER_ID,
      logLevel: "ERROR" as LogLevels,
      data: editorData,
      readOnly,
      onReady: () => {
        ejsInstance.current = editor;
        new DragDrop(editor, "1px dashed var(--chakra-colors-blackAlpha-400)");
        onReady?.();
      },
      onChange: async (api, e) => {
        onChange?.(api, e);
        let content = await api.saver.save();
        console.log(content);
        setEditorData(content);
      },
      autofocus: autoFocus,
      tools,
      i18n: {
        messages: {
          ui: {
            blockTunes: {
              toggler: {
                "Click to tune": "Click for more options \ndrag to rearrange",
              },
            },
          },
        },
      },
    });
  };

  return (
    <>
      <Box id={EDITOR_HOLDER_ID}></Box>
    </>
  );
});
