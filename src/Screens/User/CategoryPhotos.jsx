// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import { useParams } from "react-router-dom";
// // import ImageModal from "@/Components/Admin/ImageModal/ImageModal";
// // const CategoryPhotos = () => {
// //   const { id } = useParams();
// //   const [photos, setPhotos] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchPhotos = async () => {
// //       try {
// //         const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/image/allimages?category_id=${id}`);
// //         setPhotos(res.data.data);
// //       } catch (err) {
// //         console.error("Error fetching photos", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchPhotos();
// //   }, [id]);

// //   if (loading) return <div className="text-center mt-8">Loading photos...</div>;

// //   return (
// //     <div className="bg-white shadow rounded-lg p-6 max-w-6xl mx-auto mt-8">
// //       <h1 className="text-3xl font-semibold text-[#49608c] mb-6">Photos</h1>

// //       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
// //         {photos.map((photo, index) => (
// //           <div key={index} className="rounded-lg shadow-md overflow-hidden bg-gray-100">
// //             {photo.photo_url ? (
// //               <img
// //                 src={photo.photo_url}
// //                 alt={photo.en_title}
// //                 className="w-full h-48 object-cover"
// //               />
// //             ) : (
// //               <div className="w-full h-48 flex items-center justify-center bg-gray-300 text-gray-600">
// //                 No image
// //               </div>
// //             )}
// //             <div className="bg-blue-900 text-white text-center py-2 font-medium">
// //               {photo.en_title}
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );

// // };

// // export default CategoryPhotos;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import ImageModal from "@/Components/Admin/ImageModal/ImageModal";

// const CategoryPhotos = () => {
//   const { id } = useParams();
//   const [photos, setPhotos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedIndex, setSelectedIndex] = useState(null);

//   useEffect(() => {
//     const fetchPhotos = async () => {
//       try {
//         const res = await axios.get(
//           `${import.meta.env.VITE_API_BASE_URL}/user/image/allimages?category_id=${id}`
//         );
//         setPhotos(res.data.data);
//       } catch (err) {
//         console.error("Error fetching photos", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPhotos();
//   }, [id]);

//   if (loading) return <div className="text-center mt-8">Loading photos...</div>;

//   return (
//     <div className="bg-white shadow rounded-lg p-6 max-w-6xl mx-auto mt-8">
//       <h1 className="text-3xl font-semibold text-[#49608c] mb-6">Photos</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {photos.map((photo, index) => (
//           <div
//             key={index}
//             className="rounded-lg shadow-md overflow-hidden bg-gray-100 cursor-pointer"
//             onClick={() => setSelectedIndex(index)}
//           >
//             {photo.photo_url ? (
//               <img
//                 src={photo.photo_url}
//                 alt={photo.en_title}
//                 className="w-full h-48 object-cover"
//               />
//             ) : (
//               <div className="w-full h-48 flex items-center justify-center bg-gray-300 text-gray-600">
//                 No image
//               </div>
//             )}
//             <div className="bg-blue-900 text-white text-center py-2 font-medium">
//               {photo.en_title}
//             </div>
//           </div>
//         ))}
//       </div>

//       {selectedIndex !== null && (
//         <ImageModal
//           photos={photos}
//           currentIndex={selectedIndex}
//           onClose={() => setSelectedIndex(null)}
//           onNext={() =>
//             setSelectedIndex((prev) => (prev + 1) % photos.length)
//           }
//           onPrev={() =>
//             setSelectedIndex((prev) => (prev - 1 + photos.length) % photos.length)
//           }
//         />
//       )}
//     </div>
//   );
// };

// export default CategoryPhotos;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaSearchPlus } from "react-icons/fa";
import ImageModal from "@/Components/User/ImageModal"
// E:\DPH-8sep_new\client\src\Screens\User\ImageModal.jsx
const CategoryPhotos = () => {
  const { id } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/user/image/allimages?category_id=${id}`
        );
        setPhotos(res.data.data);
      } catch (err) {
        console.error("Error fetching photos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [id]);

  if (loading) return <div className="text-center mt-8">Loading photos...</div>;

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-semibold text-[#49608c] mb-6">Photos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="relative rounded-lg shadow-md overflow-hidden bg-gray-100"
          >
            {photo.photo_url ? (
              <img
                src={photo.photo_url}
                alt={photo.en_title}
                className="w-full h-48 object-contain"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-gray-300 text-gray-600">
                No image
              </div>
            )}

            {/* Magnifier Icon */}
            <button
              onClick={() => setSelectedIndex(index)}
              className="absolute bottom-2 right-2 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100 transition"
            >
              <FaSearchPlus className="text-indigo-600" />
            </button>

            <div className="bg-blue-900 text-white text-center py-2 font-medium">
              {photo.en_title}
            </div>
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <ImageModal
          photos={photos}
          currentIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onNext={() => setSelectedIndex((prev) => (prev + 1) % photos.length)}
          onPrev={() =>
            setSelectedIndex((prev) => (prev - 1 + photos.length) % photos.length)
          }
        />
      )}
    </div>
  );
};

export default CategoryPhotos;
