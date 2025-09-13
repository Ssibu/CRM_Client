// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const VideoGallery = () => {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/user/video/allvideos")
//       .then((response) => {
//         const data = response.data;
//         const formattedVideos = data.data.map((video) => ({
//           title: video.title_en,
//           url: video.videolink || video.video_url || video.videofile || "",
//         }));
//         setVideos(formattedVideos);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message || "Error fetching videos");
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <div className="text-center mt-8">Loading videos...</div>;
//   if (error)
//     return (
//       <div className="text-center mt-8 text-red-600">
//         Error: {error}
//       </div>
//     );

//   return (
//     <div className="bg-white shadow rounded-lg p-6 max-w-6xl mx-auto mt-8">
//       <h1 className="text-3xl font-semibold text-[#49608c] mb-6">Video Gallery</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {videos.map((video, index) => (
//           <div
//             key={index}
//             className="rounded-lg shadow-md overflow-hidden bg-gray-100"
//           >
//             {video.url ? (
//               <video
//                 controls
//                 className="w-full h-48 object-cover"
//                 preload="metadata"
//               >
//                 <source src={video.url} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//             ) : (
//               <div className="w-full h-48 flex items-center justify-center bg-gray-300 text-gray-600">
//                 No video available
//               </div>
//             )}
//             <div className="bg-blue-900 text-white text-center py-2 font-medium">
//               {video.title}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default VideoGallery;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VideoGallery = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/user/video/allcategories?type=video`
        );
        setCategories(res.data.data);
      } catch (err) {
        console.error("Error fetching categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <div className="text-center mt-8">Loading categories...</div>;

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-semibold text-[#49608c] mb-6">Video Categories</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-lg shadow-md overflow-hidden bg-gray-100 cursor-pointer hover:scale-105 transition"
            onClick={() => navigate(`/subpage/video-gallery/${cat.id}`)}
          >
            {cat.thumbnail_url ? (
              <img
                src={cat.thumbnail_url}
                alt={cat.en_category}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-gray-300 text-gray-600">
                No Thumbnail
              </div>
            )}
            <div className="bg-blue-900 text-white text-center py-2 font-medium">
              {cat.en_category}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGallery;
