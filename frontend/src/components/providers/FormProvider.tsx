import { Outlet, useParams } from "react-router-dom"
import { FormContext } from "../../contexts/formContext"
import { useApplicationResponseAndForm } from "../../hooks/useApplicationResponses"
import Loading from "../Loading"
import { useEffect, useState } from "react"
import { ApplicationResponse } from "../../types/types"
import { useMutation } from "@tanstack/react-query"

export default function FormProvider() {
  const { formId } = useParams()
  const { data, isLoading, error } = useApplicationResponseAndForm(formId)
  const saveMutation = useMutation({
    mutationFn: async (reponseId: string) => {
      //TODO: hook this up 
      console.log("saving...")
    }
  })
  const [response, setResponse] = useState<ApplicationResponse | undefined>()

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
      console.log("Update:", sectionId, questionId, resp)
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
    await saveMutation.mutateAsync(dbResponse.id)
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
