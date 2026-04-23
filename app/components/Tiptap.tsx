"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Markdown } from "@tiptap/markdown";
import { createLowlight, common } from "lowlight";

import type { CSSProperties } from "react";
import type { Editor } from "@tiptap/core";

const lowlight = createLowlight(common);

const MAX_HEIGHT = 200;

export interface TiptapHandle {
  focus: () => void;
  getMarkdown: () => string;
}

export interface TiptapProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onEnterSubmit: () => void;
  placeholder: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

const Tiptap = forwardRef<TiptapHandle, TiptapProps>(function Tiptap(
  { id, value, onChange, onEnterSubmit, placeholder, disabled, className, style },
  ref
) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onEnterSubmitRef = useRef(onEnterSubmit);
  onEnterSubmitRef.current = onEnterSubmit;
  const editorRef = useRef<Editor | null>(null);
  const heightWrapRef = useRef<HTMLDivElement | null>(null);

  const extensions = useMemo(
    () => [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight, enableTabIndentation: true }),
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: true,
      }),
      Markdown,
    ],
    [placeholder]
  );

  const editor = useEditor(
    {
      extensions,
      content: "<p></p>",
      immediatelyRender: false,
      editable: !disabled,
      onUpdate: ({ editor: ed }) => {
        onChangeRef.current(ed.getText({ blockSeparator: "\n" }));
      },
      editorProps: {
        handleDOMEvents: {
          keydown: (_view, event) => {
            const e = event as KeyboardEvent;
            if (e.key !== "Enter" || e.shiftKey) {
              return false;
            }
            if (e.isComposing) {
              return false;
            }
            const ed = editorRef.current;
            if (ed?.isActive("codeBlock")) {
              return false;
            }
            e.preventDefault();
            onEnterSubmitRef.current();
            return true;
          },
        },
      },
    },
    [extensions]
  );

  editorRef.current = editor;

  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        editorRef.current?.chain().focus().run();
      },
      getMarkdown: () => {
        const ed = editorRef.current;
        if (!ed) return "";
        return ed.getMarkdown();
      },
    }),
    []
  );

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor) return;
    const current = editor.getText({ blockSeparator: "\n" });
    if (current === value) return;
    if (value === "") {
      editor.commands.clearContent();
      return;
    }
    editor.commands.setContent(value, {
      contentType: "markdown",
      emitUpdate: false,
    });
  }, [value, editor]);

  useEffect(() => {
    if (!editor) return;
    const wrap = heightWrapRef.current;
    if (!wrap) return;

    const updateHeight = () => {
      const inner = wrap.querySelector(".ProseMirror") as HTMLElement | null;
      if (!inner) return;
      wrap.style.height = "auto";
      const h = Math.min(inner.scrollHeight, MAX_HEIGHT);
      wrap.style.height = `${h}px`;
      wrap.style.overflowY = inner.scrollHeight > MAX_HEIGHT ? "auto" : "hidden";
    };

    updateHeight();
    editor.on("update", updateHeight);
    return () => {
      editor.off("update", updateHeight);
    };
  }, [editor, value]);

  return (
    <div
      ref={heightWrapRef}
      className={[className, disabled && "opacity-60"].filter(Boolean).join(" ")}
      style={style}
    >
      <EditorContent
        id={id}
        editor={editor}
        className="tiptap h-full min-h-0 w-full text-left focus-within:outline-none [&_.ProseMirror]:min-h-10 [&_.ProseMirror]:focus:outline-none "
        aria-disabled={disabled}
        data-testid="chat-tiptap"
      />
    </div>
  );
});

Tiptap.displayName = "Tiptap";

export default Tiptap;
