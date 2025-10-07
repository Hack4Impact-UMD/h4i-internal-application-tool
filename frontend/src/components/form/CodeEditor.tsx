import { twMerge } from "tailwind-merge";
import Editor from "@monaco-editor/react";

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
  language = "json",
}) => {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || "");
  };

  return (
    <div
      className={twMerge(
        "flex flex-col w-full h-full bg-white rounded-md border-2 border-gray-200 overflow-hidden",
        className,
      )}
    >
      {/* Header */}
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-300">
        <div className="flex items-center justify-between">
          <span className="text-md font-medium text-white">Code Editor</span>
          <span className="text-xs text-gray-300">
            {language.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={value}
          onChange={handleEditorChange}
          theme="vs-light"
          options={{
            fontSize: 16,
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            lineHeight: 24,
            wordWrap: "on",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            renderWhitespace: "selection",
            bracketPairColorization: { enabled: true },
            guides: {
              indentation: true,
              bracketPairs: true,
            },
            suggest: {
              showKeywords: true,
              showSnippets: true,
            },
            quickSuggestions: true,
            parameterHints: { enabled: true },
            hover: { enabled: true },
            formatOnPaste: true,
            formatOnType: true,
            folding: true,
            lineNumbers: "on",
            glyphMargin: false,
            foldingStrategy: "indentation",
            showFoldingControls: "always",
            matchBrackets: "always",
            renderLineHighlight: "line",
            cursorBlinking: "blink",
            cursorStyle: "line",
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            contextmenu: true,
            mouseWheelZoom: true,
            smoothScrolling: true,
            cursorSmoothCaretAnimation: "on",
            occurrencesHighlight: "off",
            selectionHighlight: false,
          }}
        />
      </div>

      {/* Footer (Line Count) */}
      <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 text-xs text-gray-500">
        <span>
          {value.split("\n").length} line
          {value.split("\n").length !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
};

export default CodeEditor;
