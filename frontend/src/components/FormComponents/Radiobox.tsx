import React, { useState } from "react";
import OtherOption from "./OtherOption";

// Interface description
// heading: Main title for the checkbox options.
// subheading: Optional subtitle for the checkbox options.
// options: Array of strings for users to choose from.
// value: From the parent class, stores the user's choice from the set of radiobox options.
// required: Optionally set if we requrie users to select at least one option.
// onChange: Handles changing logic for the checkbox options.
// choiceName: Identifier for these choices of options.
// other: Optionally include on option for "other" where user can type a custom answer.
interface RadioboxProps {
  heading: string;
  subHeading?: string;
  options: string[];
  value: string;
  required?: boolean;
  onChange: (selectedOption: string) => void;
  choiceName: string;
  other?: boolean;
}

const Radiobox: React.FC<RadioboxProps> = ({
  heading,
  subHeading,
  options,
  value,
  required,
  onChange,
  choiceName,
  other,
}) => {
  // Track if "OtherOption" should be checked
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  const handleOptionChange = (selectedOption: string) => {
    setIsOtherSelected(false); // Uncheck "OtherOption"
    onChange(selectedOption);
  };

  const handleOtherOptionChange = (selectedOption: string) => {
    setIsOtherSelected(true); // Check "OtherOption"
    onChange(selectedOption);
  };

  // custome validation to see if parent variable is not ""

  return (
    <div className="form-input-container">
      <label className="form-label">
        {heading}
        {required && <span className="red-text"> *</span>}
      </label>

      {subHeading && <label className="form-label">{subHeading}</label>}

      <div className={choiceName}>
        {options.map((option, index) => (
          <div key={index}>
            <input
              type="radio"
              id={option}
              name={choiceName}
              value={option}
              checked={value === option && !isOtherSelected}
              onChange={() => handleOptionChange(option)}
              required={required}
            />
            <label htmlFor={option}>{option}</label>
          </div>
        ))}

        {other && (
          <OtherOption
            type="radio"
            checked={isOtherSelected}
            onChange={handleOtherOptionChange}
            setIsOtherSelected={setIsOtherSelected}
            required={required && isOtherSelected}
            name={choiceName}
          />
        )}
      </div>
    </div>
  );
};

export default Radiobox;
