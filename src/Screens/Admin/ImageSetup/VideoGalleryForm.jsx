


import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../Components/Admin/Add/Header";
import axios from "axios";
import DocumentUploader from "../../../Components/Admin/TextEditor/DocumentUploader";
import FormActions from "@/Components/Admin/Add/FormActions";
import { useModal } from "@/context/ModalProvider";
import FormField from "@/Components/Admin/TextEditor/FormField";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const VideoGalleryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showModal } = useModal();

  const [formData, setFormData] = useState({
    en_title: "",
    od_title: "",
    category_id: "",
    videoSourceType: "upload",
    videoFile: null,
    videoLink: "",
  });

  const [initialData, setInitialData] = useState(null);
  const [existingVideoUrl, setExistingVideoUrl] = useState("");
  const [existingVideoRemoved, setExistingVideoRemoved] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/image-setup/all-categories`,
          {
            withCredentials: true,
          }
        );
        if (res.data && Array.isArray(res.data.data)) {
          setCategories(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        showModal("error", "Failed to fetch categories");
      }
    };
    fetchCategories();
  }, [showModal]);

  useEffect(() => {
    if (!id) {
      setInitialData(null);
      return;
    }

    const fetchVideo = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/image-setup/video/${id}`, {
          withCredentials: true,
        });

        if (res.data.success && res.data.video) {
          const video = res.data.video;
          const fetchedData = {
            en_title: video.en_title || "",
            od_title: video.od_title || "",
            category_id: video.category_id?.toString() || "",
            videoSourceType: video.videotype === "link" ? "link" : "upload",
            videoFile: null,
            videoLink: video.videotype === "link" ? video.videolink || "" : "",
          };

          setFormData(fetchedData);
          setInitialData(fetchedData);
          setExistingVideoUrl(video.video_url || "");
          setExistingVideoRemoved(false);
          setErrors({});
        } else {
          showModal("error", "Failed to load video data");
          navigate("/admin/image-setup/video-galary");
        }
      } catch (error) {
        console.error("Failed to fetch video:", error);
        showModal("error", "Error loading video data");
        navigate("/admin/image-setup/video-galary");
      }
    };

    fetchVideo();
  }, [id, navigate, showModal]);

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  const handleCancel = () => {
    navigate("/admin/image-setup/video-galary");
  };

  const handleFormFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNativeChange = (e) => {
    const { name, value } = e.target;
    if (name === "videoSourceType") {
      setFormData((prev) => ({
        ...prev,
        videoSourceType: value,
        videoFile: null,
        videoLink: "",
      }));
      setVideoPreviewUrl(null);
      setExistingVideoRemoved(false);
      setErrors({});
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleVideoFileChange = (file, errorMessage) => {
    if (errorMessage) {
      setErrors((prev) => ({ ...prev, videoFile: errorMessage }));
      setFormData((prev) => ({ ...prev, videoFile: null }));
      setVideoPreviewUrl(null);
    } else {
      setErrors((prev) => ({ ...prev, videoFile: "" }));
      setFormData((prev) => ({ ...prev, videoFile: file, videoLink: "" }));
      setExistingVideoUrl("");
      setExistingVideoRemoved(true);
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
      const previewURL = URL.createObjectURL(file);
      setVideoPreviewUrl(previewURL);
    }
  };

  const handleRemoveExistingVideo = () => {
    setExistingVideoUrl("");
    setFormData((prev) => ({ ...prev, videoFile: null, videoLink: "" }));
    setExistingVideoRemoved(true);
    setErrors((prev) => ({ ...prev, videoFile: "", videoLink: "" }));
    setVideoPreviewUrl(null);
  };

  const handleReset = () => {
    if (initialData) {
      setFormData(initialData);
      setExistingVideoRemoved(false);
      setVideoPreviewUrl(null);
      setErrors({});
      if (id) {
        const initialUrl = initialData.videoSourceType === "upload" ?
          `${API_BASE_URL}/uploads/videos/${initialData.videofile}` : "";
        setExistingVideoUrl(initialUrl);
      }
    } else {
      setFormData({
        en_title: "",
        od_title: "",
        category_id: "",
        videoSourceType: "upload",
        videoFile: null,
        videoLink: "",
      });
      setErrors({});
      setExistingVideoUrl("");
      setExistingVideoRemoved(false);
      setVideoPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.en_title.trim()) newErrors.en_title = "Title (EN) is required";
    if (!formData.od_title.trim()) newErrors.od_title = "Title (OD) is required";
    if (!formData.category_id) newErrors.category_id = "Category is required";
    if (!id || (id && existingVideoRemoved && !formData.videoFile && !formData.videoLink)) {
        if (formData.videoSourceType === "upload" && !formData.videoFile) {
            newErrors.videoFile = "Please upload a video file";
        } else if (formData.videoSourceType === "link" && !formData.videoLink.trim()) {
            newErrors.videoLink = "Please enter a video link";
        }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append("en_title", formData.en_title);
      form.append("od_title", formData.od_title);
      form.append("category_id", formData.category_id);
      form.append("videotype", formData.videoSourceType === "upload" ? "file" : "link");
      if (formData.videoSourceType === "upload") {
        if (formData.videoFile) {
          form.append("video", formData.videoFile);
        } else if (id && existingVideoRemoved) {
          form.append("video", "");
        }
      } else if (formData.videoSourceType === "link") {
        form.append("videolink", formData.videoLink.trim());
      }
      const endpoint = id ? `${API_BASE_URL}/image-setup/update-video/${id}` : `${API_BASE_URL}/image-setup/register-video`;
      const method = id ? axios.put : axios.post;
      const res = await method(endpoint, form, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
      });

      if (res.data.success) {
        showModal("success", id ? "Video updated successfully!" : "Video registered successfully!");
        navigate("/admin/image-setup/video-galary");
      } else {
        showModal("error", "Something went wrong: " + res.data.message);
      }
    } catch (error) {
  console.error("Error submitting video:", error);
  
  if (error.response && error.response.data && error.response.data.message) {
    // Show the specific error message returned by the server
    showModal("error", error.response.data.message);
  } else {
    showModal("error", "An error occurred while submitting the video.");
  }
}
 finally {
      setIsSubmitting(false);
    }
  };

  let displayVideoSrc = videoPreviewUrl || (existingVideoUrl && !existingVideoRemoved ? existingVideoUrl : null) || (formData.videoSourceType === 'link' ? formData.videoLink : null);

  return (
    <div className="min-h-[80vh]">
      <div className="bg-white p-6 shadow">
        <Header
          title={id ? "Edit Video Gallery Item" : "Add Video Gallery Item"}
          onGoBack={handleCancel}
        />
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="grid grid-cols-2 gap-4"
        >
          <div className="mb-">
            <FormField
            required
            maxLength={100}
              label="Title (English)"
              placeholder="Title in English"
              type="text"
              name="en_title"
              value={formData.en_title}
              onChange={(value) => handleFormFieldChange("en_title", value)}
              error={errors.en_title}
            />
          </div>
          <div className="mb-">
            <FormField
            required
            maxLength={100}
              label="Title (Odia)"
              placeholder="Title in Odia"
              type="text"
              name="od_title"
              value={formData.od_title}
              onChange={(value) => handleFormFieldChange("od_title", value)}
              error={errors.od_title}
            />
          </div>
          <div className="mb-">
            <label className="block text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleNativeChange}
              // className="mt-1 block w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          className={`mt-1 block w-full border ${
    errors.category_id ? "border-red-500" : "border-gray-300"
  } focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-3 py-2.5`}
>

            
              <option value="">-- Select Category --</option>
              {categories
                .filter((cat) => cat.category_type === "video")
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.en_category}
                  </option>
                ))}
            </select>
            {errors.category_id && (
              <p className="text-red-600 text-sm">{errors.category_id}</p>
            )}
          </div>
          <div className="col-span-2">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video Source Type
              </label>
              <label className="inline-flex items-center mr-6">
                <input
                  type="radio"
                  name="videoSourceType"
                  value="upload"
                  checked={formData.videoSourceType === "upload"}
                  onChange={handleNativeChange}
                />
                <span className="ml-2">Upload File</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="videoSourceType"
                  value="link"
                  checked={formData.videoSourceType === "link"}
                  onChange={handleNativeChange}
                />
                <span className="ml-2">Paste Link</span>
              </label>
            </div>
          </div>
          {formData.videoSourceType === "upload" ? (
            <div className="mb-6 col-span-2">
              <DocumentUploader
              required
                label="Upload Video"
                onFileChange={handleVideoFileChange}
                allowedTypes={[ "video/mp4", "video/webm" ]}
                maxSizeMB={25}
                error={errors.videoFile}
              />
            </div>
          ) : (
            <div className="mb-6 col-span-2">
              <FormField
                label="Paste Video Link"
                type="text"
                name="videoLink"
                value={formData.videoLink}
                onChange={(value) => handleFormFieldChange("videoLink", value)}
                placeholder="https://example.com/video.mp4"
                error={errors.videoLink}
              />
            </div>
          )}

          {displayVideoSrc && (
            <div className="mb-6 col-span-2">
              <p className="text-sm font-medium text-gray-700 mb-1">Video Preview:</p>
              <video
                key={displayVideoSrc}
                src={displayVideoSrc}
                controls
                className="w-full max-w-md rounded border bg-gray-100"
              />
              {existingVideoUrl && !existingVideoRemoved && (
                 <button
                 type="button"
                 onClick={handleRemoveExistingVideo}
                 className="mt-2 text-sm text-red-600 underline hover:text-red-800"
               >
                 Remove Existing Video
               </button>
              )}
            </div>
          )}
          
          <FormActions
            isSubmitting={isSubmitting}
            onCancel={handleCancel}
            onReset={handleReset}
          />
        </form>
      </div>
    </div>
  );
};

export default VideoGalleryForm;