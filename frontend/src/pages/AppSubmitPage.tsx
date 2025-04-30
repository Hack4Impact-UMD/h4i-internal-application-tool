import { useNavigate, useParams } from "react-router-dom"
import { useApplicationResponseAndForm } from "../hooks/useApplicationResponses"
import Loading from "../components/Loading"
import Section from "../components/form/Section"
import Button from "../components/Button"
import { useAuth } from "../hooks/useAuth"
import { submitApplicationResponse } from "../services/applicationResponsesService"
import { useMutation } from "@tanstack/react-query"
import { ApplicationResponse, ApplicationStatus } from "../types/types"

export default function AppSubmitPage() {
  const { formId } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, error } = useApplicationResponseAndForm(formId)
  const { token } = useAuth()

  const submitMutation = useMutation({
    mutationFn: (response: ApplicationResponse) => submitApplicationResponse(response, token!),
  })

  if (isLoading) return <Loading />
  if (error) return <p>Something went wrong: {error.message}</p>

  const { form, response } = data!

  async function handleSubmit() {
    const resp = await submitMutation.mutateAsync(response)
    console.log("Submit Response:", resp)
    if (resp.status == ApplicationStatus.Submitted) {
      navigate("/apply/success")
    }
  }

  return <div className="w-full flex flex-col items-center p-4 pt-8">
    <div className="max-w-3xl w-full flex flex-col gap-2">
      <div>
        <h1 className="text-3xl font-bold">Almost there!</h1>
        <p>Review your application before submitting.</p>
      </div>
      {form.sections.filter(s => {
        if (s.forRoles) {
          if (s.forRoles) {
            return (s.forRoles.filter(r => response.rolesApplied.includes(r)).length > 0)
          } else {
            return true;
          }
        } else {
          return true;
        }
      }).map(s =>
        <div className="shadow border border-gray-400 rounded-md p-4">
          <Section
            key={s.sectionId}
            disabled={true}
            section={s}
            responses={response.sectionResponses.find(r => r.sectionId == s.sectionId)!.questions}
            onChangeResponse={() => { }} />
        </div>
      )}
      {submitMutation.error && <p>Failed to submit: {submitMutation.error.message}</p>}
      <Button enabled={!submitMutation.isPending} className="rounded-full" onClick={() => handleSubmit()}> Submit </Button>
    </div>
  </div>
}
