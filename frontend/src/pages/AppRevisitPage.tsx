import { useParams, useNavigate } from "react-router-dom";
import { useMyApplicationResponseAndForm } from "../hooks/useApplicationResponses";
import Loading from "../components/Loading";
import Section from "../components/form/Section";
import { Button } from "../components/ui/button";
import { ApplicationStatus } from "@/types/types";
import ErrorPage from "./ErrorPage";

export default function AppRevisitPage() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const { data, isPending, error } = useMyApplicationResponseAndForm(formId);

  if (isPending) return <Loading />;
  if (error) return <p>Something went wrong: {error.message}</p>;

  const { form, response } = data;

  if (response.status == ApplicationStatus.InProgress) {
    return (
      <ErrorPage 
        errorCode={403}
        errorDescription="You are trying to revisit an application that is still in-progress."
      />
  )};

  return (
    <div className="w-full flex flex-col items-center p-4 pt-8">
      <div className="max-w-3xl w-full flex flex-col gap-2">
        <div>
          <h1 className="text-3xl font-bold">Your {form.semester} Application</h1>
          <p>Application responses are final once submitted.</p>
        </div>
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
              className="shadow border border-gray-400 rounded-md p-4"
              key={s.sectionId}
            >
              <Section
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
        <Button
          className="rounded-full"
          onClick={() => navigate("/apply/status")}
        >
          Back to Application Status
        </Button>
      </div>
    </div>
  );
}
