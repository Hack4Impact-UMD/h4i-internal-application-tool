import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { useAllApplicationForms } from "@/hooks/useApplicationForm";
import { useAuth } from "@/hooks/useAuth";
import { ApplicationForm, PermissionRole } from "@/types/types";
import { displayUserRoleName } from "@/utils/display";
import { Link, useNavigate } from "react-router-dom";
import UploadReviewRubricDialog from "@/components/admin/UploadReviewRubricDialog";
import UploadInterviewRubricDialog from "@/components/admin/UploadInterviewRubricDialog";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EllipsisVertical,
  LockIcon,
  MailIcon,
  MailOpenIcon,
  UnlockIcon,
} from "lucide-react";
import { useUpdateApplicationFormActive } from "@/hooks/useUpdateApplicationFormActive";
import DuplicateFormDialog from "@/components/dor/DuplicateFormDialog/DuplicateFormDialog";
import { useState } from "react";
import CreateInternalApplicantDialog from "@/components/reviewer/CreateInternalApplicantDialog";
import {
  TooltipContent,
  Tooltip,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ChangeDueDateDialog from "@/components/dor/ChangeDueDateDialog/ChangeDueDateDialog";

export default function AdminHome() {
  const navigate = useNavigate();
  const { data: forms, isPending, error } = useAllApplicationForms();
  const { user } = useAuth();
  const [selectedForm, setSelectedForm] = useState<ApplicationForm>();
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [showDueDateDialog, setShowDueDateDialog] = useState(false);
  const [formsLocked, setFormsLocked] = useState(true);

  const { mutate: setFormActiveStatus, isPending: activePending } =
    useUpdateApplicationFormActive();

  if (!user) return <Loading />;

  const route =
    user.role === PermissionRole.Reviewer
      ? "reviewer"
      : user.role === PermissionRole.Board
        ? "board"
        : "dor";

  const table =
    user.role === PermissionRole.Reviewer
      ? "apps"
      : user.role === PermissionRole.Board
        ? "interviews"
        : "all";

  if (isPending) return <Loading />;
  if (error) return <p>Failed to fetch forms: {error.message}</p>;

  return (
    <div className="w-full grow px-2 py-4 flex gap-2 flex-col bg-lightgray items-center">
      <div className="max-w-5xl w-full p-4 rounded-md">
        <h1 className="text-2xl font-bold">Welcome, {user.firstName}!</h1>
        <p className="text-muted-foreground">
          You are a {displayUserRoleName(user.role)}.
        </p>
      </div>

      <div className="max-w-5xl w-full p-4 bg-white rounded-md">
        <div className="flex flex-row items-center">
          <div className="grow">
            <h1 className="text-xl">Go to Review Dashboards</h1>
            <p className="text-muted-foreground">
              To access dashboards, you need to select which form you want to
              view application and review data for.
            </p>
          </div>
          {user.role === PermissionRole.SuperReviewer && (
            <div className="flex flex-row items-center gap-2">
              <UnlockIcon className="size-4" />
              <Switch checked={formsLocked} onCheckedChange={setFormsLocked} />
              <LockIcon className="size-4" />
            </div>
          )}
        </div>

        <ul className="flex flex-col gap-2 mt-4">
          {forms.map((form) => {
            return (
              <span
                className="border border-gray-300 p-2 rounded-md flex flex-row gap-2 items-center"
                key={form.id}
              >
                <Link
                  to={`/admin/${route}/dashboard/${form.id}/${table}`}
                  className="grow flex gap-2 items-center"
                >
                  <Tooltip>
                    <TooltipTrigger>
                      {form.decisionsReleased ? (
                        <MailOpenIcon className="size-4 text-blue" />
                      ) : (
                        <MailIcon className="size-4" />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      {form.decisionsReleased
                        ? "Decisions Released"
                        : "Decisions Not Released"}
                    </TooltipContent>
                  </Tooltip>
                  <span
                    className={`${!form.isActive ? "bg-muted" : "bg-lightblue"} px-2 py-1 text-sm rounded-full`}
                  >
                    Due{" "}
                    {Intl.DateTimeFormat("en-us", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(form.dueDate.toDate())}
                  </span>
                  <span>
                    Semester: {form.semester} (ID:{" "}
                    <span className="font-mono text-sm">{form.id}</span>)
                  </span>
                </Link>

                {user.role === PermissionRole.SuperReviewer && (
                  <>
                    <Switch
                      checked={form.isActive}
                      disabled={activePending || formsLocked}
                      onCheckedChange={(active) =>
                        setFormActiveStatus({ formId: form.id, active })
                      }
                    />

                    <DropdownMenu>
                      <DropdownMenuTrigger disabled={formsLocked} asChild>
                        <Button variant="outline">
                          <EllipsisVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Link to={`/admin/dor/form-builder/${form.id}`}>
                            Edit form
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link to={`/admin/dor/rubric-builder/${form.id}`}>
                            Edit rubrics
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedForm(form);
                            setShowDuplicateDialog(true);
                          }}
                        >
                          Duplicate form
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedForm(form);
                            setShowDueDateDialog(true);
                          }}
                        >
                          Change due date
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </span>
            );
          })}
        </ul>
      </div>
      {user.role == PermissionRole.SuperReviewer && (
        <>
          <div className="max-w-5xl w-full p-4 bg-white rounded-md">
            <h1 className="text-xl">Or Manage Users </h1>
            <p className="text-muted-foreground">
              View all registered users, grant reviewer access, edit roles, and
              delete user accounts.
            </p>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => navigate("/admin/dor/users")}>
                Manage Users
              </Button>
              <CreateInternalApplicantDialog />
            </div>
          </div>
          <div className="max-w-5xl w-full p-4 bg-white rounded-md">
            <h1 className="text-xl">Upload Application Rubrics</h1>
            <p className="text-muted-foreground">
              Upload the application rubrics to Firestore.
            </p>
            <div className="flex gap-2 mt-4">
              <UploadReviewRubricDialog />
              <UploadInterviewRubricDialog />
            </div>
          </div>
          {selectedForm && (
            <>
              <DuplicateFormDialog
                open={showDuplicateDialog}
                form={selectedForm}
                onOpenChange={setShowDuplicateDialog}
              />
              <ChangeDueDateDialog
                open={showDueDateDialog}
                form={selectedForm}
                onOpenChange={setShowDueDateDialog}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
