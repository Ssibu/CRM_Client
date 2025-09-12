// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Header from "../../../Components/Admin/Add/Header";
// import axios from "axios";
// import DocumentUploader from "../../../Components/Admin/TextEditor/DocumentUploader";
// import FormActions from "@/Components/Admin/Add/FormActions";
// import { useModal } from "@/context/ModalProvider"; // ✅ Added

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const VideoGalleryForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { showModal } = useModal(); // ✅ Added

//   const [formData, setFormData] = useState({
//     en_title: "",
//     od_title: "",
//     category_id: "",
//     videoSourceType: "upload",
//     videoFile: null,
//     videoLink: "",
//   });

//   const [existingVideoUrl, setExistingVideoUrl] = useState("");
//   const [existingVideoRemoved, setExistingVideoRemoved] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/image-setup/all-categories`, {
//           withCredentials: true,
//         });
//         if (res.data && Array.isArray(res.data.data)) {
//           setCategories(res.data.data);
//         }
//       } catch (error) {
//         console.error("Failed to fetch categories:", error);
//         showModal("error", "Failed to fetch categories"); // ✅ Updated
//       }
//     };

//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (!id) return;

//     const fetchVideo = async () => {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/image-setup/video/${id}`, {
//           withCredentials: true,
//         });

//         if (res.data.success && res.data.video) {
//           const video = res.data.video;

//           setFormData({
//             en_title: video.en_title || "",
//             od_title: video.od_title || "",
//             category_id: video.category_id?.toString() || "",
//             videoSourceType: video.videotype === "link" ? "link" : "upload",
//             videoFile: null,
//             videoLink: video.videotype === "link" ? video.videolink || "" : "",
//           });

//           setExistingVideoUrl(video.video_url || "");
//           setExistingVideoRemoved(false);
//         } else {
//           showModal("error", "Failed to load video data"); // ✅ Updated
//           navigate("/admin/image-setup/video-galary");
//         }
//       } catch (error) {
//         console.error("Failed to fetch video:", error);
//         showModal("error", "Error loading video data"); // ✅ Updated
//         navigate("/admin/image-setup/video-galary");
//       }
//     };

//     fetchVideo();
//   }, [id, navigate]);

//   useEffect(() => {
//     return () => {
//       if (videoPreviewUrl) {
//         URL.revokeObjectURL(videoPreviewUrl);
//       }
//     };
//   }, [videoPreviewUrl]);

//   const handleCancel = () => {
//     navigate("/admin/image-setup/video-galary");
//   };

//   const handleVideoFileChange = (file, errorMessage) => {
//     if (errorMessage) {
//       setErrors((prev) => ({ ...prev, videoFile: errorMessage }));
//       setFormData((prev) => ({ ...prev, videoFile: null }));
//       setVideoPreviewUrl(null);
//     } else {
//       setErrors((prev) => ({ ...prev, videoFile: "" }));
//       setFormData((prev) => ({ ...prev, videoFile: file }));
//       setExistingVideoRemoved(false);

//       const previewURL = URL.createObjectURL(file);
//       setVideoPreviewUrl(previewURL);
//     }
//   };

//   const handleRemoveExistingVideo = () => {
//     setExistingVideoUrl("");
//     setFormData((prev) => ({ ...prev, videoFile: null, videoLink: "" }));
//     setExistingVideoRemoved(true);
//     setErrors((prev) => ({ ...prev, videoFile: "", videoLink: "" }));
//     setVideoPreviewUrl(null);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "videoSourceType") {
//       setFormData((prev) => ({
//         ...prev,
//         videoSourceType: value,
//         videoFile: null,
//         videoLink: "",
//       }));
//       setVideoPreviewUrl(null);
//       setExistingVideoRemoved(false);
//       setErrors({});
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       en_title: "",
//       od_title: "",
//       category_id: "",
//       videoSourceType: "upload",
//       videoFile: null,
//       videoLink: "",
//     });
//     setErrors({});
//     setExistingVideoUrl("");
//     setExistingVideoRemoved(false);
//     setVideoPreviewUrl(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     if (!formData.en_title.trim()) newErrors.en_title = "Title (EN) is required";
//     if (!formData.od_title.trim()) newErrors.od_title = "Title (OD) is required";
//     if (!formData.category_id) newErrors.category_id = "Category is required";

//     if (!id) {
//       if (formData.videoSourceType === "upload") {
//         if (!formData.videoFile) {
//           newErrors.videoFile = "Please upload a video file";
//         }
//       } else if (formData.videoSourceType === "link") {
//         if (!formData.videoLink.trim()) {
//           newErrors.videoLink = "Please enter a video link";
//         }
//       }
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const form = new FormData();
//       form.append("en_title", formData.en_title);
//       form.append("od_title", formData.od_title);
//       form.append("category_id", formData.category_id);
//       form.append("videotype", formData.videoSourceType === "upload" ? "file" : "link");

//       if (formData.videoSourceType === "upload") {
//         if (formData.videoFile) {
//           form.append("video", formData.videoFile);
//         } else if (id && existingVideoRemoved) {
//           form.append("video", "");
//         }
//       } else if (formData.videoSourceType === "link") {
//         form.append("videolink", formData.videoLink.trim());
//       }

//       let res;
//       if (id) {
//         res = await axios.put(`${API_BASE_URL}/image-setup/update-video/${id}`, form, {
//           headers: { "Content-Type": "multipart/form-data" },
//           withCredentials: true,
//         });
//       } else {
//         res = await axios.post(`${API_BASE_URL}/image-setup/register-video`, form, {
//           headers: { "Content-Type": "multipart/form-data" },
//           withCredentials: true,
//         });
//       }

//       if (res.data.success) {
//         showModal("success", id ? "Video updated successfully!" : "Video registered successfully!"); // ✅ Updated
//         navigate("/admin/image-setup/video-galary");
//       } else {
//         showModal("error", "Something went wrong: " + res.data.message); // ✅ Updated
//       }
//     } catch (error) {
//       console.error("Error submitting video:", error);
//       showModal("error", "An error occurred while submitting the video."); // ✅ Updated
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="mx-auto p-6 min-h-[80vh]">
//       <div className="bg-white p-6 rounded">
//         <Header title={id ? "Edit Video Gallery Item" : "Add Video Gallery Item"} onGoBack={handleCancel} />

//         <form onSubmit={handleSubmit} encType="multipart/form-data">
//           {/* Title (EN) */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Title (In English)</label>
//             <input
//               type="text"
//               name="en_title"
//               value={formData.en_title}
//               onChange={handleChange}
//               className="mt-1 block w-full border rounded px-2 py-1"
//             />
//             {errors.en_title && <p className="text-red-600 text-sm">{errors.en_title}</p>}
//           </div>

//           {/* Title (OD) */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Title (In Odia)</label>
//             <input
//               type="text"
//               name="od_title"
//               value={formData.od_title}
//               onChange={handleChange}
//               className="mt-1 block w-full border rounded px-2 py-1"
//             />
//             {errors.od_title && <p className="text-red-600 text-sm">{errors.od_title}</p>}
//           </div>

//           {/* Category */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Category</label>
//             <select
//               name="category_id"
//               value={formData.category_id}
//               onChange={handleChange}
//               className="mt-1 block w-full border rounded px-2 py-1"
//             >
//               <option value="">-- Select Category --</option>
//               {categories
//                 .filter((cat) => cat.category_type === "video")
//                 .map((cat) => (
//                   <option key={cat.id} value={cat.id}>
//                     {cat.en_category}
//                   </option>
//                 ))}
//             </select>
//             {errors.category_id && <p className="text-red-600 text-sm">{errors.category_id}</p>}
//           </div>

//           {/* Video Source Type */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Video Source Type</label>
//             <label className="inline-flex items-center mr-6">
//               <input
//                 type="radio"
//                 name="videoSourceType"
//                 value="upload"
//                 checked={formData.videoSourceType === "upload"}
//                 onChange={handleChange}
//               />
//               <span className="ml-2">Upload File</span>
//             </label>
//             <label className="inline-flex items-center">
//               <input
//                 type="radio"
//                 name="videoSourceType"
//                 value="link"
//                 checked={formData.videoSourceType === "link"}
//                 onChange={handleChange}
//               />
//               <span className="ml-2">Paste Link</span>
//             </label>
//           </div>

//           {/* Upload or Link Input */}
//           {formData.videoSourceType === "upload" ? (
//             <div className="mb-6">
//               <DocumentUploader
//                 label="Upload Video"
//                 onFileChange={handleVideoFileChange}
//                 allowedTypes={["video/mp4", "video/webm", "video/ogg", "video/mov", "video/avi", "video/mkv"]}
//                 maxSizeMB={100}
//                 error={errors.videoFile}
//               />
//               {videoPreviewUrl && (
//                 <div className="mt-4">
//                   <p className="text-sm font-medium text-gray-700 mb-1">Video Preview:</p>
//                   <video src={videoPreviewUrl} controls className="w-full max-w-md rounded border" />
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Paste Video Link</label>
//               <input
//                 type="text"
//                 name="videoLink"
//                 value={formData.videoLink}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border rounded px-2 py-1"
//                 placeholder="https://"
//               />
//               {errors.videoLink && <p className="text-red-600 text-sm">{errors.videoLink}</p>}
//             </div>
//           )}

//           {/* Remove Existing Video */}
//           {existingVideoUrl && !existingVideoRemoved && (
//             <div className="mb-6">
//               <button
//                 type="button"
//                 onClick={handleRemoveExistingVideo}
//                 className="text-sm text-red-600 underline hover:text-red-800"
//               >
//                 Remove Existing Video
//               </button>
//             </div>
//           )}

//           {/* ✅ Updated FormActions with isSubmitting */}
//           <FormActions
//             isSubmitting={isSubmitting}
//             onCancel={handleCancel}
//             onReset={handleReset}
//           />
//         </form>
//       </div>
//     </div>
//   );
// };

// export default VideoGalleryForm;



import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../Components/Admin/Add/Header";
import axios from "axios";
import DocumentUploader from "../../../Components/Admin/TextEditor/DocumentUploader";
import FormActions from "@/Components/Admin/Add/FormActions";
import { useModal } from "@/context/ModalProvider";

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

  // New state to keep initial fetched data for reset
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
        const res = await axios.get(`${API_BASE_URL}/image-setup/all-categories`, {
          withCredentials: true,
        });
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
      setInitialData(null); // Clear initial data on create mode
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
          setInitialData(fetchedData); // Store fetched data for reset
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

  const handleVideoFileChange = (file, errorMessage) => {
    if (errorMessage) {
      setErrors((prev) => ({ ...prev, videoFile: errorMessage }));
      setFormData((prev) => ({ ...prev, videoFile: null }));
      setVideoPreviewUrl(null);
    } else {
      setErrors((prev) => ({ ...prev, videoFile: "" }));
      setFormData((prev) => ({ ...prev, videoFile: file }));
      setExistingVideoRemoved(false);

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

  const handleChange = (e) => {
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

  // Updated handleReset to use initialData in edit mode, else clear form
  const handleReset = () => {
    if (initialData) {
      setFormData(initialData);
      setExistingVideoRemoved(false);
      setVideoPreviewUrl(null);
      setErrors({});
      // Reset existingVideoUrl to initial video url as well
      if (id) {
        setExistingVideoUrl(initialData.videoSourceType === "upload" ? existingVideoUrl : "");
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

    if (!id) {
      if (formData.videoSourceType === "upload") {
        if (!formData.videoFile) {
          newErrors.videoFile = "Please upload a video file";
        }
      } else if (formData.videoSourceType === "link") {
        if (!formData.videoLink.trim()) {
          newErrors.videoLink = "Please enter a video link";
        }
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

      let res;
      if (id) {
        res = await axios.put(`${API_BASE_URL}/image-setup/update-video/${id}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
      } else {
        res = await axios.post(`${API_BASE_URL}/image-setup/register-video`, form, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
      }

      if (res.data.success) {
        showModal("success", id ? "Video updated successfully!" : "Video registered successfully!");
        navigate("/admin/image-setup/video-galary");
      } else {
        showModal("error", "Something went wrong: " + res.data.message);
      }
    } catch (error) {
      console.error("Error submitting video:", error);
      showModal("error", "An error occurred while submitting the video.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto p-6 min-h-[80vh]">
      <div className="bg-white p-6 rounded">
        <Header title={id ? "Edit Video Gallery Item" : "Add Video Gallery Item"} onGoBack={handleCancel} />

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Title (EN) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title (In English)</label>
            <input
              type="text"
              name="en_title"
              value={formData.en_title}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-2 py-1"
            />
            {errors.en_title && <p className="text-red-600 text-sm">{errors.en_title}</p>}
          </div>

          {/* Title (OD) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title (In Odia)</label>
            <input
              type="text"
              name="od_title"
              value={formData.od_title}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-2 py-1"
            />
            {errors.od_title && <p className="text-red-600 text-sm">{errors.od_title}</p>}
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-2 py-1"
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
            {errors.category_id && <p className="text-red-600 text-sm">{errors.category_id}</p>}
          </div>

          {/* Video Source Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Video Source Type</label>
            <label className="inline-flex items-center mr-6">
              <input
                type="radio"
                name="videoSourceType"
                value="upload"
                checked={formData.videoSourceType === "upload"}
                onChange={handleChange}
              />
              <span className="ml-2">Upload File</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="videoSourceType"
                value="link"
                checked={formData.videoSourceType === "link"}
                onChange={handleChange}
              />
              <span className="ml-2">Paste Link</span>
            </label>
          </div>

          {/* Upload or Link Input */}
          {formData.videoSourceType === "upload" ? (
            <div className="mb-6">
              <DocumentUploader
                label="Upload Video"
                onFileChange={handleVideoFileChange}
                allowedTypes={["video/mp4", "video/webm", "video/ogg", "video/mov", "video/avi", "video/mkv"]}
                maxSizeMB={100}
                error={errors.videoFile}
              />
              {videoPreviewUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Video Preview:</p>
                  <video src={videoPreviewUrl} controls className="w-full max-w-md rounded border" />
                </div>
              )}
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Paste Video Link</label>
              <input
                type="text"
                name="videoLink"
                value={formData.videoLink}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-2 py-1"
                placeholder="https://"
              />
              {errors.videoLink && <p className="text-red-600 text-sm">{errors.videoLink}</p>}
            </div>
          )}

          {/* Remove Existing Video */}
          {existingVideoUrl && !existingVideoRemoved && (
            <div className="mb-6">
              <button
                type="button"
                onClick={handleRemoveExistingVideo}
                className="text-sm text-red-600 underline hover:text-red-800"
              >
                Remove Existing Video
              </button>
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
