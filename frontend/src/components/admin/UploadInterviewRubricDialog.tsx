import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormSelect from "@/components/admin/FormSelect";
import { useUploadInterviewRubrics } from "@/hooks/useInterviewRubrics";
import { useAuth } from "@/hooks/useAuth";
import { APPLICATION_INTERVIEW_RUBRICS } from "@/data/rubrics";
import { throwSuccessToast } from "@/components/toasts/SuccessToast";
import { throwErrorToast } from "@/components/toasts/ErrorToast";

export default function UploadInterviewRubricDialog() {
  const [open, setOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<string | undefined>();
  const { token } = useAuth();

  const { mutate: uploadInterviewRubrics, isPending: isUploading } =
    useUploadInterviewRubrics();

  const handleUpload = async () => {
    if (!selectedFormId || !token) return;

    try {
      uploadInterviewRubrics({
        interviewRubrics: APPLICATION_INTERVIEW_RUBRICS(selectedFormId),
        token: (await token()) ?? "",
      });
      throwSuccessToast("Interview rubrics uploaded successfully!");
      setOpen(false);
    } catch {
      throwErrorToast("Failed to upload interview rubrics");
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setSelectedFormId(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload Interview Rubrics"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Interview Rubrics</DialogTitle>
          <DialogDescription>
            Select the form to upload interview rubrics for. This will upload
            the rubric configuration for interviewers to use when scoring
            candidates.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="form-select" className="text-sm font-medium">
              Select Form
            </label>
            <FormSelect
              className="w-full"
              selectedId={selectedFormId}
              onValueChange={setSelectedFormId}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFormId || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
