import { useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholderText?: string;
  language?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  className = "",
  placeholderText = "",
  language = "json",
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lines = value.split("\n");
  const lineCount = lines.length;

  useEffect(() => {
    const textarea = textareaRef.current;
    const lineNumbers = lineNumbersRef.current;
    if (!textarea || !lineNumbers) return;

    const handleScroll = () => (lineNumbers.scrollTop = textarea.scrollTop);
    textarea.addEventListener("scroll", handleScroll);
    return () => textarea.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={twMerge(
        "flex flex-col w-full h-full bg-white rounded-md border-2 border-gray-200 overflow-hidden",
        className,
      )}
    >
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-300">
        <div className="flex items-center justify-between">
          <span className="text-md font-medium text-white">Code Editor</span>
          <span className="text-xs text-gray-300">
            {language.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div
          ref={lineNumbersRef}
          className="bg-gray-100 border-r border-gray-300 px-3 py-3 text-base text-gray-500 font-mono select-none flex-shrink-0 overflow-hidden"
          style={{
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            lineHeight: "1.5rem",
          }}
        >
          {lines.map((_, index) => (
            <div key={index} className="leading-6 whitespace-nowrap">
              {index + 1}
            </div>
          ))}
        </div>

        <div className="flex-1 relative overflow-hidden">
          <textarea
            ref={textareaRef}
            className="w-full h-full p-3 font-mono text-base resize-none border-none outline-none bg-white"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholderText}
            spellCheck={false}
            style={{
              fontFamily:
                'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
              lineHeight: "1.5rem",
              whiteSpace: "pre",
              overflow: "auto",
            }}
          />
        </div>
      </div>

      <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 text-xs text-gray-500">
        <span>
          {lineCount} line{lineCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
};

export default CodeEditor;
