import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useModal } from "../../../context/ModalProvider";
import Header from "../../../Components/Admin/Add/Header";
import FormActions from "../../../Components/Admin/Add/FormActions";
import FormField from "../../../Components/Admin/TextEditor/FormField";
import DescriptionFields from "../../../Components/Admin/Add/DescriptionFields";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/act-and-rules`;

const initialState = {
  en_title: "",
  od_title: "",
  en_description: "",
  od_description: "",
  date: "",
};

const isRichTextEmpty = (text) => {
  if (!text) return true;
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = text;
  return tempDiv.textContent.trim().length === 0;
};

const FormFieldsGroup = ({ formData, onInputChange, errors }) => (
  <div className=" grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
    <FormField
      label="Title (In English)"
      value={formData.en_title}
      onChange={(val) => onInputChange("en_title", val)}
      placeholder="English title here"
      required
      error={errors.en_title}
      maxLength={100}
    />
    <FormField
      label="Title (In Odia)"
      value={formData.od_title}
      onChange={(val) => onInputChange("od_title", val)}
      placeholder="Odia title here"
      required
      error={errors.od_title}
      maxLength={100}
    />
    <FormField
      label="Date"
      type="date"
      value={formData.date}
      onChange={(val) => onInputChange("date", val)}
      required
      error={errors.date}
    />
  </div>
);

const ActAndRuleForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { showModal } = useModal();

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalData, setOriginalData] = useState(initialState);

  useEffect(() => {
    if (isEditMode) {
      const fetchActAndRule = async () => {
        try {
          const response = await axios.get(`${API_URL}/${id}`, {
            withCredentials: true,
          });
          setFormData(response.data);
          setOriginalData(response.data);
        } catch (error) {
          showModal("error", "Failed to load data for editing.");
          console.error("Error fetching data for edit:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchActAndRule();
    }
  }, [id, isEditMode, showModal]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.en_title.trim()) {
      newErrors.en_title = "English Title is required.";
    }
    if (!formData.od_title.trim()) {
      newErrors.od_title = "Odia Title is required.";
    }
    if (isRichTextEmpty(formData.en_description)) {
      newErrors.en_description = "English Description is required.";
    }
    if (isRichTextEmpty(formData.od_description)) {
      newErrors.od_description = "Odia Description is required.";
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
    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/${id}`, formData, {
          withCredentials: true,
        });
        showModal("success", "Act & Rule updated successfully!");
      } else {
        await axios.post(API_URL, formData, { withCredentials: true });
        showModal("success", "Act & Rule created successfully!");
      }
      navigate("/admin/workflow/act-and-rules");
    } catch (error) {
      const responseData = error.response?.data;
      let errorMessage = "";

      if (responseData?.errors) {
        errorMessage = Object.values(responseData.errors).join("\n");
      } else {
        errorMessage =
          responseData?.message ||
          `Failed to ${isEditMode ? "update" : "create"} event.`;
      }

      showModal("error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (isEditMode) {
      setFormData(originalData);
    } else {
      setFormData(initialState);
    }
    setErrors({});
  };

  const handleGoBack = () => {
    navigate("/admin/workflow/act-and-rules");
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading form data...</div>;
  }

  return (
    <div className="min-h-screen bg-white p-6 shadow">
      <Header
        title={isEditMode ? "Edit Act & Rule" : "Add Act & Rule"}
        onGoBack={handleGoBack}
      />

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <FormFieldsGroup
            formData={formData}
            onInputChange={handleInputChange}
            errors={errors}
          />
          <DescriptionFields
            formData={formData}
            onInputChange={handleInputChange}
            errors={errors}
          />
        </div>

        <FormActions
        isEditMode={isEditMode}
          onSubmit={handleSubmit}
          onCancel={handleGoBack}
          isSubmitting={isSubmitting}
          onReset={handleReset}
        />
      </form>
    </div>
  );
};

export default ActAndRuleForm;
