// This file houses functions that handle changes in form data. The functions are used
// to update the form data in the parent component when the user interacts with the form.

import React, { useState } from "react";
import { checkboxes } from "../Options/checkboxes"; // Add or remove checkboxes from here as necessary.
import { 
  FormDataMap,
  BootCampData,
  ProductManagerData,
  EngineerData,
  TechLeadData,
  UXData,
  SourcingData,
  GeneralInfoData,
  DemographicData,
  RolesData
 } from "../interfaces/FormData/formDataInterfaces";

export const handleChanges = () => {

  const [formData, setFormData] = useState<FormDataMap>({
    bootCampData: {} as BootCampData,
    productManagerData: {} as ProductManagerData,
    engineerData: {} as EngineerData,
    techLeadData: {} as TechLeadData,
    UXData: {} as UXData,
    sourcingData: {} as SourcingData,
    generalInfoData: {} as GeneralInfoData,
    demographicData: {} as DemographicData,
    rolesData: {} as RolesData
  });

  type FormSection = keyof FormDataMap;

  // Generalized function to handle input changes.
  const handleFieldChange = <T extends object>(
    setFormData: React.Dispatch<React.SetStateAction<T>>,
    onFormDataChange: (data: T) => void,
    field: keyof T,
    value: T[keyof T]
  ) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, [field]: value };
      // Sends the updated form object (i.e. bootcamp or PM) to the parent component
      onFormDataChange(updatedData);
      return updatedData;
    });
  };

  // Checkboxes require more logic for multiple options selected as well as for
  // handling changes in the "other" option when necessary.
  const handleCheckBoxChange = <T extends object>(
    setFormData: React.Dispatch<React.SetStateAction<T>>,
    onFormDataChange: (data: T) => void,
    field: keyof T,
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

      const updatedData = {
        ...prevData,
        [field]: newSelections,
      };

      // Call onFormDataChange with the updated data
      onFormDataChange(updatedData);
      return updatedData;
    });
  };

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

  return {
    formData,
    handleFormDataChange
  }
};
