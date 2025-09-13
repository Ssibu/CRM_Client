import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

import FormField from "../../Components/Admin/TextEditor/FormField";
import RichTextEditor from "../../Components/Admin/TextEditor/RichTextEditor";
import ImageUploader from "../../Components/Admin/TextEditor/ImageUploader";

const AddButton = () => {
  const [formData, setFormData] = useState({
    en_title: "",
    od_title: "",
    en_description: "",
    od_description: "",
    link: "",
    image: null,
  });

  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (file, loading) => {
    setIsLoadingImage(loading);
    handleInputChange("image", file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = [
      ["Title (English)", formData.en_title],
      ["Title (Odia)", formData.od_title],
      ["Description (English)", formData.en_description],
      ["Description (Odia)", formData.od_description],
    ];
    for (const [name, value] of requiredFields) {
      if (!value.trim()) {
        alert(`${name} is required`);
        return;
      }
    }
    console.log("Form submitted:", formData);
    alert("Form submitted successfully!");
  };

  const handleReset = () => {
    setFormData({
      en_title: "",
      od_title: "",
      en_description: "",
      od_description: "",
      link: "",
      image: null,
    });
    setIsLoadingImage(false);
  };

  return (
    <div
      className="min-h-screen bg-gray-50 p-6"
   
    >
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-black">Add Menu</h1>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-4 py-2 rounded-md font-medium flex items-center gap-2 transition">
          <ArrowLeft size={16} />
          Go Back
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            label="ଶିରୋନାମ (ଇଂରାଜୀରେ) / Title (In English)"
            placeholder="Title in English"
            value={formData.en_title}
            onChange={(val) => handleInputChange("en_title", val)}
            required
          />

          <FormField
            label="ଶିରୋନାମ (ଓଡ଼ିଆରେ) / Title (In Odia)"
            placeholder="Title in Odia"
            value={formData.od_title}
            onChange={(val) => handleInputChange("od_title", val)}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full md:col-span-2">
            <ImageUploader
              file={formData.image}
              onChange={handleImageChange}
              isLoading={isLoadingImage}
            />

            <FormField
              label="ଲିଙ୍କ୍ (ଇଚ୍ଛାମୁତାବକ) / Link (Optional)"
              placeholder="https://example.com"
              value={formData.link}
              onChange={(val) => handleInputChange("link", val)}
              type="url"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ବିବରଣୀ (ଇଂରାଜୀରେ) / Description (In English) *
            </label>
            <RichTextEditor
              value={formData.en_description}
              onChange={(val) => handleInputChange("en_description", val)}
              placeholder="Enter description in English..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ବିବରଣୀ (ଓଡ଼ିଆରେ) / Description (In Odia) *
            </label>
            <RichTextEditor
              value={formData.od_description}
              onChange={(val) => handleInputChange("od_description", val)}
              placeholder="Enter description in Odia..."
            />
          </div>
        </div>

        <div className="flex items-center gap-4 mt-8">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-all"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-all"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddButton;
