"use client";

import { type ComponentProps } from "react";
import ReactMarkdown, { type ExtraProps } from "react-markdown";
import { createLowlight, common } from "lowlight";
import { toHtml } from "hast-util-to-html";

const lowlight = createLowlight(common);

type CodeProps = ComponentProps<"code"> & ExtraProps;

function MessageCode({ className, children, node, ...rest }: CodeProps) {
  void node;
  const isBlock = typeof className === "string" && /(^|\s)language-/.test(className);
  if (!isBlock) {
    return (
      <code
        className="rounded bg-black/40 px-1 py-0.5 font-mono text-[0.8em] text-foreground wrap-break-word [word-break:normal]"
        {...rest}
      >
        {children}
      </code>
    );
  }

  const raw = String(children).replace(/\n$/, "");
  const langMatch = /(?:^|\s)language-(\S+)/.exec(className ?? "");
  const lang = langMatch?.[1] ?? "plaintext";
  let innerHtml: string;
  try {
    const tree = lowlight.highlight(lang, raw);
    innerHtml = toHtml(tree);
  } catch {
    try {
      const tree = lowlight.highlightAuto(raw);
      innerHtml = toHtml(tree);
    } catch {
      innerHtml = raw
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }
  }

  return (
    <code
      className={`hljs ${className ?? ""}`.trim()}
      dangerouslySetInnerHTML={{ __html: innerHtml }}
      {...rest}
    />
  );
}

function MessagePre({ children, ...rest }: ComponentProps<"pre">) {
  return (
    <div className="tiptap tiptap-in-bubble w-full min-w-0 text-left wrap-anywhere">
      <pre {...rest}>{children}</pre>
    </div>
  );
}

const components: React.ComponentProps<typeof ReactMarkdown>["components"] = {
  pre: MessagePre,
  code: MessageCode,
};

export function MessageMarkdownContent({ text }: { text: string }) {
  if (!text.trim()) {
    return null;
  }

  return (
    <div className="w-full wrap-anywhere [&_p]:my-2 [&_p]:first:mt-0 [&_p]:last:mb-0">
      <ReactMarkdown components={components}>{text}</ReactMarkdown>
    </div>
  );
}
