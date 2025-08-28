import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// --- Import your reusable components ---
import Header from "../../Components/Add/Header";
import FormActions from "../../Components/Add/FormActions";
import FormField from "../../Components/TextEditor/FormField";
import DocumentUploader from "../../Components/TextEditor/DocumentUploader";

const API_URL = "http://localhost:7777/api/bed-strengths";

const initialState = {
  en_title: "",
  od_title: "",
  document: null,
};

const BedStrengthForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialState);
  const [existingDocument, setExistingDocument] = useState(''); 
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${API_URL}/${id}`);
          const { en_title, od_title, document } = response.data;
          setFormData({ en_title, od_title, document: null });
          setExistingDocument(document);
        } catch (error) {
          console.error("Error fetching bed strength data:", error);
          alert("Failed to load data for editing.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [id, isEditMode]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file) => {
    setFormData((prev) => ({ ...prev, document: file }));
    if(file) {
        setExistingDocument('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.en_title.trim() || !formData.od_title.trim()) {
        alert("Please fill in both title fields.");
        return;
    }
    if (!isEditMode && !formData.document) {
      alert("Please upload a document file.");
      return;
    }

    setIsSubmitting(true);
    const submissionData = new FormData();
    submissionData.append("en_title", formData.en_title);
    submissionData.append("od_title", formData.od_title);

    if (formData.document) {
      submissionData.append("document", formData.document);
    }
    if (isEditMode && formData.document) {
        submissionData.append("oldFilePath", existingDocument);
    }

    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/${id}`, submissionData);
        alert("Record updated successfully!");
      } else {
        await axios.post(API_URL, submissionData);
        alert("Record created successfully!");
      }
      navigate("/admin/notifications/bed-strength");
    } catch (error) {
      const errorMessage = error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} record.`;
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialState);
  };

  const handleGoBack = () => {
    navigate("/admin/notifications/bed-strength");
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      <Header title={isEditMode ? "Edit Bed Strength" : "Add Bed Strength"} onGoBack={handleGoBack} />

      <form onSubmit={handleSubmit}>
        <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <FormField label="Title (In English)" value={formData.en_title} onChange={(val) => handleInputChange("en_title", val)} required/>
            <FormField label="Title (In Odia)" value={formData.od_title} onChange={(val) => handleInputChange("od_title", val)} required/>
            <div>
                <DocumentUploader file={formData.document} onFileChange={handleFileChange} />
                {isEditMode && !formData.document && existingDocument && (
                    <div className="mt-2 text-sm text-gray-600">
                        Current file: <a href={`${process.env.REACT_APP_API_BASE_URL}${existingDocument}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{existingDocument.split('/').pop()}</a>
                    </div>
                )}
            </div>
        </div>

        <FormActions
          onSubmit={handleSubmit}
          onCancel={handleGoBack}
          isSubmitting={isSubmitting}
          onReset={!isEditMode ? handleReset : null}
        />
      </form>
    </motion.div>
  );
};

export default BedStrengthForm;