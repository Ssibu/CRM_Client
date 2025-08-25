import React, { useRef } from "react";
import FilePreview from "./FilePreview"; // Assuming FilePreview can handle non-image files gracefully

const DocumentUploader = ({ onFileChange, file }) => {
  // Use a ref to allow resetting the input field
  const fileInputRef = useRef(null);

  const handleFileSelection = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
        onFileChange(null); // Clear the file if selection is cancelled
        return;
    };

    // Validation: File Size (max 10MB)
    if (selectedFile.size > 1024 * 1024 * 10) {
      alert("File size must be less than 10MB.");
      if(fileInputRef.current) fileInputRef.current.value = ""; // Reset the input
      onFileChange(null);
      return;
    }

    // CORRECTED: Validation for both images and documents
    const allowedTypes = [
      "image/jpeg", "image/jpg", "image/png", "image/webp",
      "application/pdf", 
      "application/msword", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
    ];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Invalid file type. Only JPG, PNG, PDF, DOC, and DOCX files are allowed.");
      if(fileInputRef.current) fileInputRef.current.value = ""; // Reset the input
      onFileChange(null);
      return;
    }

    // If validation passes, update the parent state
    onFileChange(selectedFile);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Upload Document / Image
        <span className="text-xs text-gray-500"> (PDF, DOC, DOCX, JPG, PNG)</span>
      </label>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelection}
        // CORRECTED: Update the accept attribute
        accept=".pdf,.doc,.docx,image/jpeg,image/png,image/webp"
        className="w-full border border-gray-300 px-3 py-[7px] rounded-md file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:border-none file:mr-2"
      />
      {/* The FilePreview component might need adjustment if it only shows images */}
      <FilePreview file={file} />
    </div>
  );
};

export default DocumentUploader;