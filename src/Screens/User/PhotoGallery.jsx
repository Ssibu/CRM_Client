import React, { useEffect, useState } from "react";
import axios from "axios";

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/image/allimages`);
        const data = response.data;

        const formattedPhotos = data.data.map((photo) => ({
          title: photo.title_en,
          url: photo.photo_url || photo.photolink || "",
        }));

        setPhotos(formattedPhotos);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Error fetching photos");
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  if (loading) return <div className="text-center mt-8">Loading photos...</div>;
  
  if (error)
    return (
      <div className="text-center mt-8 text-red-600">
        Error: {error}
      </div>
    );

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-6xl mx-auto mt-8">
      <h1 className="text-3xl font-semibold text-[#49608c] mb-6">Photo Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="rounded-lg shadow-md overflow-hidden bg-gray-100"
          >
            {photo.url ? (
              <img
                src={photo.url}
                alt={photo.title || `Photo ${index + 1}`}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-gray-300 text-gray-600">
                No image available
              </div>
            )}
            <div className="bg-blue-900 text-white text-center py-2 font-medium">
              {photo.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;
