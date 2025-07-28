import LongFormInput from "@/components/form/LongFormInput";
import { Button } from "@/components/ui/button";
import {
  ApplicationFormData,
  ApplicationFormSchema,
} from "@/utils/form-schema";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

enum ValidationStatus {
  PENDING = "Pending",
  SUCCESS = "Success",
  FAILURE = "Failure",
}

function statusColor(status: ValidationStatus) {
  if (status == ValidationStatus.PENDING) return "white";
  else if (status == ValidationStatus.SUCCESS) return "black";
  else if (status == ValidationStatus.FAILURE) return "#FBDED9";
}

function statusDarkColor(status: ValidationStatus) {
  if (status == ValidationStatus.PENDING) return "#17476B";
  else if (status == ValidationStatus.SUCCESS) return "#DCFCE7";
  else if (status == ValidationStatus.FAILURE) return "#9F0712";
}

function StatusPill({
  status,
  className = "",
}: {
  status: ValidationStatus;
  className?: string;
}) {
  return (
    <p
      style={{
        backgroundColor: statusDarkColor(status),
        color: statusColor(status),
      }}
      className={twMerge(
        `rounded-full px-2 flex items-center max-w-fit justify-center`,
        className,
      )}
    >
      {status}
    </p>
  );
}

export function FormValidationPage() {
  const [text, setText] = useState("");
  const [jsonParseStatus, setJsonParseStatus] = useState(
    ValidationStatus.PENDING,
  );
  const [jsonParseStatusMessage, setJsonParseStatusMessage] = useState("None!");
  const [formParseStatus, setFormParseStatus] = useState(
    ValidationStatus.PENDING,
  );
  const [formParseStatusMessage, setFormParseStatusMessage] = useState("None!");
  const [parsedFormContent, setParsedFormContent] = useState("None!");

  function validate(text: string) {
    // attempt JSON parse first
    let parsedJson: object;
    try {
      parsedJson = JSON.parse(text);
      setJsonParseStatus(ValidationStatus.SUCCESS);
    } catch (e) {
      if (e instanceof Error) {
        setJsonParseStatusMessage(e.message);
      }
      setJsonParseStatus(ValidationStatus.FAILURE);
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
        setFormParseStatusMessage(
          "Could not parse dueDate field into TypeScript Date object",
        );
        return;
      }
    } else {
      setFormParseStatusMessage("No dueDate field present in parsed JSON");
      return;
    }

    // attempt Zod parse with parsedJson
    let parsedForm: ApplicationFormData | undefined;
    try {
      parsedForm = ApplicationFormSchema.parse(parsedJson);
      console.log("Parsed data: " + parsedForm);
      setFormParseStatus(ValidationStatus.SUCCESS);
      setParsedFormContent(JSON.stringify(parsedForm, null, 2));
    } catch (e) {
      if (e instanceof Error) {
        setFormParseStatusMessage(e.message);
      }
      setFormParseStatus(ValidationStatus.FAILURE);
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

        <LongFormInput
          question={"Enter your form here as JSON:"}
          value={text}
          onChange={(newText) => {
            setText(newText);
            setJsonParseStatus(ValidationStatus.PENDING);
            setJsonParseStatusMessage("None!");
            setFormParseStatus(ValidationStatus.PENDING);
            setFormParseStatusMessage("None!");
            setParsedFormContent("None!");
          }}
          isRequired={true}
          className="mb-5"
        />

        <Button className="mb-5" onClick={() => validate(text)}>
          Validate Form
        </Button>

        <div className="flex mb-5">
          <p className="mr-2">Parsed as JSON: </p>
          <StatusPill status={jsonParseStatus} />
        </div>

        <p className="">JSON Parse Error: </p>
        <pre className="mb-5 !font-mono bg-gray-100 px-2">
          {jsonParseStatusMessage}
        </pre>

        <div className="flex mb-5">
          <p className="mr-2">Parsed as ApplicationForm: </p>
          <StatusPill status={formParseStatus} />
        </div>

        <p className="">Form Parse Error: </p>
        <pre className="mb-5 !font-mono bg-gray-100 px-2">
          {formParseStatusMessage}
        </pre>

        <p className="">Parsed Form Content: </p>
        <pre className="mb-5 !font-mono bg-gray-100 px-2">
          {parsedFormContent}
        </pre>
      </div>
    </div>
  );
}
