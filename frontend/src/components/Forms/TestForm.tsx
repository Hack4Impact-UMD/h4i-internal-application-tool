import React, { useState } from "react";
import { checkboxes } from "../../Options/checkboxes"; // Add or remove checkboxes from here as necessary.
import {
  BootCampData,
  DemographicData,
  EngineerData,
  GeneralInfoData,
  ProductManagerData,
  SourcingData,
  TechLeadData,
  UXData,
} from "../../interfaces/FormData/formDataInterfaces";

import BootCampForm from "./BootCampForm";
import ProductManagerForm from "./ProductManagerForm";
import EngineerForm from "./EngineerForm";
import TechLeadForm from "./TechLeadForm";
import UXForm from "./UXForm";
import SourcingForm from "./SourcingForm";
import GeneralInfoForm from "./GeneralInfoForm";
import DemographicsForm from "./DemographicForm";
import DemographicForm from "./DemographicForm";


// This interface maps each form section to its specific datatype which allows
// TS to infer the correct type of data based on formSection.
interface FormDataMap {
  bootCampData: BootCampData;
  productManagerData: ProductManagerData;
  engineerData: EngineerData;
  techLeadData: TechLeadData;
  UXData: UXData;
  sourcingData: SourcingData;
  generalInfoData: GeneralInfoData;
  demographicData: DemographicData;
  // Add more form types (engineer, sourcing, etc.) when nec,
  // and update "formDataInterfaces.ts" accordingly
}

type FormSection = keyof FormDataMap;

const TestForm = () => {
  const [formData, setFormData] = useState({
    bootCampData: {} as BootCampData,
    productManagerData: {} as ProductManagerData,
    engineerData: {} as EngineerData,
    techLeadData: {} as TechLeadData,
    UXData: {} as UXData,
    sourcingData: {} as SourcingData,
    generalInfoData: {} as GeneralInfoData,
    demographicData: {} as DemographicData
  });

  const handleFormDataChange = <Section extends FormSection>(
    formType: Section, // The type of form (i.e. Bootcamp, engineer, PM, etc.)
    field: keyof FormDataMap[Section], // The specific question from the form that is to be updated
    value: FormDataMap[Section][keyof FormDataMap[Section]], // New value of the of the form for the specified field.
    otherUnchecked?: boolean
  ) => {
    // Updates one of the forms in the formData object
    setFormData((prevData) => {
      // Get the desired form we want to update.
      const currentForm = prevData[formType];
      let updatedForm;

      // This logic in the if block is to handle changes for checkboxes
      // throughout the form.
      if (checkboxes.includes(field as string)) {
        // If the form's checkboxes array for this field is uninitialized, give it an empty array.
        const currentSelections = (currentForm[field] as string[]) || [];
        const newValue = value as string;
        let newSelections;

        // If otherUnchecked is true, we need to delete from the current Array
        // This occurs when a user clicks to uncheck the "Other" option.
        if (otherUnchecked) {
          newSelections = currentSelections.filter(
            (item) => item[item.length - 1] !== "$"
          );
        } else {
          // Only add to the selections if the value isn't already present.

          // If the new value is from the "Other" checkbox we need to specially replace it
          // or else it will add more entries into the array. The logic in the if
          // block below handles that. There should only ever be 1 entry in a
          // checkbox's array of selections with the "$" character.
          const index = currentSelections.findIndex((str) => str.includes("$"));

          if (index >= 0 && newValue[newValue.length - 1] == "$") {
            currentSelections[index] = newValue;
            newSelections = currentSelections;
          } else {
            // Insert or remove as normal - if the current selections already has
            // newValue in it, that means we remove it, otherwise add newValue.
            newSelections = currentSelections.includes(newValue)
              ? currentSelections.filter((item) => item !== value)
              : [...currentSelections, value];
          }
        }

        updatedForm = {
          ...currentForm,
          [field]: newSelections,
        };
      } else {
        // Fill in previous for data and update the field we want.
        updatedForm = { ...currentForm, [field]: value };
      }

      return {
        ...prevData,
        [formType]: updatedForm,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 
      <BootCampForm
        onFormDataChange={(field, value, otherUnchecked) =>
          handleFormDataChange("bootCampData", field, value)
        }
        sectionFormData={formData.bootCampData}
      /> */}

      {/* If form contains a checkbox component, must pass the otherUnchecked Param
      <ProductManagerForm
        onFormDataChange={(field, value, otherUnchecked) =>
          handleFormDataChange("productManagerData", field, value, otherUnchecked)
        }
        sectionFormData={formData.productManagerData}
      /> */}

      {/* 
      <EngineerForm
        onFormDataChange={(field, value, otherUnchecked) =>
          handleFormDataChange("engineerData", field, value)
        }
        sectionFormData={formData.engineerData}
      /> */}

      {/* 
      <TechLeadForm
        onFormDataChange={(field, value, otherUnchecked) =>
          handleFormDataChange("techLeadData", field, value)
        }
        sectionFormData={formData.techLeadData}
      />*/}

      {/* 
      <UXForm
        onFormDataChange={(field, value, otherUnchecked) =>
          handleFormDataChange("UXData", field, value)
        }
        sectionFormData={formData.UXData}
      />*/}

      {/* 
      <SourcingForm
        onFormDataChange={(field, value, otherUnchecked) =>
          handleFormDataChange("sourcingData", field, value)
        }
        sectionFormData={formData.sourcingData}
      />*/}

      {/* 
      <GeneralInfoForm
        onFormDataChange={(field, value, otherUnchecked) =>
          handleFormDataChange("generalInfoData", field, value)
        }
        sectionFormData={formData.generalInfoData}
      />*/}

      {/* */}
      <DemographicForm
        onFormDataChange={(field, value, otherUnchecked) =>
          handleFormDataChange("demographicData", field, value)
        }
        sectionFormData={formData.demographicData}
      />

      <button type="submit">Submit</button>
    </form>
  );
};

export default TestForm;
