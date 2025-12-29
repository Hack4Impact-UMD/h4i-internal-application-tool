import { useState } from "react";
import { Button } from "@/components/ui/button";
import { calculateBootcampAssignmentPlan, AutoAssignmentPlanItem } from "@/services/autoAssignmentService";
import { throwErrorToast } from "@/components/toasts/ErrorToast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";

interface AutoAssignButtonProps {
  formId: string;
  disabled?: boolean;
}

export function AutoAssignButton({ formId, disabled }: AutoAssignButtonProps) {
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [assignmentPlan, setAssignmentPlan] = useState<AutoAssignmentPlanItem[] | null>(null);

  const calculatePlanMutation = useMutation({
    mutationFn: async () => {
      return await calculateBootcampAssignmentPlan(formId);
    },
    onSuccess: (plan) => {
      setAssignmentPlan(plan);
      setShowPreviewDialog(true);
    },
    onError: (error) => {
      console.error("Failed to create auto-assignment plan:", error);
      throwErrorToast(`Failed to create auto-assignment plan!`);
    },
  });

  return (
    <>
      <Button
        variant="outline"
        onClick={() => calculatePlanMutation.mutate()}
        disabled={disabled || calculatePlanMutation.isPending}
      >
        {calculatePlanMutation.isPending ? "Matching..." : "Auto-Assign Bootcamp Applicants"}
      </Button>

      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Auto-Assignment Preview</DialogTitle>
            <DialogDescription>
              Review the proposed assignments below. Click Confirm to apply.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {assignmentPlan && (
              <>
                <div className="text-sm text-muted-foreground">
                  Possible assignments: {assignmentPlan.length} |
                  Assigned: {assignmentPlan.filter(p => !p.skipped).length} |
                  Skipped: {assignmentPlan.filter(p => p.skipped).length}
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Applicant</th>
                        <th className="px-4 py-2 text-left">Rev. 1</th>
                        <th className="px-4 py-2 text-left">Rev. 2</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignmentPlan.map((item, idx) => (
                        <tr
                          key={idx}
                          className={item.skipped ? "bg-yellow-50" : ""}
                        >
                          <td className="px-4 py-2 align-top">
                            {item.skipped ? "⚠️" : "✅"}
                          </td>
                          <td className="px-4 py-2 align-top">{item.applicantName}</td>
                          <td className={`px-4 py-2 align-top ${item.reviewer1 && !item.reviewer1.isExisting ? "bg-green-50" : ""}`}>
                            {item.reviewer1 ? item.reviewer1.name : "-"}
                          </td>
                          <td className={`px-4 py-2 align-top ${item.reviewer2 && !item.reviewer2.isExisting ? "bg-green-50" : ""}`}>
                            {item.reviewer1 ? item.reviewer1.name : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowPreviewDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => throwErrorToast("not implemented yet!")}
                    disabled={assignmentPlan.every(p => p.skipped)}
                  >
                    Confirm Assignments
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
