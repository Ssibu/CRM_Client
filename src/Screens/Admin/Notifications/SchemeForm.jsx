import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// --- Import your reusable components ---
import Header from "@/Components/Admin/Add/Header";
import FormActions from "@/Components/Admin/Add/FormActions";
import FormField from "@/Components/Admin/TextEditor/FormField";
import DocumentUploader from "@/Components/Admin/TextEditor/DocumentUploader";
import { useModal } from "@/context/ModalProvider";
// API Endpoint for Schemes
const API_URL = "http://localhost:5000/api/schemes";

// Define the initial empty state for the form
const initialState = {
  en_title: "",
  od_title: "",
  document: null,
};

const SchemeForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { showModal } = useModal();

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({}); // State to hold validation errors
  const [existingDocument, setExistingDocument] = useState(''); 
  const [isFileMarkedForDeletion, setIsFileMarkedForDeletion] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalData, setOriginalData] = useState(initialState);
  const [originalDocumentName, setOriginalDocumentName] = useState('');
  
  

  useEffect(() => {
    if (isEditMode) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${API_URL}/${id}`,{withCredentials:true});
          const { en_title, od_title, document } = response.data;
          const editableData = { en_title, od_title, document: null };
          setFormData(editableData);
          
          // We store a copy of this data in our backup state for resetting
          setOriginalData(editableData);
          setExistingDocument(document);
          setOriginalDocumentName(document);
        } catch (error) {
          showModal("error", "Failed to load scheme data for editing.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [id, isEditMode, showModal]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleFileChange = (file, error) => {
    if (error) {
      // If the uploader sends an error, set it in the form's error state
      setErrors(prev => ({ ...prev, document: error }));
      setFormData(prev => ({ ...prev, document: null }));
    } else {
      // If the file is valid, set it in the form's data state and clear any old error
      setFormData(prev => ({ ...prev, document: file }));
      if (errors.document) setErrors(prev => ({ ...prev, document: null }));
      setIsFileMarkedForDeletion(false);
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!formData.en_title.trim()) {
      newErrors.en_title = "English Title is required.";
    }
    if (!formData.od_title.trim()) {
      newErrors.od_title = "Odia Title is required.";
    }
    if (!isEditMode && !formData.document) {
      newErrors.document = "A document file is required.";
    }
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
    if (isEditMode) {
      submissionData.append("removeExistingDocument", isFileMarkedForDeletion);
    }

    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/${id}`, submissionData, { withCredentials: true });
        showModal("success", "Scheme updated successfully!");
      } else {
        await axios.post(API_URL, submissionData, { withCredentials: true });
        showModal("success", "Scheme created successfully!");
      }
      navigate("/admin/notifications/scheme");
    } catch (error) {
      const errorMessage = error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} scheme.`;
      showModal("error", errorMessage); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (isEditMode) {
      
      setFormData(originalData);  
      setExistingDocument(originalDocumentName);
    } else {
      
      setFormData(initialState);
    }
    setErrors({});
    setIsFileMarkedForDeletion(false);
  };

  const handleGoBack = () => {
    navigate("/admin/notifications/scheme");
  };
  const handleRemoveFile = () => {
    if (window.confirm("The current document will be removed when you click 'Submit'. Are you sure?")) {
      setExistingDocument(''); // This should be existingDocumentName or similar
      setIsFileMarkedForDeletion(true);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div
      className="min-h-[80vh]"
    >
    <div className="bg-white p-6 shadow">
      <Header title={isEditMode ? "Edit Scheme" : "Add Scheme"} onGoBack={handleGoBack} />

      <form onSubmit={handleSubmit}>
        <div >
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField 
            maxLength={100}
              label="Title (In English)" 
              value={formData.en_title} 
              onChange={(val) => handleInputChange("en_title", val)} 
              placeholder="English title here"
              required
              error={errors.en_title}
            />
            <FormField 
            maxLength={100}
              label="Title (In Odia)" 
              value={formData.od_title} 
              onChange={(val) => handleInputChange("od_title", val)} 
              placeholder="Odia title here"
              required
              error={errors.od_title}
            />
            <div>
                <DocumentUploader 
                  label="Upload Form Document"
                  file={formData.document}
                  onFileChange={handleFileChange}
                  error={errors.document}
                  
                  // Add Configuration
                  allowedTypes={["application/pdf"]}
                  maxSizeMB={10}
                  required="true"
                  
                  // Add props for handling existing files
                  existingFileName={existingDocument}
                  existingFileUrl={`${import.meta.env.VITE_API_BASE_URL}/uploads/schemes/${existingDocument}`}
                  onRemove={isEditMode ? handleRemoveFile : null}
                />
                
            </div>
        </div>

        <FormActions
        isEditMode={isEditMode}
          onSubmit={handleSubmit}
          onCancel={handleGoBack}
          isSubmitting={isSubmitting}
          onReset={handleReset}
        />
        </div>
      </form>
      </div>
      </div>
    
  );
};

export default SchemeForm;