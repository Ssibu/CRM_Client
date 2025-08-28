import React from "react";
import RichTextEditor from "../../Components/TextEditor/RichTextEditor";

const DescriptionFields = ({ formData, onInputChange }) => (
  <>
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        ବିବରଣୀ (ଇଂରାଜୀରେ) / Description (In English) *
      </label>
      <RichTextEditor
        value={formData.descriptionEnglish}
        onChange={(val) => onInputChange("descriptionEnglish", val)}
        placeholder="Enter description in English..."
      />
    </div>

    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        ବିବରଣୀ (ଓଡ଼ିଆରେ) / Description (In Odia) *
      </label>
      <RichTextEditor
        value={formData.descriptionOdia}
        onChange={(val) => onInputChange("descriptionOdia", val)}
        placeholder="Enter description in Odia..."
      />
    </div>
  </>
);

export default DescriptionFields;
