// import React from "react";

// const FormActions = ({  onReset, onCancel, isSubmitting }) => (
//   <div className="flex items-center gap-4 mt-8">
//     <button
//       type="submit"
//       disabled={isSubmitting}
//       className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-all disabled:opacity-50"
      
//     >
//       Submit
//     </button>
//     <button
//       type="button"
//       onClick={onReset}
//       className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-all"
//     >
//       Reset
//     </button>
//     <button
//       type="button"
//       onClick={onCancel}
//       className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-all"
//     >
//       Cancel
//     </button>
//   </div>
// );

// export default FormActions;



import React from "react";

const FormActions = ({ onReset, onCancel, isSubmitting, onSubmit }) => (
  <div className="flex items-center gap-4 mt-8">
    {/* Always show Submit */}
    <button
      type="submit"
      onClick={onSubmit}
      disabled={isSubmitting}
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-all disabled:opacity-50"
    >
      Submit
    </button>

    {/* Render Reset only if onReset is passed */}
    {onReset && (
      <button
        type="button"
        onClick={onReset}
        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-all"
      >
        Reset
      </button>
    )}

    {/* Render Cancel only if onCancel is passed */}
    {onCancel && (
      <button
        type="button"
        onClick={onCancel}
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-all"
      >
        Cancel
      </button>
    )}
  </div>
);

export default FormActions;
