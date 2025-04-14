import { useAssignedReviewApplicants } from "../../hooks/useApplicants";
import ChoiceGroup from "../form/ChoiceGroup";
import LongFormInput from "../form/LongFormInput";
import MultiSelectGroup from "../form/MultiSelectGroup";
import OneLineInput from "../form/OneLineInput";

export default function AdminPlaceholderPage() {
  const { data: applicants, isLoading, error } = useAssignedReviewApplicants()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return <div className="p-4">
    <ChoiceGroup
      question="Sample question"
      options={["foo", "bar", "test"]}
      onOptionSelect={s => console.log(s)}
      label="Label"
      isRequired={true}
    />

    <LongFormInput question={"Sample question"} onChange={s => console.log(s)} value="Enter some text..." />

    <MultiSelectGroup
      question="Sample question"
      options={["foo", "bar", "baz", "testing a longer option", "testing an even longer longer option"]}
      onOptionSelect={s => console.log(s)}
      label="Label"
      isRequired={true}
    ></MultiSelectGroup>

    <OneLineInput question="Sample question" value="some text" onChange={s => console.log(s)}></OneLineInput>

    <h1>Assigned Applicants: </h1>
    <ul>
      {applicants?.map(applicant => <li key={applicant.id}>{applicant.firstName} (ID: {applicant.id})</li>)}
    </ul>
  </div >
}
