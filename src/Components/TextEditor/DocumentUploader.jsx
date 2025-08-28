import React, { useRef } from "react";
import FilePreview from "./FilePreview"; // Assuming this is in the same directory

const DocumentUploader = ({ onFileChange, file }) => {
  // Use a ref to allow programmatically resetting the input field
  const fileInputRef = useRef(null);

  const handleFileSelection = (e) => {
    const selectedFile = e.target.files[0];
    
    // Handle the case where the user cancels file selection
    if (!selectedFile) {
        onFileChange(null);
        return;
    };

    // --- Validation 1: File Size ---
    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      alert("File size must be less than 10MB.");
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset the input field
      onFileChange(null);
      return;
    }

    // --- Validation 2: File Type (MIME Type Check) ---
    const allowedTypes = [
      // Images
      "image/jpeg",
      "image/png",
      "image/webp",
      // Documents
      "application/pdf", 
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      // --- ADDED: Excel MIME Types ---
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // .xlsx
    ];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Invalid file type. Only JPG, PNG, PDF, DOC, DOCX, XLS, and XLSX files are allowed.");
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset the input field
      onFileChange(null);
      return;
    }

    // If all validation passes, notify the parent component of the new file
    onFileChange(selectedFile);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Upload Document / Image *
        <span className="text-xs text-gray-500"> (PDF, DOC, XLS, JPG...)</span>
      </label>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelection}
        // --- UPDATED: 'accept' attribute now includes Excel extensions ---
        accept=".pdf,.doc,.docx,.xls,.xlsx,image/jpeg,image/png,image/webp"
        className="w-full border border-gray-300 px-3 py-[7px] rounded-md file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:border-none file:mr-2"
      />
      <FilePreview file={file} />
    </div>
  );
};

export default DocumentUploader;