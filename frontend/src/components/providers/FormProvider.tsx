import { Navigate, Outlet, useParams } from "react-router-dom"
import { FormContext } from "../../contexts/formContext"
import { useApplicationResponseAndForm } from "../../hooks/useApplicationResponses"
import Loading from "../Loading"
import { useEffect, useMemo, useState } from "react"
import { ApplicantRole, ApplicationResponse, ApplicationStatus, QuestionResponse, QuestionType } from "../../types/types"
import { useMutation } from "@tanstack/react-query"
import { saveApplicationResponse } from "../../services/applicationResponsesService"
import { useAuth } from "../../hooks/useAuth"
import { Timestamp } from "firebase/firestore"
import { queryClient } from "../../config/query"
import { throwErrorToast } from "../error/ErrorToast"
import { Button } from "../ui/button"

export default function FormProvider() {
  const { formId, sectionId } = useParams()
  const { token, user } = useAuth()
  const { data, isLoading, error } = useApplicationResponseAndForm(formId)
  const saveMutation = useMutation({
    mutationFn: async (r: ApplicationResponse) => {
      if (token)
        return await saveApplicationResponse(r, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["responses", user?.id, formId]
      })
    }
  })
  const [response, setResponse] = useState<ApplicationResponse | undefined>()
  const [selectedRoles, setSelectedRoles] = useState<ApplicantRole[]>([])

  useEffect(() => {
    if (response) {
      setResponse({
        ...response,
        rolesApplied: selectedRoles
      })
    }
  }, [selectedRoles])

  useEffect(() => {
    if (data) {
      let rsid = undefined;
      for (const section of data.form.sections) {
        const rs = section.questions.find(q => q.questionType == QuestionType.RoleSelect)
        if (rs != undefined) {
          rsid = rs.questionId
        }
      }

      for (const section of data.response.sectionResponses) {
        const roleResponse = section.questions.find(q => q.questionId == rsid) as QuestionResponse | undefined
        if (roleResponse) {
          setSelectedRoles(roleResponse.response as ApplicantRole[])
        }
      }
    }
  }, [data])


  useEffect(() => {
    if (data != undefined) {
      console.log(`local response time: ${response?.dateSubmitted.toMillis()}, server time ${data.response.dateSubmitted.toMillis()}`)

      if (JSON.stringify(response?.sectionResponses) !== JSON.stringify(data.response.sectionResponses)) {
        // first load, use existing response data on firebase
        console.log("here")
        setResponse(data.response)
      }
    }
  }, [data])

  const SAVE_DEBOUNCE_SEC = 2;

  useEffect(() => {
    const ref = setTimeout(() => {
      save()
    }, SAVE_DEBOUNCE_SEC * 1000)

    // if (response) {
    //   setResponse({
    //     ...response,
    //     dateSubmitted: Timestamp.now()
    //   })
    // }

    return () => {
      clearTimeout(ref)
    }
  }, [response])

  const sections = useMemo(() => {
    if (!data) return []
    return data.form.sections.filter((s) => {
      if (s.forRoles) {
        return (s.forRoles.filter(r => selectedRoles.includes(r)).length > 0)
      } else {
        return true;
      }
    }).map(s => s.sectionId)
  }, [selectedRoles, data])


  if (isLoading) return <Loading />
  if (error) return <p>Something went wrong: {error.message}</p>
  if (data == undefined) return <Loading />
  const { form, response: dbResponse } = data!;

  //NOTE: not sure if it's a good idea to put this here, this component might need to be reused
  //in a case where in-progress apps are allowed. But for now, this is the best way to prevent
  //editing apps that are complete!
  if (dbResponse.status != ApplicationStatus.InProgress) return <Navigate to="/apply/status" />


  function updateQuestionResponse(sectionId: string, questionId: string, resp: string | string[]) {
    if (response) {
      setResponse({
        ...response,
        dateSubmitted: Timestamp.now(),
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
    try {
      if (response)
        await saveMutation.mutateAsync(response)
    } catch (err) {
      console.error("Save failed!")
      console.error(err)
      throwErrorToast("Failed to save your application!")
    }
  }


  return <FormContext.Provider
    value={{
      form: form,
      response: response,
      updateQuestionResponse: updateQuestionResponse,
      save: save,
      selectedRoles: selectedRoles,
      setSelectedRoles: setSelectedRoles,
      availableSections: sections,
      currentSection: sectionId,
      nextSection: () => {
        const idx = sections.findIndex(s => s == sectionId);
        if (idx >= 0 && idx + 1 < sections.length) {
          return sections[idx + 1]
        } else {
          return sectionId ?? ""
        }
      },
      previousSection: () => {
        const idx = sections.findIndex(s => s == sectionId);
        if (idx >= 1) {
          return sections[idx - 1]
        } else {
          return sectionId ?? ""
        }
      }
    }}
  >
    <div className="w-full flex flex-row p-2 items-center justify-center">
      <div className="w-full max-w-3xl flex flex-row items-center">
        <div className="grow">
          <div className={`w-fit ${saveMutation.isError ? 'bg-red-100' : 'bg-lightblue'} rounded-full px-2 text-blue`}>
            {saveMutation.isPending ? <p className="pulse font-bold">Saving...</p>
              : (saveMutation.submittedAt != 0 && !saveMutation.isError) ? <p>Last save: {new Date(saveMutation.submittedAt).toLocaleTimeString()}</p>
                : (saveMutation.isError) ? <p className="text-red-500">Failed to save your application (Last save: {new Date(saveMutation.submittedAt).toLocaleTimeString()})</p>
                  : <p>Form not yet saved!</p>
            }
          </div>
        </div>
        <Button disabled={saveMutation.isPending} className="cursor-pointer p-2 bg-blue disabled:bg-blue/50 disabled:cursor-wait rounded text-white" onClick={save}>Save application</Button>
      </div>
    </div>
    <Outlet />
  </FormContext.Provider>
}
