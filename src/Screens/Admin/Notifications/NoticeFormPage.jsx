import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useModal } from "../../../context/ModalProvider";
import Header from "../../../Components/Admin/Add/Header";
import FormActions from "../../../Components/Admin/Add/FormActions";
import FormField from "../../../Components/Admin/TextEditor/FormField";
import DocumentUploader from "@/Components/Admin/TextEditor/DocumentUploader";

const INITIAL_FORM_STATE = { en_title: "", od_title: "", date: "" };

const NoticeFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { showModal } = useModal();

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [file, setFile] = useState(null);
  const [existingFileName, setExistingFileName] = useState("");
  const [isFileRemoved, setIsFileRemoved] = useState(false);

  const [originalData, setOriginalData] = useState(INITIAL_FORM_STATE);
  const [originalExistingFileName, setOriginalExistingFileName] = useState("");

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchNoticeData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/notices/${id}`,
          { withCredentials: true }
        );
        const { en_title, od_title, date, doc } = response.data;

        const fetchedData = { en_title, od_title, date: date || "" };
        const fetchedFileName = doc || "";

        setFormData(fetchedData);
        setExistingFileName(fetchedFileName);

        setOriginalData(fetchedData);
        setOriginalExistingFileName(fetchedFileName);
      } catch (error) {
        showModal(
          "error",
          error.response?.data?.message || "Failed to fetch notice data."
        );
        navigate("/admin/notifications/notices");
      }
    };

    fetchNoticeData();
  }, [id, isEditMode, navigate, showModal]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleFileChange = useCallback((selectedFile, errorMsg) => {
    if (errorMsg) {
      setErrors((prev) => ({ ...prev, doc: errorMsg }));
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setExistingFileName("");
    setIsFileRemoved(false);
    setErrors((prev) => ({ ...prev, doc: null }));
  }, []);

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    setExistingFileName("");
    setIsFileRemoved(true);
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.en_title.trim())
      newErrors.en_title = "English title is required.";
    if (!formData.od_title.trim())
      newErrors.od_title = "Odia title is required.";
    if (!formData.date) newErrors.date = "Date is required.";
    if (!isEditMode && !file) {
      newErrors.doc = "Notice document is required.";
    }
    if (isEditMode && isFileRemoved && !file) {
      newErrors.doc = "A new document is required after removing the old one.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, file, isEditMode, isFileRemoved]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
      setIsSubmitting(true);

      const submissionData = new FormData();
      Object.keys(formData).forEach((key) =>
        submissionData.append(key, formData[key])
      );
      if (file) {
        submissionData.append("doc", file);
      } else if (isFileRemoved) {
        submissionData.append("removeDoc", "true");
      }

      const url = isEditMode
        ? `${import.meta.env.VITE_API_BASE_URL}/notices/${id}`
        : `${import.meta.env.VITE_API_BASE_URL}/notices`;
      const method = isEditMode ? "patch" : "post";

      try {
        await axios[method](url, submissionData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        showModal(
          "success",
          `Notice ${isEditMode ? "updated" : "added"} successfully!`
        );
        navigate("/admin/notifications/notices");
      } catch (error) {
        showModal(
          "error",
          error.response?.data?.message ||
            `Failed to ${isEditMode ? "update" : "add"} notice.`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      formData,
      file,
      id,
      isEditMode,
      navigate,
      showModal,
      validateForm,
      isFileRemoved,
    ]
  );

  const handleReset = useCallback(() => {
    setFormData(originalData);
    setExistingFileName(originalExistingFileName);

    setFile(null);
    setIsFileRemoved(false);
    setErrors({});

    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = null;
  }, [originalData, originalExistingFileName]);

  return (
    <div className="min-h-[80vh]">
      <div className="bg-white p-6 shadow">
        <Header
          title={isEditMode ? "Edit Notice" : "Add New Notice"}
          onGoBack={() => navigate("/admin/notifications/notices")}
        />
        <div className="">
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Title (English)"
                maxLength={100}
                placeholder="English title here"
                name="en_title"
                type="text"
                value={formData.en_title}
                onChange={(value) => handleChange("en_title", value)}
                error={errors.en_title}
                required="true"
              />
              <FormField
                label="Title (Odia)"
                maxLength={100}
                placeholder="Odia title here"
                name="od_title"
                type="text"
                value={formData.od_title}
                onChange={(value) => handleChange("od_title", value)}
                error={errors.od_title}
                required="true"
              />
              <FormField
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={(value) => handleChange("date", value)}
                error={errors.date}
                required="true"
              />

              <DocumentUploader
                label="Notice Document"
                name="doc"
                onFileChange={handleFileChange}
                onRemove={handleRemoveFile}
                error={errors.doc}
                allowedTypes={["application/pdf"]}
                maxSizeMB={10}
                required="true"
                file={file}
                existingFileName={existingFileName}
                existingFileUrl={
                  existingFileName
                    ? `${
                        import.meta.env.VITE_API_BASE_URL
                      }/uploads/notices/${existingFileName}`
                    : null
                }
              />
            </div>

            <FormActions
              isSubmitting={isSubmitting}
              isEditMode={isEditMode}
              onCancel={() => navigate("/admin/notifications/notices")}
              onReset={handleReset}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default NoticeFormPage;
