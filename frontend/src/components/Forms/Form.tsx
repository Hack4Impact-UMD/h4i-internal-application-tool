import React, { useState } from "react";
import Checkbox from "../FormComponents/Checkbox";
//import Email from "./FormComponents/Email";
// import FileUpload from "./FormComponents/FileUpload";
import Radiobox from "../FormComponents/Radiobox";
import TextAnswer from "../FormComponents/TextAnswer";

// Sample Interface for testing components
interface FormData {
  file: File;
  email: string;
  fullName: string;
  schoolYear: string;
  classes: string[];
}

const Form = () => {
  // Sample questions
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    schoolYear: "",
    classes: [],
    file: null as File | null,
  });

  // Handling changes for the text responses and radio box multiple choice.
  const handleInputChange = (field: keyof FormData, value: string | File) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Checkboxes require more logic for multiple options selected as well as for
  // handling changes in the "other" option when necessary.
  const handleCheckBoxChange = (
    field: keyof FormData,
    value: string,
    otherUnchecked?: boolean
  ) => {
    setFormData((prevData) => {
      const currentSelections = prevData[field] as string[];
      let newSelections;

      // If otherUnchecked is true, we need to delete from the current Array
      if (otherUnchecked) {
        newSelections = currentSelections.filter(
          (item) => item[item.length - 1] !== "$"
        );
      } else {
        // Only add to the selections if the value isn't already present.

        // If value is from the typed checkbox we need to specially replace it
        // or else it will add more entries into the array.
        const index = currentSelections.findIndex((str) => str.includes("$"));

        if (index >= 0 && value[value.length - 1] == "$") {
          currentSelections[index] = value;
          newSelections = currentSelections;
        } else {
          // Insert or remove as normal
          newSelections = currentSelections.includes(value)
            ? currentSelections.filter((item) => item !== value)
            : [...currentSelections, value];
        }
      }

      return {
        ...prevData,
        [field]: newSelections,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Temporary validation for files, will need logic for sending to DB.
    // if (!formData.file || formData.file.size === 0) {
    //   console.log("Enter file");
    //   return;
    // }

    // Simulate a file upload
    console.log("Simulate File upload");
    console.log("Form submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* <Email
        value={formData.email}
        onChange={(value) => handleInputChange("email", value)}
      /> */}
      <TextAnswer
        heading="Full Name"
        subHeading="Tests"
        value={formData.fullName}
        onChange={(value) => handleInputChange("fullName", value)}
        placeholder="Short answer text"
      />
      <Radiobox
        heading="Year in School"
        options={["Fresh", "Soph"]}
        value={formData.schoolYear}
        onChange={(value) => handleInputChange("schoolYear", value)}
        choiceName="school-year"
        other
        required
      />
      <Checkbox
        heading="Classes"
        options={["CMSC131", "CMSC132"]}
        onChange={(value, otherUnchecked) =>
          handleCheckBoxChange("classes", value, otherUnchecked)
        }
        choiceName="classes"
        other
      />
      {/* <FileUpload
        heading="Resume"
        onChange={(file) => handleInputChange("file", file)}
      /> */}
      <button type="submit">Submit</button>
    </form>
  );
};

export default Form;
