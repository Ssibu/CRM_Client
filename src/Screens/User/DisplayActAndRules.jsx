import React, { useEffect, useState, useRef } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import axios from 'axios';
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';

const DisplayActAndRules = () => {
  const [actsData, setActsData] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { translate } = useGlobalTranslation();

  const toggleItem = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  useEffect(() => {
    const fetchActs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/acts-rules');
        setActsData(response.data);
      } catch (err) {
        console.error('Error fetching Acts & Rules:', err);
        setError(translate('failedToLoadData') || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchActs();
  }, [translate]);

  return (
    <div className="max-w-2xl w-full mx-auto mt-6 px-4">
      <h2 className="text-xl font-semibold text-center mb-4">
        {translate('actsAndRules') || 'Acts & Rules'}
      </h2>

      {loading && (
        <div className="text-center text-sm text-gray-500">
          {translate('loading') || 'Loading...'}
        </div>
      )}
      {error && (
        <div className="text-center text-sm text-red-500">
          {error}
        </div>
      )}

      {!loading && actsData.length === 0 && (
        <div className="text-center text-sm text-gray-500">
          {translate('noRecordsFound') || 'No records found'}
        </div>
      )}

      <div className="space-y-2">
        {actsData.map((item) => {
          const isExpanded = expandedId === item.id;

          return (
            <AccordionItem
              key={item.id}
              title={translate(item, 'title') || item.en_title || '—'}
              description={translate(item, 'description') || item.en_description || ''}
              isExpanded={isExpanded}
              onToggle={() => toggleItem(item.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

const AccordionItem = ({ title, description, isExpanded, onToggle }) => {
  const contentRef = useRef(null);

  return (
    <div className="border border-gray-300 rounded-md shadow-sm transition duration-200">
      <div
        onClick={onToggle}
        className={`flex justify-between items-center px-4 py-2 cursor-pointer ${
          isExpanded ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800'
        }`}
      >
        <span className="text-sm font-medium">{title}</span>
        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      <div
        ref={contentRef}
        style={{
          maxHeight: isExpanded ? `${contentRef.current?.scrollHeight}px` : '0px',
        }}
        className="overflow-hidden transition-all duration-300 bg-white px-4 border-t text-sm text-gray-700"
      >
        <div className="py-3 leading-relaxed">{description}</div>
      </div>
    </div>
  );
};

export default DisplayActAndRules;
