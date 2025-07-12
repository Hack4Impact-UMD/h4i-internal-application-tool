import { Link, useNavigate, useParams } from "react-router-dom";
import { useMyApplicationResponseAndForm } from "../hooks/useApplicationResponses";
import Loading from "../components/Loading";
import Section from "../components/form/Section";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";
import {
  ApplicationSubmitResponse,
  submitApplicationResponse,
} from "../services/applicationResponsesService";
import { useMutation } from "@tanstack/react-query";
import { ApplicationResponse, ValidationError } from "../types/types";
import { AxiosError } from "axios";
import { useState } from "react";
import { throwErrorToast } from "../components/error/ErrorToast";

export default function AppSubmitPage() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const { data, isPending, error } = useMyApplicationResponseAndForm(formId);
  const { token } = useAuth();
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    [],
  );

  const submitMutation = useMutation({
    mutationFn: (response: ApplicationResponse) =>
      submitApplicationResponse(response, token!),
  });

  if (isPending) return <Loading />;
  if (error) return <p>Something went wrong: {error.message}</p>;

  const { form, response } = data;

  async function handleSubmit() {
    try {
      const resp = await submitMutation.mutateAsync(response);
      console.log("Submit Response:", resp);
      if (resp.status == "success") {
        navigate("/apply/success");
      }
    } catch (err) {
      console.error("Submit error");
      throwErrorToast("Oops, looks like you've missed some things!");
      if (err instanceof AxiosError) {
        const resp = err.response?.data as ApplicationSubmitResponse;
        if (resp.status == "error")
          setValidationErrors(resp.validationErrors ?? []);
      }
    }
  }

  return (
    <div className="w-full flex flex-col items-center p-4 pt-8">
      <div className="max-w-3xl w-full flex flex-col gap-2">
        <div>
          <h1 className="text-3xl font-bold">Almost there!</h1>
          <p>Review your application before submitting.</p>
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
              <Link
                className="text-blue "
                to={`/apply/f/${formId}/${s.sectionId}`}
              >
                <div className="flex gap-1 items-center text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                  <p className="underline">Edit this section</p>
                </div>
              </Link>
              <Section
                key={s.sectionId}
                validationErrors={validationErrors}
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
          disabled={submitMutation.isPending}
          className="rounded-full"
          onClick={() => handleSubmit()}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
