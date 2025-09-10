import React, { useEffect, useState } from "react";
import { Link2 } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

const FooterLinkPage = ({ category }) => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  if (!category) return; 

  setLoading(true);
  setError(null);

  axios
    .get(`${import.meta.env.VITE_API_BASE_URL}/api/footer-links/${category}`)
    .then((res) => {
      setLinks(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching footer links:", err);
      setError("Failed to load links. Please try again.");
      setLoading(false);
    });
}, [category]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {category} Links
      </h1>

      {loading && <p>Loading links...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && links.length === 0 && (
        <p>No links found for this category.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-4 rounded-xl shadow bg-white "
          >
            <Link2 className="text-blue-500" />
            <span className="text-blue-700">{link.title}</span>
          </a>
        ))}
      </div>

      <div className="mt-6">
        <Link to="/" className="text-blue-500 underline">
          
        </Link>
      </div>
    </div>
  );
};

export default FooterLinkPage;
