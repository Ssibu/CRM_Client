import React, { useState } from "react";
import { motion } from "framer-motion";

import Header from "../../Components/Add//Header";
import FormFieldsGroup from "../../Components/Add/FormFieldsGroup";
import DescriptionFields from "../../Components/Add//DescriptionFields";
import FormActions from "../../Components/Add//FormActions";

const AddMenuForm = () => {
  const [formData, setFormData] = useState({
    titleEnglish: "",
    titleOdia: "",
    descriptionEnglish: "",
    descriptionOdia: "",
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
      ["Title (English)", formData.titleEnglish],
      ["Title (Odia)", formData.titleOdia],
      ["Description (English)", formData.descriptionEnglish],
      ["Description (Odia)", formData.descriptionOdia],
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
      titleEnglish: "",
      titleOdia: "",
      descriptionEnglish: "",
      descriptionOdia: "",
      link: "",
      image: null,
    });
    setIsLoadingImage(false);
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Header title={"Add Menu"} onGoBack={handleGoBack} />

      <form onSubmit={handleSubmit}>
        <FormFieldsGroup
          formData={formData}                  
          onInputChange={handleInputChange}
          onImageChange={handleImageChange}
          isLoadingImage={isLoadingImage}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <DescriptionFields formData={formData} onInputChange={handleInputChange} />
        </div>

        <FormActions
          onSubmit={handleSubmit}
          onReset={handleReset}
          onCancel={handleGoBack}
          isSubmitting={false}
        />
      </form>
    </motion.div>
  );
};

export default AddMenuForm;
