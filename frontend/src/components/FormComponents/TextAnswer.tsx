import React from "react";

interface TextProps {
  heading: string;
  subHeading?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  shortAnswer?: boolean;
  required?: boolean;
}

const TextAnswer: React.FC<TextProps> = ({
  heading,
  subHeading,
  value,
  onChange,
  placeholder,
  shortAnswer,
  required,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Changes textbox size back to default if input is deleted
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    if (!shortAnswer) {
      if (!textarea.value) {
        textarea.style.height = ""; // Reset to default height
      } else {
        textarea.style.height = "auto"; // Reset height to auto to shrink if needed
        textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on scroll height
      }
    }
  };

  return (
    <div className="form-input-container">
      <label className="form-label">
        {heading}
        {required && <span className="red-text"> *</span>}
      </label>
      {subHeading && <label className="form-sublabel">{subHeading}</label>}
      <textarea
        className="form-input"
        value={value}
        onChange={handleChange}
        required={required}
        placeholder={placeholder || (shortAnswer ? "Insert Text" : "Type Here...")}
        style={{
          resize: shortAnswer ? "none" : "vertical", // Disable resizing for short answers
          overflow: "hidden",
          height: shortAnswer ? "auto" : "180px", // Default height for long answers (8 lines), one line for short answers
        }}
        rows={shortAnswer ? 1 : 8}
        onInput={handleInput}
      />
    </div>
  );
};

export default TextAnswer;
