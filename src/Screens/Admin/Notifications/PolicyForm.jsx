import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useModal } from "@/context/ModalProvider";


// Import your reusable components
import Header from "@/Components/Admin/Add/Header";
import FormActions from "@/Components/Admin/Add/FormActions";
import FormField from "@/Components/Admin/TextEditor/FormField";
import DocumentUploader from "@/Components/Admin/TextEditor/DocumentUploader";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/policies`;

const initialState = {
  en_title: "",
  od_title: "",
  document: null,
};

const PolicyForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { showModal } = useModal();

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [existingDocumentName, setExistingDocumentName] = useState('');
  const [isFileMarkedForDeletion, setIsFileMarkedForDeletion] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalData, setOriginalData] = useState(initialState);
  const [originalDocumentName, setOriginalDocumentName] = useState('');
  

  useEffect(() => {
    if (isEditMode) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${API_URL}/${id}`, { withCredentials: true });
          const { en_title, od_title, document } = response.data;
          const editableData = { en_title, od_title, document: null };
          setFormData(editableData);
          setOriginalData(editableData);
          setExistingDocumentName(document);
          setOriginalDocumentName(document);
        } catch (error) {
          showModal("error", "Failed to load policy data for editing.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [id, isEditMode, showModal]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleFileChange = (file, error) => {
    if (error) {
      setErrors(prev => ({ ...prev, document: error }));
      setFormData(prev => ({ ...prev, document: null }));
    } else {
      setFormData(prev => ({ ...prev, document: file }));
      if (errors.document) setErrors(prev => ({ ...prev, document: null }));
      setIsFileMarkedForDeletion(false);
    }
  };

  const handleRemoveFile = () => {
    if (window.confirm("The current document will be removed when you click 'Submit'. Are you sure?")) {
      setExistingDocumentName(''); // Update UI to hide the existing file info
      setIsFileMarkedForDeletion(true); // Mark the file for deletion on submit
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.en_title.trim()) newErrors.en_title = "English Title is required.";
    if (!formData.od_title.trim()) newErrors.od_title = "Odia Title is required.";
    if (!isEditMode && !formData.document) newErrors.document = "A document file is required.";
    
    return newErrors;
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    const submissionData = new FormData();
    submissionData.append("en_title", formData.en_title);
    submissionData.append("od_title", formData.od_title);

    if (formData.document) {
      submissionData.append("document", formData.document);
    }
    
    // --- THIS IS THE KEY CHANGE ---
    // In edit mode, send the flag indicating the user's intent.
    if (isEditMode) {
      submissionData.append("removeExistingDocument", isFileMarkedForDeletion);
    }

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true };
      if (isEditMode) {
        await axios.put(`${API_URL}/${id}`, submissionData, config);
        showModal("success", "Policy updated successfully!");
      } else {
        await axios.post(API_URL, submissionData, config);
        showModal("success", "Policy created successfully!");
      }
      navigate("/admin/notifications/policy");
    } catch (error) {
      const errorMessage = error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} policy.`;
      showModal("error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleReset = () => {
    if (isEditMode) {
      
      setFormData(originalData);  
      setExistingDocumentName(originalDocumentName);
    } else {
      
      setFormData(initialState);
    }
    setErrors({});
    setIsFileMarkedForDeletion(false);
  };

  return (
    <div
      className="min-h-[80vh]"
    >
    <div className="bg-white p-6 shadow">
      <Header title={isEditMode ? "Edit Policy" : "Add Policy"} onGoBack={() => navigate("/admin/notifications/policy")} />
      <form onSubmit={handleSubmit}>
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Title (In English)" placeholder="English title here" value={formData.en_title} onChange={(val) => handleInputChange("en_title", val)} required error={errors.en_title} />
            <FormField label="Title (In Odia)" placeholder="Odia title here" value={formData.od_title} onChange={(val) => handleInputChange("od_title", val)} required error={errors.od_title} />
            
            <DocumentUploader
              label="Upload Policy Document"
              file={formData.document}
              required="true"
              onFileChange={handleFileChange}
              error={errors.document}
              // Configuration for Policy documents
              allowedTypes={["application/pdf",]}
              maxSizeMB={10}
              // Props for managing existing files
              existingFileName={existingDocumentName}
              existingFileUrl={`${import.meta.env.VITE_API_BASE_URL}/uploads/policies/${existingDocumentName}`}
              onRemove={isEditMode ? handleRemoveFile : null}
            />
        </div>
        <FormActions
        isEditMode={isEditMode}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin/notifications/policy")}
          isSubmitting={isSubmitting}
          onReset={handleReset }
        />
      </form>
    </div>
    </div>
  );
};

export default PolicyForm;