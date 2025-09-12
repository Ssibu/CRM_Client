
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';
import Spinner from '@/Components/User/UI/Spinner';
import Error from '../404';

const DynamicPage = () => {
  const { slug } = useParams();
  const { translate } = useGlobalTranslation();

  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setContent(null);

    const fetchContent = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/content/${slug}`
        );
        setContent(response.data);
      } catch (err) {
        setError(err.response?.status === 404 ? <Error/> : 'An error occurred while loading the page.');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchContent();
  }, [slug]);

  if (isLoading) return <div className="container mx-auto py-24 flex justify-center"><Spinner/></div>;
  if (error) return <div className="container mx-auto p-4 text-center text-red-500">{error}</div>;
  if (!content) return null;

  const pageTitle = translate(content, 'title');
  const pageDescription = translate(content, 'description');
  const sanitizedDescription = DOMPurify.sanitize(pageDescription);


  const maxLength = 8000; 
  const isLong = sanitizedDescription.length > maxLength;
  const preview = isLong ? sanitizedDescription.slice(0, maxLength) + "..." : sanitizedDescription;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">{pageTitle}</h1>

      {sanitizedDescription ? (
        <>
          <div
            className="prose lg:prose-xl max-w-none"
            dangerouslySetInnerHTML={{
              __html: expanded ? sanitizedDescription : preview
            }}
          />
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-4 text-blue-600 hover:underline font-medium"
            >
              {expanded ? "Read Less" : "Read More"}
            </button>
          )}
        </>
      ) : (
        content.image_url && (
          <div className="mt-6">
            <img 
              src={content.image_url} 
              alt={pageTitle} 
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
        )
      )}
    </div>
  );
};

export default DynamicPage;

