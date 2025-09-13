import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CategoryVideos = () => {
  const { id } = useParams(); // category ID
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/user/video/list?category_id=${id}`
        );

        const formattedVideos = res.data.data.map((video) => ({
          title: video.en_title,
          url: video.video_url,
        }));

        setVideos(formattedVideos);
      } catch (err) {
        setError(err.message || "Error fetching videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [id]);

  if (loading) return <div className="text-center mt-8">Loading videos...</div>;
  if (error)
    return (
      <div className="text-center mt-8 text-red-600">
        Error: {error}
      </div>
    );

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-semibold text-[#49608c] mb-6">Videos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map((video, index) => (
          <div key={index} className="rounded-lg shadow-md overflow-hidden bg-gray-100">
            {video.url ? (
              <video
                controls
                  preload="metadata"
                className="w-full h-48 object-contain"
              
              >
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-gray-300 text-gray-600">
                No video available
              </div>
            )}
            {/* <div className="bg-blue-900 text-white text-center py-2 font-medium">
              {video.title}
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryVideos;
