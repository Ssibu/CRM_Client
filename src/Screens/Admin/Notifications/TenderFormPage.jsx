import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useModal } from "@/context/ModalProvider";
import Header from "@/Components/Admin/Add/Header";
import FormActions from "@/Components/Admin/Add/FormActions";
import FormField from "@/Components/Admin/TextEditor/FormField";
import DocumentUploader from "@/Components/Admin/TextEditor/DocumentUploader";

const INITIAL_FORM_STATE = {
  en_title: "",
  od_title: "",
  date: "",
  expiry_date: "",
};
const INITIAL_FILES_STATE = { nit_doc: null, doc: null };
const INITIAL_EXISTING_FILES_STATE = { nit_doc: "", doc: "" };

const TenderFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { showModal } = useModal();

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [files, setFiles] = useState(INITIAL_FILES_STATE);
  const [existingFileNames, setExistingFileNames] = useState(
    INITIAL_EXISTING_FILES_STATE
  );
  const [filesToRemove, setFilesToRemove] = useState({
    nit_doc: false,
    doc: false,
  });

  const [originalData, setOriginalData] = useState(INITIAL_FORM_STATE);
  const [originalExistingFileNames, setOriginalExistingFileNames] = useState(
    INITIAL_EXISTING_FILES_STATE
  );

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchTenderData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/tenders/${id}`,
          { withCredentials: true }
        );
        const { en_title, od_title, date, expiry_date, nit_doc, doc } =
          response.data;

        const fetchedData = {
          en_title,
          od_title,
          date: date || "",
          expiry_date: expiry_date || "",
        };
        const fetchedFileNames = { nit_doc: nit_doc || "", doc: doc || "" };

        setFormData(fetchedData);
        setExistingFileNames(fetchedFileNames);

        setOriginalData(fetchedData);
        setOriginalExistingFileNames(fetchedFileNames);
      } catch (error) {
        showModal("error", error.response?.data?.message || error.message);
        navigate("/admin/notifications/tenders");
      }
    };
    fetchTenderData();
  }, [id, isEditMode, navigate, showModal]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (fieldName, file, errorMessage) => {
    if (errorMessage) {
      setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
      setFiles((prev) => ({ ...prev, [fieldName]: null }));
      return;
    }
    setErrors((prev) => ({ ...prev, [fieldName]: null }));
    setFiles((prev) => ({ ...prev, [fieldName]: file }));
    setExistingFileNames((prev) => ({ ...prev, [fieldName]: "" }));
    setFilesToRemove((prev) => ({ ...prev, [fieldName]: false }));
  };

  const handleRemoveFile = useCallback((fieldName) => {
    setFiles((prev) => ({ ...prev, [fieldName]: null }));
    setExistingFileNames((prev) => ({ ...prev, [fieldName]: "" }));
    setFilesToRemove((prev) => ({ ...prev, [fieldName]: true }));
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.en_title.trim())
      newErrors.en_title = "English title is required.";
    if (!formData.od_title.trim())
      newErrors.od_title = "Odia title is required.";
    if (!formData.date) newErrors.date = "Tender date is required.";
    if (!formData.expiry_date)
      newErrors.expiry_date = "Expiry date is required.";

    if ((!isEditMode || filesToRemove.nit_doc) && !files.nit_doc) {
      newErrors.nit_doc = "NIT document is required.";
    }
    if ((!isEditMode || filesToRemove.doc) && !files.doc) {
      newErrors.doc = "Tender document is required.";
    }

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
    if (files.nit_doc) submissionData.append("nit_doc", files.nit_doc);
    if (files.doc) submissionData.append("doc", files.doc);
    if (filesToRemove.nit_doc) submissionData.append("remove_nit_doc", "true");
    if (filesToRemove.doc) submissionData.append("remove_doc", "true");

    const url = isEditMode
      ? `${import.meta.env.VITE_API_BASE_URL}/tenders/${id}`
      : `${import.meta.env.VITE_API_BASE_URL}/tenders`;
    const method = isEditMode ? "patch" : "post";

    try {
      await axios[method](url, submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      showModal(
        "success",
        `Tender ${isEditMode ? "updated" : "added"} successfully!`
      );
      navigate("/admin/notifications/tenders");
    } catch (error) {
      showModal(
        "error",
        error.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "add"} tender.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(originalData);
    setExistingFileNames(originalExistingFileNames);

    setFiles(INITIAL_FILES_STATE);
    setFilesToRemove({ nit_doc: false, doc: false });
    setErrors({});

    document
      .querySelectorAll('input[type="file"]')
      .forEach((input) => (input.value = ""));
  };

  return (
    <div className="min-h-[80vh]">
      <div className="bg-white p-6 shadow">
        <Header
          title={isEditMode ? "Edit Tender" : "Add New Tender"}
          onGoBack={() => navigate("/admin/notifications/tenders")}
        />
        <div className="">
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Title (English)"
                name="en_title"
                value={formData.en_title}
                onChange={(value) => handleChange("en_title", value)}
                placeholder="English title here"
                error={errors.en_title}
                required="true"
                maxLength={100}
              />
              <FormField
                label="Title (Odia)"
                name="od_title"
                value={formData.od_title}
                onChange={(value) => handleChange("od_title", value)}
                placeholder="Odia title here"
                error={errors.od_title}
                required="true"
                maxLength={100}
              />
              <FormField
                label="Tender Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={(value) => handleChange("date", value)}
                error={errors.date}
                required="true"
              />
              <FormField
                label="Expiry Date"
                name="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(value) => handleChange("expiry_date", value)}
                error={errors.expiry_date}
                required="true"
              />

              <DocumentUploader
                label="NIT Document"
                file={files.nit_doc}
                allowedTypes={["application/pdf"]}
                maxSizeMB={10}
                existingFileName={existingFileNames.nit_doc}
                existingFileUrl={
                  existingFileNames.nit_doc
                    ? `${import.meta.env.VITE_API_BASE_URL}/uploads/tenders/${
                        existingFileNames.nit_doc
                      }`
                    : null
                }
                onFileChange={(file, error) =>
                  handleFileChange("nit_doc", file, error)
                }
                onRemove={() => handleRemoveFile("nit_doc")}
                error={errors.nit_doc}
                required="true"
              />
              <DocumentUploader
                label="Tender Document"
                file={files.doc}
                allowedTypes={["application/pdf"]}
                maxSizeMB={10}
                existingFileName={existingFileNames.doc}
                existingFileUrl={
                  existingFileNames.doc
                    ? `${import.meta.env.VITE_API_BASE_URL}/uploads/tenders/${
                        existingFileNames.doc
                      }`
                    : null
                }
                onFileChange={(file, error) =>
                  handleFileChange("doc", file, error)
                }
                onRemove={() => handleRemoveFile("doc")}
                error={errors.doc}
                required="true"
              />
            </div>

            <FormActions
              isSubmitting={isSubmitting}
              isEditMode={isEditMode}
              onCancel={() => navigate("/admin/notifications/tenders")}
              onReset={handleReset}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default TenderFormPage;
