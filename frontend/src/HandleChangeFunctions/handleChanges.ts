// THE FUNCTIONS HERE ARE NOT NEEDED FOR NOW.

// Use to be in each Form, able to remove
// const handleFieldChange = (field: keyof BootCampData, value: string) => {
//   setBootCampData((prevData) => {
//     const updatedData = { ...prevData, [field]: value };
//     onFormDataChange(updatedData);
//     return updatedData;
//   });
// };

// Generalized function to handle input changes.
// export const handleFieldChange = <T extends object>(
//   setFormData: React.Dispatch<React.SetStateAction<T>>,
//   onFormDataChange: (data: T) => void,
//   field: keyof T,
//   value: T[keyof T]
// ) => {
//   setFormData((prevData) => {
//     const updatedData = { ...prevData, [field]: value };
//     // Sends the updated form object (i.e. bootcamp or PM) to the parent component
//     onFormDataChange(updatedData);
//     return updatedData;
//   });
// };

// Checkboxes require more logic for multiple options selected as well as for
// handling changes in the "other" option when necessary.
// export const handleCheckBoxChange = <T extends object>(
//   setFormData: React.Dispatch<React.SetStateAction<T>>,
//   onFormDataChange: (data: T) => void,
//   field: keyof T,
//   value: string,
//   otherUnchecked?: boolean
// ) => {
//   setFormData((prevData) => {
//     const currentSelections = prevData[field] as string[];
//     let newSelections;

//     // If otherUnchecked is true, we need to delete from the current Array
//     if (otherUnchecked) {
//       newSelections = currentSelections.filter(
//         (item) => item[item.length - 1] !== "$"
//       );
//     } else {
//       // Only add to the selections if the value isn't already present.

//       // If value is from the typed checkbox we need to specially replace it
//       // or else it will add more entries into the array.
//       const index = currentSelections.findIndex((str) => str.includes("$"));

//       if (index >= 0 && value[value.length - 1] == "$") {
//         currentSelections[index] = value;
//         newSelections = currentSelections;
//       } else {
//         // Insert or remove as normal
//         newSelections = currentSelections.includes(value)
//           ? currentSelections.filter((item) => item !== value)
//           : [...currentSelections, value];
//       }
//     }

//     const updatedData = {
//       ...prevData,
//       [field]: newSelections,
//     };

//     // Call onFormDataChange with the updated data
//     onFormDataChange(updatedData);
//     return updatedData;
//   });
// };
