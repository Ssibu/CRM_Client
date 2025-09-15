import React, { useRef, useMemo } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import FilePreview from "./FilePreview";

const DocumentUploader = ({
  label = "Upload Document",
  file,
  existingFileName,
  existingFileUrl,
  required = false,

  onFileChange,
  onRemove,

  allowedTypes = ["application/pdf", "image/jpeg", "image/png"],
  maxSizeMB = 5,

  error,
}) => {
  const fileInputRef = useRef(null);

  const handleFileSelection = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      onFileChange(null, null);
      return;
    }

    const maxSizeInBytes = maxSizeMB * 1024 * 1024;
    if (selectedFile.size > maxSizeInBytes) {
      const errorMessage = `File is too large. Max size is ${maxSizeMB}MB.`;
      onFileChange(null, errorMessage);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (!allowedTypes.includes(selectedFile.type)) {
      const errorMessage = "Invalid file type.";
      onFileChange(null, errorMessage);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    onFileChange(selectedFile, null);
  };

  const acceptString = useMemo(() => allowedTypes.join(","), [allowedTypes]);

  const allowedExtensions = useMemo(
    () =>
      [
        ...new Set(
          allowedTypes.map((type) => type.split("/")[1].toUpperCase())
        ),
      ].join(", "),
    [allowedTypes]
  );

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <label className="block text-sm font-medium text-gray-700">
          {label}     {required && (
            <span className="text-sm font-medium text-red-500">*</span>
          )}
        </label>
        <p className="text-xs text-blue-500">
          Accepts: {allowedExtensions}. Max size: {maxSizeMB}MB.
      
        </p>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelection}
        accept={acceptString}
        className={` w-full border  ${
          error ? "border-red-500" : "border-gray-300"
        } px-3 py-3 cursor-pointer rounded-md text-sm text-gray-500 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:border-none file:mr-2
`}
      />

      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}

      {file && <FilePreview file={file} />}

      {!file && existingFileName && (
        <div className="mt-2 p-2 bg-gray-50 rounded-md border flex items-center justify-between">
          <span className="text-sm text-gray-700 truncate">
            {existingFileName}
          </span>
          <div className="flex items-center gap-3 flex-shrink-0">
            {existingFileUrl && (
              <a
                href={existingFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                title="View File"
              >
                View <FaEye />
              </a>
            )}
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="text-red-600 hover:text-red-800"
                title="Remove File"
              >
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
