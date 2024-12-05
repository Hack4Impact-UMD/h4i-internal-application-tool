import React from "react";
import OtherOption from "./OtherOption";

// TODO: Better way for form validation when Checkbox is required.

// Interface description
// heading: Main title for the checkbox options.
// subheading: Optional subtitle for the checkbox options.
// options: Array of strings for users to choose from.
// required: Optionally set if we requrie users to select at least one option.
// onChange: Handles changing logic for the checkbox options.
// choiceName: Identifier for these choices of options.
// other: Optionally include on option for "other" where user can type a custom answer.
interface CheckboxProps {
  heading: string;
  subHeading?: string;
  boldSubHeading?: string;
  options: string[];
  required?: boolean;
  onChange: (value: string, otherUnchecked?: boolean) => void;
  choiceName: string;
  other?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  heading,
  subHeading,
  boldSubHeading,
  options,
  required,
  onChange,
  choiceName,
  other,
}) => {
  
  // custom validation to ensure parent variable is not empty
  return (
    <div className="form-input-container">
      <label className="form-label">
        {heading}
        {required && <span className="red-text"> *</span>}
      </label>

      {subHeading && <label className="form-sublabel">{subHeading}</label>}

      {boldSubHeading && <strong className="form-sublabel">{boldSubHeading}</strong>}

      <div className="form-options-container">
        {options.map((option, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={option}
              name={choiceName}
              value={option}
              onChange={() => onChange(option)}
              required={required}
            />
            <label htmlFor={option}>{option}</label>
          </div>
        ))}

        {other && (
          <OtherOption
            type={"checkbox"}
            onChange={onChange}
            required={required}
            name={choiceName}
          />
        )}
      </div>
    </div>
  );
};

export default Checkbox;
