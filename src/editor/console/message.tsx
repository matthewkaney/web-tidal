import { render } from "preact";
import { useCallback } from "preact/hooks";

import { Evaluation, Log } from "./index";

type TerminalMessage = {
  source: string;
  level: "info" | "error";
} & (
  | {
      input: string;
      output?: string;
    }
  | { output: string }
);

export function messageConstructor(rawMessage: Evaluation | Log) {
  let message = format(rawMessage);

  let messageDom = document.createElement("div");
  messageDom.classList.add(
    "cm-console-message",
    `cm-console-message-${message.level}`
  );

  render(<MessageContent message={message} />, messageDom);

  return messageDom;
}

interface MessageContentProps {
  message: TerminalMessage;
}

function MessageContent({ message }: MessageContentProps) {
  const ref = useCallback((current: HTMLDivElement | null) => {
    if (current !== null) {
      const observer = new ResizeObserver(([size]) => {
        let { blockSize, inlineSize } = size.borderBoxSize[0];
        const points = [
          "0 0",
          `calc(100% - ${inlineSize + 1}px) 0`,
          `calc(100% - ${inlineSize + 1}px) ${blockSize + 1}px`,
          `100% ${blockSize + 1}px`,
          "100% 100%",
          "0 100%",
        ];
        current.style.clipPath = `polygon(${points.join(", ")})`;
      });

      let source = current.parentElement?.querySelector(
        ".cm-console-message-source"
      );
      if (source) {
        observer.observe(source);
      }
    }
  }, []);

  return (
    <>
      <div class="cm-console-message-content" ref={ref}>
        {"input" in message && (
          <div class="cm-console-message-input">{message.input}</div>
        )}
        {message.output && (
          <div class="cm-console-message-output">{message.output}</div>
        )}
      </div>
    </>
  );
}

function format(message: Evaluation | Log): TerminalMessage {
  if ("input" in message) {
    let { input, success, text } = message;
    return {
      source: "Tidal",
      level: success ? "info" : "error",
      input,
      output: text,
    };
  } else {
    let { level, text } = message;
    return {
      source: "Tidal",
      level,
      output: text,
    };
  }
}
