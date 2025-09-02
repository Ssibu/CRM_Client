// import React, { useRef } from "react";
// import FilePreview from "./FilePreview"; // Assuming this is in the same directory

// const DocumentUploader = ({ onFileChange, file }) => {
//   // Use a ref to allow programmatically resetting the input field
//   const fileInputRef = useRef(null);

//   const handleFileSelection = (e) => {
//     const selectedFile = e.target.files[0];
    
//     // Handle the case where the user cancels file selection
//     if (!selectedFile) {
//         onFileChange(null);
//         return;
//     };

//     // --- Validation 1: File Size ---
//     if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
//       alert("File size must be less than 10MB.");
//       if (fileInputRef.current) fileInputRef.current.value = ""; // Reset the input field
//       onFileChange(null);
//       return;
//     }

//     // --- Validation 2: File Type (MIME Type Check) ---
//     const allowedTypes = [
//       // Images
//       "image/jpeg",
//       "image/png",
//       "image/webp",
//       // Documents
//       "application/pdf", 
//       "application/msword", // .doc
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
//       // --- ADDED: Excel MIME Types ---
//       "application/vnd.ms-excel", // .xls
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // .xlsx
//     ];
    
//     if (!allowedTypes.includes(selectedFile.type)) {
//       alert("Invalid file type. Only JPG, PNG, PDF, DOC, DOCX, XLS, and XLSX files are allowed.");
//       if (fileInputRef.current) fileInputRef.current.value = ""; // Reset the input field
//       onFileChange(null);
//       return;
//     }

//     // If all validation passes, notify the parent component of the new file
//     onFileChange(selectedFile);
//   };

//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         Upload Document / PDF *
//         <span className="text-xs text-gray-500"> (PDF, DOC, XLS, JPG...)</span>
//       </label>
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleFileSelection}
//         // --- UPDATED: 'accept' attribute now includes Excel extensions ---
//         accept=".pdf,.doc,.docx,.xls,.xlsx,image/jpeg,image/png,image/webp"
//         className="w-full border border-gray-300 px-3 py-[7px] rounded-md file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:border-none file:mr-2"
//       />
//       <FilePreview file={file} />
//     </div>
//   );
// };

// export default DocumentUploader;


import React, { useRef, useMemo } from 'react';
import { FaEye, FaTrash } from 'react-icons/fa';
import FilePreview from './FilePreview';

const DocumentUploader = ({
    // --- Core Data Props ---
    label = "Upload Document",
    file,
    existingFileName,
    existingFileUrl,
    
    // --- Core Functional Props ---
    onFileChange,
    onRemove,

    // --- Dynamic Configuration Props ---
    allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'], // Default allowed types
    maxSizeMB = 5, // Default max size in Megabytes
    
    // --- State Props ---
    error, // Error message from parent state
}) => {
  const fileInputRef = useRef(null);

  const handleFileSelection = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
        // Notify parent that selection was cancelled
        onFileChange(null, null);
        return;
    };

    // --- DYNAMIC VALIDATION ---
    const maxSizeInBytes = maxSizeMB * 1024 * 1024;
    if (selectedFile.size > maxSizeInBytes) {
      const errorMessage = `File is too large. Max size is ${maxSizeMB}MB.`;
      // Notify parent of the validation error
      onFileChange(null, errorMessage); 
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (!allowedTypes.includes(selectedFile.type)) {
      const errorMessage = 'Invalid file type.';
      // Notify parent of the validation error
      onFileChange(null, errorMessage);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // --- SUCCESS ---
    // Notify parent of the valid file and clear any previous errors
    onFileChange(selectedFile, null);
  };
  
  // Dynamically generate the 'accept' string for the file input
  const acceptString = useMemo(() => allowedTypes.join(','), [allowedTypes]);

  // Dynamically generate a user-friendly list of allowed extensions
  const allowedExtensions = useMemo(() => 
    [...new Set(allowedTypes.map(type => type.split('/')[1].toUpperCase()))].join(', '),
    [allowedTypes]
  );

  return (
    <div>
     <div className='flex gap-2' >  
       <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
       <p className="text-xs text-blue-500 mt-1">
        Accepts: {allowedExtensions}. Max size: {maxSizeMB}MB.
      </p>
     </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelection}
        accept={acceptString}
        className={` w-full border  ${error ? 'border-red-500' : 'border-gray-300'} px-3 py-3 cursor-pointer rounded-md text-sm text-gray-500 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:border-none file:mr-2
`}
      />
     
      
      {/* Display server-side or client-side validation errors */}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      
      {/* Display preview for a NEWLY selected file */}
      {file && <FilePreview file={file} />}
      
      {/* Display info for an EXISTING file from the server */}
      {!file && existingFileName && (
        <div className="mt-2 p-2 bg-gray-50 rounded-md border flex items-center justify-between">
            <span className="text-sm text-gray-700 truncate">{existingFileName}</span>
            <div className="flex items-center gap-3 flex-shrink-0">
                {existingFileUrl && (
                    <a href={existingFileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800" title="View File">
                     View <FaEye />
                    </a>
                )}
                {onRemove && (
                    <button type="button" onClick={onRemove} className="text-red-600 hover:text-red-800" title="Remove File">
                        <FaTrash />
                    </button>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;