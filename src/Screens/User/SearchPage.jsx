import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search,  ServerCrash, FileText, Newspaper } from 'lucide-react';
import Spinner from '@/Components/User/UI/Spinner';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/search?q=${query}`);
      setResults(response.data);
    } catch (err) {
      setError('Failed to fetch search results. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const getIconForType = (type) => {
    switch(type) {
      case 'Page':
        return <FileText className="text-blue-500" />;
      case 'News & Event':
        return <Newspaper className="text-green-500" />;
      default:
        return <FileText className="text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 font-sans min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Search Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Site Search</h1>
          <p className="text-gray-600">Find pages, news, and documents across the site.</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 mb-8 sticky top-4 z-10">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your search query..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition flex items-center gap-2"
          >
            {loading ? <Spinner color='white' /> : <Search />}
            <span>Search</span>
          </button>
        </form>

        {/* Results Section */}
        <div className="space-y-4">
          {loading && (
            <div className="text-center p-8">
              <Spinner className="mx-auto" />
              <p className="mt-4 text-gray-600">Searching...</p>
            </div>
          )}

          {error && (
            <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
              <ServerCrash className="w-12 h-12 text-red-500 mx-auto" />
              <p className="mt-4 text-red-700 font-medium">{error}</p>
            </div>
          )}

          {!loading && !error && hasSearched && results.length === 0 && (
             <div className="text-center p-8 bg-gray-50 border border-gray-200 rounded-lg">
               <h3 className="text-xl font-semibold text-gray-700">No Results Found</h3>
               <p className="text-gray-500 mt-2">Try a different search term.</p>
             </div>
          )}

          {!loading && !error && results.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Found {results.length} result(s) for "{query}"
              </h3>
              <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
                {results.map((result) => (
                  <li key={result.id}>
                    <Link 
                      to={result.url} 
                      className="block p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">{getIconForType(result.type)}</div>
                        <div>
                          <p className="font-semibold text-blue-700">{result.title}</p>
                          <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full">{result.type}</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;