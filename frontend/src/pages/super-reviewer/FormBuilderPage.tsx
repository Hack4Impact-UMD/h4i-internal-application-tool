import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { h4iApplicationForm } from "@/data/h4i-application-form";
import CodeEditor from "@/components/form/CodeEditor";

export default function FormBuilderPage() {
  const [jsonCode, setJsonCode] = useState(() =>
    JSON.stringify(h4iApplicationForm, null, 2),
  );

  const handleCompile = () => {
    try {
      JSON.parse(jsonCode);
      // Add form preview functionality
    } catch (error) {
      console.error("Invalid JSON:", error);
    }
  };

  return (
    <div className="p-4 w-full flex flex-col items-center h-[calc(100vh-4rem)] overflow-hidden">
      <div className="w-full max-w-[95vw] h-full flex flex-col">
        <div className="flex justify-between items-center mb-3 pt-5 flex-shrink-0">
          <h1 className="font-bold text-2xl">Form Builder</h1>
          <Button onClick={handleCompile} className="bg-blue hover:bg-blue/80">
            Compile
          </Button>
        </div>

        <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
          <ResizablePanel defaultSize={50} minSize={30}>
            <CodeEditor
              value={jsonCode}
              onChange={setJsonCode}
              placeholderText="Enter your form JSON here..."
              language="json"
              className="h-full"
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="w-full h-full flex flex-col border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm">
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-300">
                <h3 className="text-md font-medium text-white">Form Preview</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="text-gray-500 text-center py-8 text-lg">
                  Form preview will appear here after compilation
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
