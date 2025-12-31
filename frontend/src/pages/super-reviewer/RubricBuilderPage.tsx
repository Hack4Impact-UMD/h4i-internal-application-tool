import { useState, useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/form/CodeEditor";
import { RoleReviewRubric } from "@/types/types";
import { useApplicationForm } from "@/hooks/useApplicationForm";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/Loading";
import { useParams } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useRubricsForForm } from "@/hooks/useRubrics";
import { useInterviewRubricsForForm } from "@/hooks/useInterviewRubrics";

export default function RubricBuilderPage() {
  const [jsonCode, setJsonCode] = useState("[]");
  const [previewRubrics, setPreviewRubrics] = useState<RoleReviewRubric[]>([]);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [autoCompile, setAutoCompile] = useState(false);
  const [rubricType, setRubricType] = useState<"application" | "interview">("application");

  const { formId } = useParams();
  const { token } = useAuth();

  const {
    data: form,
    isPending: isLoadingForm,
    error: loadFormError,
  } = useApplicationForm(formId, false);

  const {
    data: applicationRubrics,
    isPending: isLoadingAppRubrics,
    error: loadAppRubricsError,
  } = useRubricsForForm(formId);

  const {
    data: interviewRubrics,
    isPending: isLoadingIntRubrics,
    error: loadIntRubricsError,
  } = useInterviewRubricsForForm(formId);

  useEffect(() => {
    const rubrics = rubricType === "application" ? applicationRubrics : interviewRubrics;

    if (rubrics) {
      const formattedJson = JSON.stringify(rubrics, null, 2);
      setJsonCode(formattedJson);
    }
  }, [applicationRubrics, interviewRubrics, rubricType]);

  if (!formId) {
    return <p>Form ID not specified!</p>
  }

  if (isLoadingForm || isLoadingAppRubrics || isLoadingIntRubrics) {
    return <Loading />;
  }

  if (loadFormError || loadAppRubricsError || loadIntRubricsError) {
    return (
      <div className="p-4 w-full flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Failed to Load Form or Rubrics
          </h2>
          <p className="text-gray-600">
            {loadFormError?.message || loadAppRubricsError?.message || loadIntRubricsError?.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 w-full flex flex-col items-center h-[calc(100vh-4rem)] overflow-hidden">
      <div className="w-full max-w-8xl h-full flex flex-col">
        <div className="flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-2xl">Rubric Builder</h1>
            {form && (
              <span className="text-muted-foreground text-sm">
                - {form.id}
              </span>
            )}
            <ToggleGroup
              type="single"
              value={rubricType}
              onValueChange={(value) => value && setRubricType(value as "application" | "interview")}
            >
              <ToggleGroupItem value="application" className="data-[state=on]:bg-blue data-[state=on]:text-white bg-white cursor-pointer px-3">
                Application
              </ToggleGroupItem>
              <ToggleGroupItem value="interview" className="data-[state=on]:bg-blue data-[state=on]:text-white bg-white cursor-pointer px-3">
                Interview
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span>Auto-compile</span>
              <Switch checked={autoCompile} onCheckedChange={setAutoCompile} className="h-5" />
            </div>
            <Button
              onClick={() => {}}
              className="bg-blue hover:bg-blue/80"
            >
              Compile
            </Button>
            <Button
              onClick={() => {}}
              disabled={false}
              className="bg-green-600 hover:bg-green-700"
            >
              Upload Rubrics
            </Button>
          </div>
        </div>

        <ResizablePanelGroup direction="horizontal" className="flex-1 mt-2 min-h-0">
          <ResizablePanel defaultSize={50} minSize={30}>
            <CodeEditor
              value={jsonCode}
              onChange={setJsonCode}
              placeholderText="Enter your rubrics JSON here..."
              language="json"
              className="h-full"
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="w-full h-full flex flex-col border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm">
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-300">
                <h3 className="text-md font-medium text-white">Rubric Preview</h3>
              </div>
              <div className="flex flex-col h-full relative">
                {compileError && (
                  <div className="text-red-600 bg-white/90 text-center py-8 flex flex-col items-center justify-center absolute top-0 left-0 right-0 bottom-0">
                    <h4 className="font-semibold mb-2">Compilation Error</h4>
                    <p className="text-sm font-bold">{compileError}</p>
                  </div>
                )}
                <div className="flex-1 overflow-y-auto p-2 bg-gray-50">
                  {previewRubrics.length > 0 ? (
                    <div className="space-y-6">
                      {/* TODO: Map over previewRubrics and display RoleRubric components */}
                      <div className="text-gray-500 text-center py-8 text-lg">
                        Rubric preview will appear here
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center py-8 text-lg">
                      Click "Compile" to preview your rubrics
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
