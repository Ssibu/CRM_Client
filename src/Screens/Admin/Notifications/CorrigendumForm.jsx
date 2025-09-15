import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useModal } from "../../../context/ModalProvider";
import FormActions from "../../../Components/Admin/Add/FormActions";
import FormField from "../../../Components/Admin/TextEditor/FormField";
import DocumentUploader from "@/Components/Admin/TextEditor/DocumentUploader";

const CorrigendumForm = ({
  tenderId,
  editingCorrigendum,
  onSuccess,
  onCancel,
}) => {
  const isEditMode = !!editingCorrigendum;
  const { showModal } = useModal();

  const initialFormData = {
    remarks: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [file, setFile] = useState(null);
  const [existingFileName, setExistingFileName] = useState("");
  const [isFileRemoved, setIsFileRemoved] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && editingCorrigendum) {
      setFormData({
        remarks: editingCorrigendum.remarks || "",
      });
      setExistingFileName(editingCorrigendum.cor_document || "");
    } else {
      setFormData(initialFormData);
      setExistingFileName("");
    }
    setFile(null);
    setErrors({});
    setIsFileRemoved(false);
    // Clear the file input visually
    const fileInput = document.getElementById("cor_document");
    if (fileInput) fileInput.value = null;
  }, [editingCorrigendum, isEditMode]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (selectedFile, errorMessage) => {
    if (errorMessage) {
      setErrors((prev) => ({ ...prev, cor_document: errorMessage }));
      setFile(null);
      return;
    }
    setErrors((prev) => ({ ...prev, cor_document: null }));
    setFile(selectedFile);
    setIsFileRemoved(false);
  };

  const handleRemoveFile = useCallback(() => {
    setExistingFileName("");
    setFile(null);
    setIsFileRemoved(true);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!isEditMode && !file)
      newErrors.cor_document = "Corrigendum document is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const submissionData = new FormData();
    Object.keys(formData).forEach((key) =>
      submissionData.append(key, formData[key])
    );

    if (file) {
      submissionData.append("cor_document", file);
    } else if (isFileRemoved) {
      submissionData.append("remove_cor_document", "true");
    }

    const url = isEditMode
      ? `${import.meta.env.VITE_API_BASE_URL}/corrigendums/corrigendums/${
          editingCorrigendum.id
        }`
      : `${
          import.meta.env.VITE_API_BASE_URL
        }/corrigendums/tenders/${tenderId}/corrigendums`;
    const method = isEditMode ? "patch" : "post";

    try {
      await axios[method](url, submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      showModal(
        "success",
        `Corrigendum ${isEditMode ? "updated" : "added"} successfully!`
      );
      onSuccess();
    } catch (error) {
      showModal("error", error.response?.data?.message || "Operation failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (isEditMode) {
      setFormData({
        remarks: editingCorrigendum.remarks || "",
      });
      setExistingFileName(editingCorrigendum.cor_document || "");
    } else {
      setFormData(initialFormData);
    }
    setFile(null);
    setErrors({});
    setIsFileRemoved(false);
    const fileInput = document.getElementById("cor_document");
    if (fileInput) fileInput.value = null;
  };

  return (
    <div className=" ">
      <h2 className="text-xl font-bold mb-6 pb-6">
        {isEditMode ? "Edit Corrigendum" : "Add New Corrigendum"}
      </h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-2 gap-4">
             <DocumentUploader
            required
              label={isEditMode ? "" : "Corrigendum Document"}
              name="cor_document"
              onFileChange={handleFileChange}
              file={file}
              error={errors.cor_document}
              allowedTypes={["application/pdf"]}
              existingFileName={existingFileName}
              existingFileUrl={
                existingFileName
                  ? `${
                      import.meta.env.VITE_API_BASE_URL
                    }/uploads/tenders/corrigendums/${existingFileName}`
                  : null
              }
              maxSizeMB={10}
              onRemove={handleRemoveFile}
            />
          <FormField
            label="Remarks"
            placeholder="Remarks here"
            name="remarks"
            type="text"
            value={formData.remarks}
            onChange={(value) => handleChange("remarks", value)}
            error={errors.remarks}
            
          />
         
        </div>
        <FormActions
          onSubmit={handleSubmit}
          onReset={handleReset}
          isEditMode={isEditMode}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  );
};

export default CorrigendumForm;
