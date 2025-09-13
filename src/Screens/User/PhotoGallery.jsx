
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PhotoGallery = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/image/allcategories?type=photo`);
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
      <h1 className="text-3xl font-semibold text-[#49608c] mb-6">Photo Gallery</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-lg shadow-md overflow-hidden bg-gray-100 cursor-pointer hover:scale-105 transition"
            onClick={() => navigate(`/subpage/photo-gallery/${cat.id}`)}
          >
            {cat.thumbnail_url ? (
              <img
                src={cat.thumbnail_url}
                alt={cat.en_category}
                className="w-full h-48 object-contain"
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

export default PhotoGallery;
