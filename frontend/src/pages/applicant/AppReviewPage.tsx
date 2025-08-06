import { useParams } from "react-router-dom";
import Section from "@/components/form/Section";
import ReviewCard from "@/components/reviewer/ReviewCard";
import { useApplicationForm } from "@/hooks/useApplicationForm";
import Loading from "@/components/Loading";
import { useApplicationResponse } from "@/hooks/useApplicationResponses";
import { useReviewData } from "@/hooks/useReviewData";
import Spinner from "@/components/Spinner";
import { useApplicant } from "@/hooks/useApplicants";
import ApplicantRolePill from "@/components/role-pill/RolePill";
import { ApplicantRole, ApplicationForm } from "@/types/formBuilderTypes";
import { displayApplicantRoleName } from "@/utils/display";
import { Button } from "@/components/ui/button";
import { RubricQuestion } from "@/components/reviewer/rubric/RubricQuestion";

type UserHeaderProps = {
  applicantId: string;
  form: ApplicationForm;
  role: ApplicantRole;
};

function UserHeader({ applicantId, form, role }: UserHeaderProps) {
  const { data: applicant, isPending, error } = useApplicant(applicantId);

  if (isPending)
    return (
      <div className="w-full flex flex-row items-center justify-center p-2">
        <Spinner />
      </div>
    );

  if (error)
    return (
      <div className="w-full bg-red-200 rounded p-2">
        <p className="text-destructive font-bold">
          Failed to fetch user: {error.message}
        </p>
      </div>
    );

  return (
    <div className="w-full flex flex-col gap-2">
      <h1 className="text-xl">
        {applicant.firstName} {applicant.lastName}'s {form.semester}{" "}
        {displayApplicantRoleName(role).substring(1)} Application
      </h1>
    </div>
  );
}

const ApplicationPage: React.FC = () => {
  const { formId, responseId, reviewDataId } = useParams<{
    formId: string;
    reviewDataId: string;
    responseId: string;
  }>();

  const {
    data: response,
    isPending: responseLoading,
    error: responseError,
  } = useApplicationResponse(responseId);

  const {
    data: form,
    isPending: formLoading,
    error: formError,
  } = useApplicationForm(formId);

  const {
    data: reviewData,
    isPending: reviewPending,
    error: reviewError,
  } = useReviewData(reviewDataId ?? "");

  if (formLoading || responseLoading || reviewPending) return <Loading />;
  if (formError || !form)
    return <p>Failed to fetch form: {formError.message}</p>;
  if (responseError || !response)
    return <p>Failed to fetch response: {responseError?.message}</p>;
  if (reviewError || !reviewData)
    return <p>Failed to fetch response: {reviewError.message}</p>;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] px-8">
      <div className="flex flex-row w-full py-2 px-4 items-center rounded border border-blue-300 bg-blue-100 text-blue">
        <UserHeader
          applicantId={response.userId}
          form={form}
          role={reviewData.forRole}
        />
        <Button variant="default">Submit Review</Button>
      </div>
      <div className="flex gap-2 justify-center grow overflow-scroll pt-4">
        <div className="w-1/2 flex h-full flex-col gap-2 overflow-scroll">
          {form.sections
            .filter((s) => {
              if (s.forRoles) {
                return (
                  s.forRoles.filter((r) => response.rolesApplied.includes(r))
                    .length > 0
                );
              } else {
                return true;
              }
            })
            .map((s) => (
              <div
                className="shadow border border-gray-200 bg-white rounded-md p-4"
                key={s.sectionId}
              >
                <Section
                  responseId={response.id}
                  key={s.sectionId}
                  disabled={true}
                  section={s}
                  responses={
                    response.sectionResponses.find(
                      (r) => r.sectionId == s.sectionId,
                    )!.questions
                  }
                  onChangeResponse={() => {}}
                />
              </div>
            ))}
        </div>
        <div className="bg-white p-4 w-1/2 h-full overflow-y-scroll rounded-md border border-gray-200">
          {Array.from({ length: 20 }, () => (
            <RubricQuestion
              onChange={(k, v) => console.log(k, v)}
              question={{
                prompt: "Test rubric question",
                scoreKey: "foo",
                description: "*some description text*",
              }}
              value={0}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicationPage;
