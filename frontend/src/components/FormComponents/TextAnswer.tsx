import React from "react";

interface TextProps {
  heading: string;
  subHeading?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}

const TextAnswer: React.FC<TextProps> = ({
  heading,
  subHeading,
  value,
  onChange,
  placeholder,
  required,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="form-input-container">
      <label className="form-label">
        {heading}
        {required && <span className="red-text"> *</span>}
      </label>
      {subHeading && <label className="form-label">{subHeading}</label>}
      <input
        type="text"
        className="form-input"
        value={value}
        onChange={handleChange}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextAnswer;
