import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  useAllApplicationForms,
  useUploadApplicationForm,
} from "@/hooks/useApplicationForm";
import { useAuth } from "@/hooks/useAuth";
import { PermissionRole } from "@/types/types";
import { displayUserRoleName } from "@/utils/display";
import { Link, useNavigate } from "react-router-dom";
import { h4iApplicationForm } from "@/data/h4i-application-form";
import {
  APPLICATION_INTERVIEW_RUBRICS,
  APPLICATION_RUBRICS,
} from "@/data/rubrics";
import { useUploadRubrics } from "@/hooks/useRubrics";
import { throwErrorToast } from "@/components/toasts/ErrorToast";
import { useUploadInterviewRubrics } from "@/hooks/useInterviewRubrics";
import CreateInternalApplicantDialog from "@/components/reviewer/CreateInternalApplicantDialog";

export default function AdminHome() {
  const navigate = useNavigate();
  const { data: forms, isPending, error } = useAllApplicationForms();
  const { user, token } = useAuth();

  const {
    mutate: uploadForm,
    isPending: isUploadingForm,
    error: formUploadError,
    data: formUploadData,
  } = useUploadApplicationForm();
  const {
    mutate: uploadRubrics,
    isPending: isUploadingRubrics,
    error: rubricUploadError,
    data: rubricUploadData,
  } = useUploadRubrics();
  const {
    mutate: uploadInterviewRubrics,
    isPending: isUploadingInterviewRubrics,
    error: interviewRubricUploadError,
    data: interviewRubricUploadData,
  } = useUploadInterviewRubrics();

  const handleUploadForm = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to upload the Fall 2025 application form?\n\n" +
        `This will create a new form with ID '${h4iApplicationForm.id}' in Firestore with all the new interview questions and scoring weights.`,
    );

    if (!confirmed || !token) return;

    const sectionIdSet = new Set<string>();
    const questionIdSet = new Set<string>();
    let duplicates = false;

    h4iApplicationForm.sections.forEach((s) => {
      if (sectionIdSet.has(s.sectionId)) {
        throwErrorToast("Duplicate section ID: " + s.sectionId);
        duplicates = true;
        return;
      } else {
        sectionIdSet.add(s.sectionId);
      }

      s.questions.forEach((q) => {
        if (questionIdSet.has(q.questionId)) {
          throwErrorToast("Duplicate question ID: " + q.questionId);
          duplicates = true;
          return;
        } else {
          questionIdSet.add(q.questionId);
        }
      });
    });

    if (duplicates) return;

    uploadForm({ form: h4iApplicationForm, token: (await token()) ?? "" });
  };

  const handleUploadRubrics = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to upload the application rubrics?",
    );

    if (!confirmed || !token) return;

    uploadRubrics({
      rubrics: APPLICATION_RUBRICS,
      token: (await token()) ?? "",
    });
  };

  const handleUploadInterviewRubrics = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to upload the application interview rubrics?",
    );

    if (!confirmed || !token) return;

    uploadInterviewRubrics({
      interviewRubrics: APPLICATION_INTERVIEW_RUBRICS,
      token: (await token()) ?? "",
    });
  };

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
        <h1 className="text-xl">Go to Review Dashboards</h1>
        <p className="text-muted-foreground">
          To access dashboards, you need to select which form you want to view
          application and review data for.
        </p>

        <ul className="flex flex-col gap-2 mt-4">
          {forms.map((form) => {
            return (
              <Link
                className="border border-gray-300 p-2 rounded-md flex flex-row gap-2 items-center"
                to={`/admin/${route}/dashboard/${form.id}/${table}`}
                key={form.id}
              >
                <span
                  className={`${!form.isActive ? "bg-muted" : "bg-lightblue"} px-2 py-1 text-sm rounded-full`}
                >
                  {form.isActive ? "Active" : "Inactive"}
                </span>
                <span>
                  Semester: {form.semester} (ID: {form.id})
                </span>
              </Link>
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
            <h1 className="text-xl">Or Manage Forms </h1>
            <p className="text-muted-foreground">
              Validate your form before uploading to Firestore or build
              application forms with a live editor.
            </p>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => navigate("/admin/dor/forms")}>
                Form Validator
              </Button>
              <Button onClick={() => navigate("/admin/dor/form-builder")}>
                Open Form Builder
              </Button>
            </div>
          </div>
          {/* TEMPORARY SECTION - Remove after form upload is complete */}
          <div className="max-w-5xl w-full p-4 bg-white rounded-md">
            <h1 className="text-xl">Upload H4I Application Form</h1>
            <p className="text-muted-foreground">
              Upload the new Hack4Impact application form to Firestore.
            </p>
            <Button
              className="mt-4"
              onClick={handleUploadForm}
              disabled={isUploadingForm}
            >
              {isUploadingForm ? "Uploading..." : "Upload Form"}
            </Button>
            {formUploadData && (
              <p className="mt-2 text-sm text-green-600">
                Success! Form uploaded with ID: {formUploadData.formId}
              </p>
            )}
            {formUploadError && (
              <p className="mt-2 text-sm text-red-600">
                {formUploadError.message}
              </p>
            )}
          </div>
          <div className="max-w-5xl w-full p-4 bg-white rounded-md">
            <h1 className="text-xl">Upload Application Rubrics</h1>
            <p className="text-muted-foreground">
              Upload the application rubrics to Firestore.
            </p>
            <div className="flex gap-2">
              <Button
                className="mt-4"
                onClick={handleUploadRubrics}
                disabled={isUploadingRubrics}
              >
                {isUploadingRubrics ? "Uploading..." : "Upload Review Rubrics"}
              </Button>
              <Button
                className="mt-4"
                onClick={handleUploadInterviewRubrics}
                disabled={isUploadingInterviewRubrics}
              >
                {isUploadingInterviewRubrics
                  ? "Uploading..."
                  : "Upload Interview Rubrics"}
              </Button>
            </div>
            {rubricUploadData && (
              <p className="mt-2 text-sm text-green-600">
                Success! Uploaded {rubricUploadData.data.count} rubrics.
              </p>
            )}
            {rubricUploadError && (
              <p className="mt-2 text-sm text-red-600">
                {rubricUploadError.message}
              </p>
            )}
            {interviewRubricUploadData && (
              <p className="mt-2 text-sm text-green-600">
                Success! Uploaded {interviewRubricUploadData.data.count}{" "}
                rubrics.
              </p>
            )}
            {interviewRubricUploadError && (
              <p className="mt-2 text-sm text-red-600">
                {interviewRubricUploadError.message}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
