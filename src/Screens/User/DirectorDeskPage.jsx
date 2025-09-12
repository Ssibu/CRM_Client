


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useGlobalTranslation } from "@/hooks/useGlobalTranslation"; 

// export default function PublicDirectorDeskPage() {
//   const { language, translate } = useGlobalTranslation();
//   const [desk, setDesk] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Fetch director desk data with language param
//     axios
//       .get(`http://localhost:5000/public/director-desk`)
//       .then((res) => {
//         console.log("API Response:", res.data);
//         setDesk(res.data || null);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching director desk:", err);
//         setLoading(false);
//       });
//   }, [language]); // refetch when language changes

//   if (loading)
//     return <p className="text-center py-10">Loading...</p>;

//   if (!desk)
//     return (
//       <p className="text-center py-10 text-red-500">
//         No director record found.
//       </p>
//     );

//   // Translate dynamic API fields safely
//   const directorName = translate(desk, "director_name") || "";
//   const title = translate(desk, "title") || "";
//   const designation = translate(desk, "designation") || "";
//   const message = translate(desk, "message") || "";

//   return (
//     <div className="max-w-6xl mx-auto px-6 py-10">
//       <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row gap-8 items-start">

//         {/* Left: Director Photo */}
//         {desk.photo && (
//           <img
//             src={`http://localhost:5000/uploads/director-desk/${desk.photo}`}
//             alt={directorName}
//             className="w-48 h-48 object-cover rounded-full mb-4 border"
//           />
//         )}

//         {/* Right: Name + Description + Designation */}
//         <div className="flex-1">
//           <h2 className="text-2xl font-semibold text-[#6260d9] mb-3">
//             {directorName}
//           </h2>

//           {/* Cleaned message without HTML tags */}
//           {/* <div className="text-gray-700 leading-relaxed text-justify mb-4">
//             {(message || "")
//               .replace(/<br\s*\/?>/gi, "\n")
//               .replace(/<div>|<\/div>/gi, "\n")
//               .trim()
//               .split("\n")
//               .map((line, index) => (
//                 <p key={index}>{line}</p>
//               ))
//             }
//           </div> */} {message}

//           <p className="text-gray-600 italic">
//             {title} – {designation}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import { useGlobalTranslation } from "@/hooks/useGlobalTranslation";

export default function PublicDirectorDeskPage() {
  const { language, translate } = useGlobalTranslation();
  const [desk, setDesk] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDesk = async () => {
      try {
        const res = await axios.get("http://localhost:5000/public/director-desk");
        setDesk(res.data || null);
      } catch (err) {
        console.error("Error fetching director desk:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDesk();
  }, [language]);

  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  if (!desk) {
    return (
      <p className="text-center py-10 text-red-500">
        No director record found.
      </p>
    );
  }

  // Translate fields
  const directorName = translate(desk, "director_name") || "";
  const title = translate(desk, "title") || "";
  const designation = translate(desk, "designation") || "";
  const message = translate(desk, "message") || "";

  // Sanitize HTML safely
  const cleanMessage = DOMPurify.sanitize(message);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row gap-8 items-start">
        {/* Left: Director Photo */}
        {desk.photo && (
          <img
            src={`http://localhost:5000/uploads/director-desk/${desk.photo}`}
            alt={directorName}
            className="w-48 h-48 object-cover rounded-full mb-4 border"
          />
        )}

        {/* Right: Content */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-[#6260d9] mb-3">
            {directorName}
          </h2>

          <div
            className="text-gray-700 leading-relaxed text-justify mb-4"
            dangerouslySetInnerHTML={{ __html: cleanMessage }}
          />

          <p className="text-gray-600 italic">
            {title} – {designation}
          </p>
        </div>
      </div>
    </div>
  );
}
