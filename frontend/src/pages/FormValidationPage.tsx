import LongFormInput from "@/components/form/LongFormInput";
import { Button } from "@/components/ui/button";
import {
  ApplicationFormData,
  ApplicationFormSchema,
} from "@/utils/form-schema";
import { useState } from "react";

enum ValidationStatus {
  PENDING = "Pending",
  JSON_FAILURE = "Failed while converting to JSON",
  DATE_FAILURE = "Failed while parsing dueDate field",
  FORM_FAILURE = "Failed while converting to ApplicationForm",
  SUCCESS = "Form Parsed Successfully",
}

export function FormValidationPage() {
  const [text, setText] = useState("");
  const [parseStatus, setParseStatus] = useState(ValidationStatus.PENDING);
  const [parseStatusMessage, setParseStatusMessage] = useState("None!");

  function validate(text: string) {
    // attempt JSON parse first
    let parsedJson: object;
    try {
      parsedJson = JSON.parse(text);
    } catch (e) {
      if (e instanceof Error) {
        setParseStatus(ValidationStatus.JSON_FAILURE);
        setParseStatusMessage(e.message);
      }
      return;
    }

    // attempt transform date number/string into date object
    if (
      parsedJson &&
      "dueDate" in parsedJson &&
      (typeof parsedJson.dueDate === "string" ||
        typeof parsedJson.dueDate === "number")
    ) {
      const date = new Date(parsedJson.dueDate);
      if (!isNaN(date.getTime())) {
        parsedJson.dueDate = date;
      } else {
        setParseStatus(ValidationStatus.DATE_FAILURE);
        setParseStatusMessage(
          "Could not parse dueDate field into TypeScript Date object.",
        );
        return;
      }
    } else {
      setParseStatus(ValidationStatus.DATE_FAILURE);
      setParseStatusMessage("Could not find dueDate field in parsed JSON.");
      return;
    }

    // attempt Zod parse with parsedJson
    let parsedForm: ApplicationFormData | undefined;
    try {
      parsedForm = ApplicationFormSchema.parse(parsedJson);
      console.log("Parsed data: " + parsedForm);
      setParseStatus(ValidationStatus.SUCCESS);
      setParseStatusMessage(JSON.stringify(parsedForm, null, 2));
    } catch (e) {
      if (e instanceof Error) {
        setParseStatus(ValidationStatus.FORM_FAILURE);
        setParseStatusMessage(e.message);
      }
    }
  }

  return (
    <div className="p-4 w-full flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <h1 className="font-bold text-xl mb-5 pt-5">
          Application Form Validation
        </h1>

        <p className="mb-5">
          Refer to{" "}
          <a
            className="text-blue"
            href="https://github.com/Hack4Impact-UMD/h4i-internal-application-tool/blob/main/frontend/src/types/formBuilderTypes.ts"
          >
            formBuilderTypes
          </a>{" "}
          or contact Tech Leads for information on form validation issues.
        </p>

        <p className="mb-5">
          The "Validate Form" button will try: converting your input to valid
          JSON, then converting a provided dueDate field to a valid timestamp,
          and finally converting the object to an ApplicationForm.
        </p>

        <LongFormInput
          question={"Enter your form here as JSON:"}
          value={text}
          onChange={(newText) => {
            setText(newText);
            setParseStatus(ValidationStatus.PENDING);
            setParseStatusMessage("None!");
          }}
          isRequired={true}
          className="mb-5"
        />

        <Button className="mb-5" onClick={() => validate(text)}>
          Validate Form
        </Button>

        <div className="flex mb-5">
          <p className="mr-2">Parse Status: </p>
          {parseStatus}
        </div>

        <p className="">
          {parseStatus === ValidationStatus.SUCCESS
            ? "Parsed Content:"
            : "Error Message:"}
        </p>
        <pre className="mb-5 !font-mono bg-gray-100 px-2">
          {parseStatusMessage}
        </pre>
      </div>
    </div>
  );
}
