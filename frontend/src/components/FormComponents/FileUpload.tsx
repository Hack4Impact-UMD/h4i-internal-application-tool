import React, { useState } from "react";

// Interface description
// heading: Main title for the checkbox options.
// required: Optionally set if we requrie users to upload some PDF file.
// onChange: Handles changing logic for PDF upload in the form.
interface FileUploadProps {
  heading: string;
  required?: boolean;
  onChange: (value: string | File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ heading, required, onChange }) => {
  // Helps display the file name when successfully uploaded.
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // Signals to the user the file's upload status
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Handle local states changes and sends the file to the form.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      onChange(file);
      setUploadStatus(null);
    } else {
      setSelectedFile(null);
      setUploadStatus("Please select a valid PDF file.");
    }
  };

  return (
    <div>
      <h4 className="form-label">
        {heading}
        {required && <span className="red-text"> *</span>}
      </h4>
      <input
        required
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
      />
      {uploadStatus && <p>{uploadStatus}</p>}
      {selectedFile && <p>Selected file: {selectedFile.name}</p>}
    </div>
  );
};

export default FileUpload;
