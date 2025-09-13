
// import React, { useState, useEffect } from "react";
// import { FaArrowRightLong } from "react-icons/fa6";
// import boardBg from "@/assets/aboutbg.png";
// import { motion } from "framer-motion";
// import axios from "axios";
// import { Link } from "react-router-dom";

// const formatDate = (dateString) => {
//   if (!dateString) return {};
//   try {
//     const date = new Date(dateString);
//     return {
//       day: date.getDate(),
//       monthYear: date.toLocaleString("default", { month: "short", year: "numeric" }),
//     };
//   } catch (error) {
//     return {};
//   }
// };

// const cardConfigurations = [
//   { key: 'tender', title: 'Tender', slug: 'tenders', folder: 'tenders', dateField: 'date', docField: 'doc' },
//   { key: 'notice', title: 'Notice', slug: 'notice-advertisements', folder: 'notices', dateField: 'date', docField: 'doc' },
//   { key: 'actAndRule', title: 'Act & Rule', slug: 'acts-rules', dateField: 'createdAt' },
//   { key: 'newsAndEvent', title: 'News & Event', slug: 'news-events', folder: 'events', dateField: 'eventDate', docField: 'document' },
// ];

// export default function Board() {
//   const [cardData, setCardData] = useState([]);
//   const API_URL = import.meta.env.VITE_API_BASE_URL;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/home-board`);
//         const data = response.data;

//         const formattedData = cardConfigurations.map(config => {
//           const items = data[config.key] || [];
//           return {
//             id: config.key,
//             title: config.title,
//             slug: config.slug,
//             items: items.map(item => ({
//               title: item.en_title,
//               doc: config.docField ? item[config.docField] : null,
//               folder: config.folder || null,
//               ...formatDate(item[config.dateField]),
//             })),
//           };
//         });
//         setCardData(formattedData);
//       } catch (error) {
//         console.error("Error fetching latest data:", error);
//         setCardData(cardConfigurations.map(c => ({ id: c.key, title: c.title, items: [] })));
//       }
//     };
//     fetchData();
//   }, [API_URL]);

//   return (
//     <section
//       className="relative w-full flex justify-center items-center bg-no-repeat bg-bottom bg-contain h-[280px] sm:h-[380px] md:h-[480px] lg:h-[580px]"
//       style={{ backgroundImage: `url(${boardBg})` }}
//       aria-label="Latest Updates"
//     >
//       <div className="absolute top-0 left-0 w-full h-[100px] sm:h-[150px] md:h-[180px] lg:h-[200px] bg-gradient-to-b from-[rgba(78,81,229,0.43)] to-transparent" />
//       <section aria-label="Information Cards" className="w-full max-w-[1800px] mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//           {cardData.map((card, i) => (
//             <motion.article
//               key={card.id}
//               className="relative bg-[#f1f1f1f0] h-[440px] rounded-xl border-b-[5px] border-[#ffc107] shadow-[-1px_-10px_8px_#56565654] p-6 flex flex-col transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg focus-within:ring-2 focus-within:ring-yellow-500"
//               variants={{
//                 hidden: { opacity: 0, y: 30 },
//                 visible: { opacity: 1, y: 0, transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" } },
//               }}
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true, amount: 0.3 }}
//               aria-labelledby={`card-title-${card.id}`}
//             >
//               <h3 id={`card-title-${card.id}`} className="font-medium text-white text-[18px] text-center bg-[#4448e1] px-[10px] py-[12px] rounded-t-[10px] shadow-[0px_3px_4px_#7c7b7ba3] absolute top-0 left-0 w-full">
//                 {card.title}
//               </h3>

//               {/* Scrollable container for the list */}
//               <div className="mt-16 flex-grow overflow-y-auto space-y-4 pr-2">
//                 {card.items.length > 0 ? (
//                   card.items.map((item, index) => (
//                     <div key={index} className="flex items-center gap-4">
//                       {/* Date Display */}
//                       <div className="w-[23%] flex-shrink-0 flex justify-center items-center h-12 bg-amber-500 rounded-tl-[15px] rounded-br-[15px] shadow-md shadow-gray-500/70 text-white font-semibold leading-tight">
//                         <div className="flex w-full h-full">
//                           <span className="flex items-center justify-center w-2/5 text-[12px] sm:text-[13px]">
//                             {item.day}
//                           </span>
//                           <span className="flex items-center justify-center bg-[#6063e5] rounded-br-[8px] w-3/5 h-full text-[12px] sm:text-[13px]">
//                             {item.monthYear}
//                           </span>
//                         </div>
//                       </div>

//                       {/* Description or Link */}
//                       <div className="flex-1">
//                         {item.doc ? (
//                           <a href={`${API_URL}/uploads/${item.folder}/${item.doc}`} target="_blank" rel="noopener noreferrer" className="text-[#2563eb] hover:text-green-600 font-medium">
//                             {item.title}
//                           </a>
//                         ) : (
//                           <p className="text-[#2563eb] font-medium">{item.title}</p>
//                         )}
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-center pt-16 text-gray-500">No {card.title.toLowerCase()} found.</p>
//                 )}
//               </div>

//               <Link to={`/subpage/${card.slug}`} className="absolute bottom-[-1.5rem] left-[9.5rem] bg-yellow-500 text-black px-8 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600 transition-colors duration-300 hover:bg-yellow-400" aria-label={`Read more about ${card.title}`}>
//                 <FaArrowRightLong size={20} />
//               </Link>
//             </motion.article>
//           ))}
//         </div>
//       </section>
//     </section>
//   );
// }



import React, { useState, useEffect } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import boardBg from "@/assets/aboutbg.png";
import { motion } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';

const formatDate = (dateString) => {
  if (!dateString) return {};
  try {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      monthYear: date.toLocaleString("default", { month: "short", year: "numeric" }),
    };
  } catch (error) {
    return {};
  }
};



export default function Board() {
  const [cardData, setCardData] = useState([]);
  const { translate } = useGlobalTranslation();
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const cardConfigurations = [
  { key: 'tender', titleKey: translate('tender'), slug: 'tenders', folder: 'tenders', dateField: 'date', docField: 'doc' },
  { key: 'notice', titleKey: translate('notice'), slug: 'notice-advertisements', folder: 'notices', dateField: 'date', docField: 'doc' },
  { key: 'actAndRule', titleKey: translate('acts-and-rules'), slug: 'acts-rules', dateField: 'createdAt' },
  { key: 'newsAndEvent', titleKey: translate('news-and-events'), slug: 'news-events', folder: 'events', dateField: 'eventDate', docField: 'document' },
];

const isNewForm = (createdAt) => {
  if (!createdAt) return false;
  const createdDate = new Date(createdAt); 
  const today = new Date();
  const diffTime = today - createdDate;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
};


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/home-board`);
        const data = response.data;

        const formattedData = cardConfigurations.map(config => {
          const items = data[config.key] || [];
          return {
            id: config.key,
            title: translate(config.titleKey),
            slug: config.slug,
            items: items.map(item => ({
              title: translate(item, 'title'),
              doc: config.docField ? item[config.docField] : null,
              folder: config.folder || null,
              ...formatDate(item[config.dateField]),
            })),
          };
        });
        setCardData(formattedData);
      } catch (error) {
        console.error("Error fetching latest data:", error);
        setCardData(cardConfigurations.map(c => ({ id: c.key, title: translate(c.titleKey), items: [] })));
      }
    };
    fetchData();
  }, [API_URL, translate]);

  return (
    <section
      className="relative w-full flex justify-center items-center bg-no-repeat bg-bottom bg-contain h-[280px] sm:h-[380px] md:h-[480px] lg:h-[580px]"
      style={{ backgroundImage: `url(${boardBg})` }}
      aria-label="Latest Updates"
    >
      <div className="absolute top-0 left-0 w-full h-[100px] sm:h-[150px] md:h-[180px] lg:h-[200px] bg-gradient-to-b from-[rgba(78,81,229,0.43)] to-transparent" />
      <section aria-label="Information Cards" className="w-full max-w-[1800px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cardData.map((card, i) => (
            <motion.article
              key={card.id}
              className="relative bg-[#f1f1f1f0] h-[440px] rounded-xl border-b-[5px] border-[#ffc107] shadow-[-1px_-10px_8px_#56565654] p-6 flex flex-col transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg focus-within:ring-2 focus-within:ring-yellow-500"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" } },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              aria-labelledby={`card-title-${card.id}`}
            >
              <h3 id={`card-title-${card.id}`} className="font-medium text-white text-[18px] text-center bg-[#4448e1] px-[10px] py-[12px] rounded-t-[10px] shadow-[0px_3px_4px_#7c7b7ba3] absolute top-0 left-0 w-full">
                {card.title}
              </h3>

              <div className="mt-16 flex-grow overflow-y-auto space-y-4 pr-2">
                {card.items.length > 0 ? (
                  card.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-[23%] flex-shrink-0 flex justify-center items-center h-12 bg-amber-500 rounded-tl-[15px] rounded-br-[15px] shadow-md shadow-gray-500/70 text-white font-semibold leading-tight">
                        <div className="flex w-full h-full">
                          <span className="flex items-center justify-center w-2/5 text-[12px] sm:text-[13px]">
                            {item.day}
                          </span>
                          <span className="flex items-center justify-center bg-[#6063e5] rounded-br-[8px] w-3/5 h-full text-[12px] sm:text-[13px]">
                            {item.monthYear}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1">
                        {item.doc ? (
                          <a title={item.title} href={`${API_URL}/uploads/${item.folder}/${item.doc}`} target="_blank" rel="noopener noreferrer" className="text-[#2563eb] items-center hover:text-green-600 font-medium flex gap-2">
                            {item.title}  {isNewForm && (
                    <img
                      src="https://mtpl.work/dph/assets/user/images/gif-new.gif"
                      alt="New"
                      className="w-auto h-3"
                    />
                  )}
                          </a>
                        ) : (
                          <p className="text-[#2563eb] font-medium flex items-center gap-2">{item.title}{isNewForm && (
                    <img
                      src="https://mtpl.work/dph/assets/user/images/gif-new.gif"
                      alt="New"
                      className="w-auto h-3"
                    />
                  )}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center pt-16 text-gray-500">{translate('No')} {card.title ? card.title.toLowerCase() : ''} {translate('found')}.</p>
                )}
              </div>

              <Link to={`/subpage/${card.slug}`} className="absolute bottom-[-1.5rem] left-[9.5rem] bg-yellow-500 text-black px-8 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600 transition-colors duration-300 hover:bg-yellow-400" aria-label={`Read more about ${card.title}`}>
                <FaArrowRightLong size={20} />
              </Link>
            </motion.article>
          ))}
        </div>
      </section>
    </section>
  );
}