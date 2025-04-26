import { Outlet, useParams } from "react-router-dom"
import { FormContext } from "../../contexts/formContext"
import { useApplicationResponseAndForm } from "../../hooks/useApplicationResponses"
import Loading from "../Loading"
import { useEffect, useState } from "react"
import { ApplicantRole, ApplicationResponse } from "../../types/types"
import { useMutation } from "@tanstack/react-query"
import { saveApplicationResponse } from "../../services/applicationResponsesService"

export default function FormProvider() {
  const { formId } = useParams()
  const { data, isLoading, error } = useApplicationResponseAndForm(formId)
  const saveMutation = useMutation({
    mutationFn: async (r: ApplicationResponse) => {
      //TODO: hook this up 
      return await saveApplicationResponse(r)
    }
  })
  const [response, setResponse] = useState<ApplicationResponse | undefined>()
  const [selectedRoles, setSelectedRoles] = useState<ApplicantRole[]>()

  useEffect(() => {
    if (data != undefined) {
      if (response == undefined) {
        // first load, use existing response data on firebase
        setResponse(data.response)
      }
    }
  }, [data, response])

  if (isLoading) return <Loading />
  if (error) return <p>Something went wrong: {error.message}</p>
  if (data == undefined) return <p>No data</p>

  const { form, response: dbResponse } = data!;


  function updateQuestionResponse(sectionId: string, questionId: string, resp: string | string[]) {
    if (response) {
      setResponse({
        ...response,
        sectionResponses: (response.sectionResponses.map(s => {
          if (s.sectionId == sectionId) {
            return {
              ...s,
              questions: s.questions.map(q => {
                if (q.questionId == questionId) {
                  return {
                    ...q,
                    response: resp
                  }
                } else {
                  return q
                }
              })
            }
          } else {
            return s
          }
        }) ?? response.sectionResponses)
      })
    }
  }

  async function save() {
    await saveMutation.mutateAsync(dbResponse)
  }


  return <FormContext.Provider
    value={{
      form: form,
      response: response,
      updateQuestionResponse: updateQuestionResponse,
      save: save
    }}
  >
    <Outlet />
  </FormContext.Provider>
}
