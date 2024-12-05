import React, { useEffect, useState } from "react";

// Interface description
// type: Discerns between radio and check boxes.
// checked: For radio boxes, signals to the none "other" checkboxes that "other" has been selected.
// onChange: Handles changing logic for the checkbox options.
// setIsOtherSelected: For radioboxes, toggle the state for when "other" option is selected.
// required: Optionally set if we requrie users to select at least one option.
// name: Identifier for these choices of options.
interface OtherOptionProps {
  type: string;
  checked?: boolean;
  onChange: (value: string, otherUnchecked?: boolean) => void;
  setIsOtherSelected?: React.Dispatch<React.SetStateAction<boolean>>;
  required?: boolean;
  name: string;
}

const OtherOption: React.FC<OtherOptionProps> = ({
  type,
  checked,
  onChange,
  setIsOtherSelected,
  required,
  name,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!checked) {
      setInputValue(""); // Clear input if unchecked from radio options
    }
  }, [checked]);

  // Toggle checkbox state
  const handleOtherCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(() => {
      // When the other checkbox is unchecked, it means we need to remove what is currently
      // inputted from the "other box" within the parent form data.
      if (!e.target.checked) {
        setInputValue("");
        // Other box responses are denoted with a special character for logic within
        // the Form component.
        onChange(e.target.value + "$", isChecked);
      }
      return e.target.checked;
    });
  };

  const handleOtherRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    if (e.target.checked) {
      onChange(e.target.value);
      setIsOtherSelected?.(true); // Tell the parent that 'Other' is selected
    } else {
      setInputValue(""); // Clear input if radio is unselected (should rarely happen with radios)
    }
  };

  // Handle text input changes
  const handleOtherInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsChecked(() => {
      // Empty other input text means we need to remove other input data from form data.
      if (e.target.value === "") {
        onChange(e.target.value, isChecked);
        // Other box in radio should be unchecked if input is empty
        if (checked !== undefined) {
          setIsOtherSelected?.(false);
        }
      } else {
        // Other box in radio should be checked if input isn't empty
        if (checked !== undefined) {
          setIsOtherSelected?.(true);
        }
      }
      return e.target.value !== "";
    });
  };

  // Trigger onChange when input loses focus
  const handleOtherInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (inputValue.trim() !== "") {
      onChange(e.target.value + "$", false);
    }
  };

  return (
    <div className="form-options-container">
      <input
        type={type}
        checked={checked !== undefined ? checked : isChecked}
        value={inputValue}
        onChange={
          type === "radio" ? handleOtherRadioChange : handleOtherCheckboxChange
        }
        name={name}
      />

      <input
        type="text"
        value={inputValue}
        onChange={handleOtherInputChange}
        name={name}
        onBlur={handleOtherInputBlur}
        placeholder="Other"
        required={required ? required : false}
      />
    </div>
  );
};

export default OtherOption;
