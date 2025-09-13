import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FaSearch, FaChevronDown, FaFilter } from 'react-icons/fa';

// --- Using ONLY your existing imports ---
import scrollBackground from "@/assets/images/scroll-background.png";
import divider from "@/assets/images/divider.png";
import calendarIcon from "@/assets/images/calendar-icon.png";
import scalesIcon from "@/assets/images/scales-icon.png";
import Vector2 from "@/assets/images/Vector2.png";

// --- Assuming this hook is correctly set up in your project ---
import { useGlobalTranslation } from "@/hooks/useGlobalTranslation";

const ActsAndRulesPage = () => {
  const [actsData, setActsData] = useState([]);
  const [selectedAct, setSelectedAct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ✅ Instantiating the translation hook
  const { translate, language } = useGlobalTranslation();

  useEffect(() => {
    const fetchActs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/acts-rules`, {
          params: { search: searchTerm }, 
        });
        const sortedData = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setActsData(sortedData);
        if (sortedData.length > 0) {
          setSelectedAct(sortedData[0]);
        } else {
          setSelectedAct(null);
        }
      } catch (err) {
        console.error("Error fetching Acts & Rules:", err);
        // ✅ Using translate for the error message
        setError(translate("failed-to-load-data"));
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchActs();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, translate]); // Added translate to dependency array

  const filteredAndSortedActs = useMemo(() => {
    let processableData = [...actsData];
    // Sorting is now handled on the frontend from the fetched server results
    processableData.sort((a, b) => {
      if (sortConfig.key === "date") {
        return sortConfig.direction === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      if (sortConfig.key === "alphabetical") {
        const titleA = a[`${language}_title`] || "";
        const titleB = b[`${language}_title`] || "";
        return sortConfig.direction === "asc"
          ? titleA.localeCompare(titleB)
          : titleB.localeCompare(titleA);
      }
      return 0;
    });
    return processableData;
  }, [actsData, sortConfig, language]);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';
    return new Date(dateString).toLocaleDateString("en-US", { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #a8a29e; border-radius: 20px; }
      `}</style>

      <div className="min-h-screen p-6">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT PANEL */}
          <div className="lg:col-span-5">
            <h1 className="text-5xl md:text-7xl font-bold text-[#4B00E8]">
              {/* ✅ TRANSLATED */}
              {translate("acts-and-rules")}
            </h1>
          

            <div className="relative mt-6">
              <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                // ✅ TRANSLATED
                placeholder={translate("search-by-title")}
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full p-3 pl-10 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none" 
              />
            </div>
            
            <div className="mt-4 p-4 border border-purple-200 rounded-lg bg-white/50">
                <p className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-3">
                    <FaFilter />
                    {/* ✅ TRANSLATED */}
                    {translate("filter-by-dates")}
                </p>
                <div className="flex flex-wrap gap-2">
                    {/* ✅ TRANSLATED */}
                    <button onClick={() => setSortConfig({ key: 'date', direction: 'desc' })} className={`px-4 py-1 text-sm border rounded-full ${sortConfig.key === 'date' && sortConfig.direction === 'desc' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300'}`}>{translate("all")}</button>
                    <button onClick={() => setSortConfig({ ...sortConfig, direction: 'asc' })} className={`px-4 py-1 text-sm border rounded-full ${sortConfig.direction === 'asc' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300'}`}>{translate("ascending")}</button>
                    <button onClick={() => setSortConfig({ ...sortConfig, direction: 'desc' })} className={`px-4 py-1 text-sm border rounded-full ${sortConfig.direction === 'desc' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300'}`}>{translate("descending")}</button>
                    <button onClick={() => setSortConfig({ ...sortConfig, key: 'date' })} className={`px-4 py-1 text-sm border rounded-full ${sortConfig.key === 'date' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300'}`}>{translate("date")}</button>
                    <button onClick={() => setSortConfig({ ...sortConfig, key: 'alphabetical' })} className={`px-4 py-1 text-sm border rounded-full ${sortConfig.key === 'alphabetical' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300'}`}>{translate("alphabetically")}</button>
                </div>
            </div>

            <div className="mt-4 space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {loading && <p>{translate("loading")}</p>}
              {error && <p className="text-red-500">{error}</p>}
              {!loading &&
                filteredAndSortedActs.map((act) => (
                  <div key={act.id} onClick={() => setSelectedAct(act)} className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${ selectedAct?.id === act.id ? 'bg-white border-purple-600 shadow-lg' : 'bg-white border-transparent hover:border-purple-400'}`}>
                    <div className="flex items-center gap-3 text-xs text-purple-600">
                        <img src={calendarIcon} alt="date" className="w-4 h-4" />
                        <span>{formatDate(act.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-gray-800">
                        <img src={scalesIcon} alt="law" className="w-7 h-7" />
                        <h3 className="font-semibold">{act[`${language}_title`]}</h3>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-7 relative flex items-center justify-center mt-20">
            {selectedAct && (
              <div className="relative z-10 w-[65%] h-[100%] bg-[#F8F9FF]/90 backdrop-blur-sm rounded-xl shadow-2xl flex flex-col p-6">
                <img
                  src={Vector2}
                  alt="vector"
                  className="absolute inset-0 w-full h-full object-cover opacity-5 pointer-events-none rounded-xl -z-10"
                />
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center gap-3">
                    <img src={scalesIcon} alt="law" className="w-8 h-8 opacity-80" />
                    <h2 className="font-bold text-lg sm:text-xl text-gray-800 px-2 text-center">
                      {selectedAct[`${language}_title`]}
                    </h2>
                    <img src={scalesIcon} alt="law" className="w-8 h-8 opacity-80" />
                  </div>
                </div>
                <div className="flex-grow overflow-y-auto text-gray-700 leading-relaxed custom-scrollbar pr-4 my-4 pt-6">
                  <h4 className="font-bold mb-3 text-gray-900 pl-2">
                    {/* ✅ TRANSLATED */}
                    {translate("detailed-information")}
                  </h4>
                  <div
                    className="pl-2 mt-5"
                    dangerouslySetInnerHTML={{
                      __html: selectedAct[`${language}_description`],
                    }}
                  />
                </div>
                <div className="flex-shrink-0">
                  <img src={divider} alt="divider" className="w-1/2 mx-auto" />
                  <p className="text-right text-sm text-gray-600 mt-4">
                    {formatDate(selectedAct.date)}
                  </p>
                </div>
              </div>
            )}
            {!selectedAct && !loading && (
              <div className="absolute inset-0 flex items-center justify-center z-10 text-gray-500">
                {/* ✅ TRANSLATED */}
                {translate("select-item-prompt")}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ActsAndRulesPage;