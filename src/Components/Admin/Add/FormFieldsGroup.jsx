import React from "react";
import FormField from "../../Components/TextEditor/FormField";
import ImageUploader from "../../Components/TextEditor/ImageUploader";

const FormFieldsGroup = ({
  formData,
  onInputChange,
  onImageChange,
  isLoadingImage,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <FormField
      label="ଶିରୋନାମ (ଇଂରାଜୀରେ) / Title (In English)"
      placeholder="Title in English"
      value={formData.en_title}
      onChange={(val) => onInputChange("en_title", val)}
      required
    />

    <FormField
      label="ଶିରୋନାମ (ଓଡ଼ିଆରେ) / Title (In Odia)"
      placeholder="Title in Odia"
      value={formData.od_title}
      onChange={(val) => onInputChange("od_title", val)}
      required
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full md:col-span-2">
      <ImageUploader
        file={formData.image}
        onChange={onImageChange}
        isLoading={isLoadingImage}
      />

      <FormField
        label="ଲିଙ୍କ୍ (ଇଚ୍ଛାମୁତାବକ) / Link (Optional)"
        placeholder="https://example.com"
        value={formData.link}
        onChange={(val) => onInputChange("link", val)}
        type="url"
      />
    </div>
  </div>
);

export default FormFieldsGroup;
