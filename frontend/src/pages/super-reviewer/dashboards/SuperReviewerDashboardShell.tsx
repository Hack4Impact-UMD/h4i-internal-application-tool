import DashboardShellLink from "@/components/reviewer/DashboardShellLink";
import { throwErrorToast } from "@/components/toasts/ErrorToast";
import { throwSuccessToast } from "@/components/toasts/SuccessToast";
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useApplicationForm } from "@/hooks/useApplicationForm";
import useSearch from "@/hooks/useSearch";
import { setFormDecisionRelease } from "@/services/applicationFormsService";
import {
  getAllApplicationStatusesForForm,
  isDecided,
  rejectUndecidedApplicantsForForm,
} from "@/services/statusService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RadioIcon, ShieldIcon, StopCircleIcon } from "lucide-react";
import { useState } from "react";
import { Outlet, useParams } from "react-router-dom";

export default function SuperReviewerDashboardShell() {
  const { search, setSearch } = useSearch();
  const { formId } = useParams<{ formId: string }>();
  const {
    data: form,
    isPending: formPending,
    error: formError,
  } = useApplicationForm(formId);
  const queryClient = useQueryClient();
  const [releaseConfirm, setReleaseConfirm] = useState("");

  const releaseDecisionsMutation = useMutation({
    mutationFn: async ({ released }: { released: boolean }) => {
      setReleaseConfirm("");
      if (!formId) throw new Error("Invalid form ID");

      const statuses = await getAllApplicationStatusesForForm(formId);

      if (statuses.some((s) => !isDecided(s.status))) {
        throw new Error(
          "Some applicants have not been decided yet. Can't release decisions.",
        );
      }

      await setFormDecisionRelease(formId, released);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["form", formId] });
    },
    onError: (err) => {
      console.log(err);
      throwErrorToast(
        `Failed to release decisions: ${err.name} - ${err.message}`,
      );
    },
    onSuccess: () => {
      throwSuccessToast("Successfully released decisions!");
    },
  });

  const rejectUndecidedMutation = useMutation({
    mutationFn: async () => {
      if (!formId) throw new Error("Invalid form ID");
      await rejectUndecidedApplicantsForForm(formId);
    },
    onError: (err) => {
      console.log(err);
      throwErrorToast(`Failed to reject undecided applicants: ${err.message}`);
    },
    onSuccess: () => {
      throwSuccessToast("Successfully updated applicant statuses!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey.includes("qualified-apps-rows"),
      });
    },
  });

  return (
    <div className="w-full grow bg-lightgray flex flex-col items-center p-2 py-4">
      <div className="max-w-5xl w-full rounded bg-white p-4 flex flex-col gap-2">
        <div className="flex gap-2 flex-row items-center">
          <div className="flex gap-2 flex-row items-center overflow-x-scroll">
            <DashboardShellLink
              to={`/admin/dor/dashboard/${formId}/all`}
              name="All Applications"
            />
            <DashboardShellLink
              to={`/admin/dor/dashboard/${formId}/qualified`}
              name="Qualified"
            />
            <DashboardShellLink
              to={`/admin/dor/dashboard/${formId}/assigned-reviews`}
              name="Assigned Reviews"
            />
            <DashboardShellLink
              to={`/admin/dor/dashboard/${formId}/assigned-interviews`}
              name="Assigned Interviews"
            />
            <DashboardShellLink
              to={`/admin/dor/dashboard/${formId}/reviewers`}
              name="Reviewers"
            />
            <DashboardShellLink
              to={`/admin/dor/dashboard/${formId}/board`}
              name="Board"
            />
            <DashboardShellLink
              to={`/admin/dor/dashboard/${formId}/interviewers`}
              name="Interviewers"
            />
            <DashboardShellLink
              to={`/admin/dor/dashboard/${formId}/acceptance-confirmation`}
              name="Confirmations"
            />
          </div>
          <Dialog open={rejectUndecidedMutation.isPending}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Please wait</DialogTitle>
                <DialogDescription>
                  Rejecting undecided applicants...
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"} size="icon">
                  <ShieldIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Admin Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  className="cursor-pointer"
                  variant="destructive"
                  onClick={() => rejectUndecidedMutation.mutate()}
                >
                  <StopCircleIcon />
                  Deny all undecided applicants
                </DropdownMenuItem>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    disabled={
                      !form ||
                      form.decisionsReleased ||
                      releaseDecisionsMutation.isPending
                    }
                  >
                    {formPending ? (
                      "Loading..."
                    ) : formError ? (
                      "Failed to load form"
                    ) : form.decisionsReleased ? (
                      "Decisions already released"
                    ) : (
                      <>
                        <RadioIcon />
                        Release decisions for this form
                      </>
                    )}
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm decision release</AlertDialogTitle>
                <AlertDialogDescription>
                  Releasing decisions will immediately make them viewable on
                  applicant decision pages.
                  <strong> To confirm this action, type "I confirm"</strong>
                </AlertDialogDescription>
                <Input
                  placeholder="I confirm"
                  value={releaseConfirm}
                  onChange={(e) => setReleaseConfirm(e.target.value)}
                />
                <AlertDialogAction
                  disabled={releaseConfirm !== "I confirm"}
                  onClick={() =>
                    releaseDecisionsMutation.mutate({
                      released: true,
                    })
                  }
                >
                  Confirm
                </AlertDialogAction>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-full px-2 py-1 text-sm w-full max-w-md ml-auto"
            placeholder="Search"
          />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
