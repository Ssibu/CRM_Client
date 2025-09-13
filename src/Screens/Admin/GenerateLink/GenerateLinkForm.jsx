
import React, { useState, useEffect } from "react";
import Header from "../../../Components/Admin/Add/Header";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import DocumentUploader from "../../../Components/Admin/TextEditor/DocumentUploader";
import FormActions from "@/Components/Admin/Add/FormActions";
import FormField from "@/Components/Admin/TextEditor/FormField";
import { useModal } from "@/context/ModalProvider";

const GenerateLinkForm = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [existingFile, setExistingFile] = useState("");

  const [initialData, setInitialData] = useState(null); // store API values
  const [errors, setErrors] = useState({ title: "", file: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const { showModal } = useModal();

  useEffect(() => {
    if (id) {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/generated-links/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          const fetchedData = {
            title: res.data.title || "",
            existingFile: res.data.filePath || "",
          };
          setTitle(fetchedData.title);
          setExistingFile(fetchedData.existingFile);
          setInitialData(fetchedData); //  keep original
        })
        .catch((err) => console.error("Error fetching link:", err));
    }
  }, [id]);

  const handleFileChange = (selectedFile, validationError) => {
    if (validationError) {
      setErrors(validationError);
      setFile(null);
    } else {
      setErrors({ title: "", file: "" });
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = { title: "", file: "" };
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!file && !existingFile) newErrors.file = "File is required.";
    setErrors(newErrors);

    if (newErrors.title || newErrors.file) return;

    if (id && file) {
      const confirmReplace = window.confirm(
        "Submitting will replace the old file with the new one."
      );
      if (!confirmReplace) return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      if (file) formData.append("file", file);

      if (id) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/generated-links/${id}`,
          formData,
          { withCredentials: true }
        );
        showModal("success", "Link updated successfully!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/generated-links`,
          formData,
          { withCredentials: true }
        );
        showModal("success", "Link created successfully!");
      }

      navigate("/admin/generate-link");
    } catch (err) {
      console.error("Error saving link:", err.response?.data || err.message || err);
      showModal("error", err.response?.data?.message || "Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  //  Reset Logic
  const handleReset = () => {
    if (id && initialData) {
      setTitle(initialData.title);
      setExistingFile(initialData.existingFile);
      setFile(null);
    } else {
      setTitle("");
      setFile(null);
      setExistingFile("");
    }
    setErrors({ title: "", file: "" });
  };

  return (
    <div className="min-h-[80vh]">
      <div className="p-4 bg-white shadow">
        <Header
          title={id ? "Edit File" : "Generate Link"}
          onGoBack={() => navigate("/admin/generate-link")}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
         <div className="grid grid-cols-2 gap-6" >
           {/* Title */}
          <FormField
            label="Title"
            placeholder="Enter title"
            type="text"
            value={title}
            onChange={setTitle}
            required={true}
            error={errors.title}
          />

          {/* File Upload */}
          <DocumentUploader
            label="Upload Document"
            file={file}
            error={errors.file}
            existingFileName={
              existingFile ? existingFile.split("-").slice(1).join("-") : ""
            }
            existingFileUrl={`${import.meta.env.VITE_API_BASE_URL}/uploads/generated-links/${existingFile}`}
            onFileChange={handleFileChange}
            maxSizeMB={2}
            required="true"
          />
         </div>

          {/* Actions */}
          <FormActions
            disabled={isSubmitting}
            onReset={handleReset}
            onCancel={() => navigate("/admin/generate-link")}
          />
        </form>
      </div>
    </div>
  );
};

export default GenerateLinkForm;
