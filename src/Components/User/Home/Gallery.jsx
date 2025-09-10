// import React, { useState, useEffect, useRef } from "react";
// import axios from 'axios';
// import { FaFacebookF, FaInstagram } from "react-icons/fa";
// import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
// import banbg from "@/assets/banbg.png";
// import { motion } from "framer-motion";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import { useGlobalTranslation } from "@/hooks/useGlobalTranslation";
// import { PlayCircle } from "lucide-react";
// import { Link } from "react-router-dom";

// const generateCalendar = (month, year) => {
//   const firstDay = new Date(year, month, 1).getDay();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const days = [];
//   for (let i = 0; i < firstDay; i++) days.push("");
//   for (let d = 1; d <= daysInMonth; d++) days.push(d.toString());
//   return days;
// };

// const Gallery = () => {
//   const [data, setData] = useState({ homeSettings: null, photos: [], videos: [], holidays: [] });
//   const [loading, setLoading] = useState(true);
//   const [galleryMode, setGalleryMode] = useState('photo');
//   const [holidaysMap, setHolidaysMap] = useState(new Map());
//   const [selectedHoliday, setSelectedHoliday] = useState(null);

//   const { translate } = useGlobalTranslation();
//   const API_URL = import.meta.env.VITE_API_BASE_URL;

//   const today = new Date();
//   const [month, setMonth] = useState(today.getMonth());
//   const [year, setYear] = useState(today.getFullYear());

//   const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
//   const daysOfWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/gallery-and-events`);
//         const fetchedData = response.data;
//         setData(fetchedData);

//         const processedHolidays = new Map();
//         if (fetchedData.holidays) {
//           fetchedData.holidays.forEach(h => {
//             const date = new Date(h.holiday_date);
//             const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
//             processedHolidays.set(key, h.name);
//           });
//         }
//         setHolidaysMap(processedHolidays);
//       } catch (error) {
//         console.error("Failed to fetch gallery data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [API_URL]);
  
//   const nextMonth = () => {
//     if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1);
//   };
//   const prevMonth = () => {
//     if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1);
//   };

//   const days = generateCalendar(month, year);
//   const swiperRef = useRef(null);
//   const slidePrev = () => swiperRef.current?.slidePrev();
//   const slideNext = () => swiperRef.current?.slideNext();

//   const currentGalleryItems = galleryMode === 'photo' ? data.photos : data.videos;

//   return (
//     <main className="w-full">
//       <section
//         className="relative w-full min-h-[548px] flex items-center justify-center bg-[#dadbfb] bg-no-repeat bg-cover py-12 mb-5"
//         style={{ backgroundImage: `url(${banbg})`, backgroundAttachment: "fixed" }}
//         role="region" aria-label="Gallery and Events Section"
//       >
//         <div className="absolute inset-0 bg-black/40"></div>
//         <div className="absolute left-0 top-0 h-full w-[28%] bg-[#4aa2ff66]" aria-hidden="true"></div>
//         <div className="absolute right-0 top-0 h-full w-[28%] bg-[#4aa2ff66]" aria-hidden="true"></div>

//         <motion.div
//           className="relative z-10 max-w-[1880px] mx-auto w-full px-4 lg:px-8"
//           initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} transition={{ staggerChildren: 0.2 }}
//         >
//           {loading ? <div className="text-white text-center text-xl">Loading...</div> : (
//           <div className="flex flex-col md:flex-row gap-6">
            
//             {/* Social Links */}
//             <motion.section className="w-full md:w-[30%] bg-[#00000033] backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-md" 
//             custom={0} aria-labelledby="social-heading">
//               <h2 id="social-heading" className="text-white text-lg font-semibold">{translate("Social Link")}</h2>
//               <nav aria-label="Social Media Links" className="flex gap-2 mt-2">
//                 {data.homeSettings?.facebookLink && (
//                   <motion.a href={data.homeSettings.facebookLink} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="bg-[#ffc107] text-black rounded px-2 py-1 hover:bg-yellow-400" whileHover={{ scale: 1.1 }}><FaFacebookF /></motion.a>
//                 )}
//                 {data.homeSettings?.instagramLink && (
//                   <motion.a href={data.homeSettings.instagramLink} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="bg-[#ffc107] text-black rounded px-2 py-1 hover:bg-yellow-400" whileHover={{ scale: 1.1 }}><FaInstagram /></motion.a>
//                 )}
//               </nav>
//               <div className="mt-3 border-t border-white/50"></div>
//               <div className="h-[240px] mt-4 bg-[#00000055] rounded-lg border border-white/20" role="presentation"></div>
//             </motion.section>

//             {/* Gallery */}
//             <motion.section className="w-full md:w-[44%] bg-[#00000033] backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-md" 
//             custom={1} aria-labelledby="gallery-heading">
//               <div className="flex justify-between items-center">
//               <Link to={galleryMode === 'photo' ? "/subpage/photo-gallery" : "/subpage/video-gallery"}  >
//                 <h2 id="gallery-heading" className="text-white text-lg font-semibold">
//                   {galleryMode === "photo" ? "Photo Gallery" : "Video Gallery"}
//                 </h2> 
//               </Link>
//                 <div className="flex gap-2">
//                   <button onClick={() => setGalleryMode('photo')} className={`${galleryMode === 'photo' ? 'bg-[#ffc107]' : 'bg-white'} text-sm px-2 py-1 rounded`}>{translate("Photo")}</button>
//                   <button onClick={() => setGalleryMode('video')} className={`${galleryMode === 'video' ? 'bg-[#ffc107]' : 'bg-white'} text-sm px-2 py-1 rounded`}>{translate("Video")}</button>
//                 </div>
//               </div>
//               <div className="mt-3 border-t border-white/50"></div>

//               <Swiper onSwiper={(swiper) => (swiperRef.current = swiper)} slidesPerView={2} spaceBetween={12} loop={currentGalleryItems.length > 2} className="mt-4">
//                 {currentGalleryItems.map((item) => (
//                   <SwiperSlide key={item.id}>
//                     <a href={item.photolink || item.videolink || '#'} target="_blank" rel="noopener noreferrer">
//                       <figure className="relative h-56 w-full overflow-hidden rounded-lg border border-white/20 group shadow-md">
//                         {galleryMode === 'photo' ? (
//                           <img src={`${API_URL}/uploads/photos/${item.photofile}`} alt={translate(item, 'title')} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy"/>
//                         ) : (
//                           <div className="h-full w-full bg-black flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
//                             <PlayCircle className="text-white/70 h-16 w-16"/>
//                           </div>
//                         )}
//                         <figcaption className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 flex items-end">
//                           <div className="w-full p-2 text-white text-sm bg-gradient-to-t from-black/60 to-transparent">{translate(item, 'title')}</div>
//                         </figcaption>
//                       </figure>
//                     </a>
//                   </SwiperSlide>
//                 ))}
//               </Swiper>

//               <div className="mt-4 flex justify-end gap-2">
//                 <motion.button className="bg-[#ffc107] p-2 rounded-full" aria-label="Previous slide" whileHover={{ scale: 1.2 }} onClick={slidePrev}><IoIosArrowBack /></motion.button>
//                 <motion.button className="bg-[#ffc107] p-2 rounded-full" aria-label="Next slide" whileHover={{ scale: 1.2 }} onClick={slideNext}><IoIosArrowForward /></motion.button>
//               </div>
//             </motion.section>

//             {/* Calendar */}
// {/* Calendar */}
// <motion.section className="w-full md:w-[30%] bg-[#00000033] backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-md" 
//  custom={2} aria-labelledby="calendar-heading">
//   <h2 id="calendar-heading" className="text-white text-lg font-semibold">{translate("Event Calendar")}</h2>
//   <div className="mt-3 border-t border-white/50"></div>
//   <div className="flex justify-between items-center mt-4 text-white">
//     <motion.button className="bg-[#ffc107] p-2 rounded-full" aria-label="Previous month" whileHover={{ scale: 1.2 }} onClick={prevMonth}><IoIosArrowBack /></motion.button>
//     <h3 className="font-semibold">{months[month]} {year}</h3>
//     <motion.button className="bg-[#ffc107] p-2 rounded-full" aria-label="Next month" whileHover={{ scale: 1.2 }} onClick={nextMonth}><IoIosArrowForward /></motion.button>
//   </div>

//   {/* Calendar Grid */}
//   <div className="grid grid-cols-7 gap-2 mt-4 text-white text-sm">
//     {daysOfWeek.map((d) => (<div key={d} className="text-center font-semibold">{d}</div>))}
//     {days.map((day, i) => {
//       const dayDate = day ? parseInt(day) : 0;
//       const isToday = dayDate === today.getDate() && month === today.getMonth() && year === today.getFullYear();
//       const holidayKey = `${year}-${month}-${dayDate}`;
//       const isHoliday = holidaysMap.has(holidayKey);

//       return (
//         <motion.div
//           key={i}
//           className={`text-center py-1 rounded-md transition-all cursor-pointer ${day ? "" : ""} ${isToday ? "bg-[#ffc107] text-black font-bold" : isHoliday ? "bg-red-500 text-white font-bold" : "border border-white/40 hover:bg-yellow-400 hover:text-black"}`}
//           whileHover={day && !isToday ? { scale: 1.05 } : {}}
//           onClick={() => isHoliday && setSelectedHoliday({ day: dayDate, name: holidaysMap.get(holidayKey) })}
//         >
//           {day}
//         </motion.div>
//       );
//     })}
//   </div>

//   {/* Selected Holiday Display */}
//   <motion.div
//     className="mt-4 p-3 bg-[#ffffff22] rounded-md min-h-[40px] flex items-center justify-center text-white font-semibold text-center shadow-md"
//     initial={{ opacity: 0, y: -10 }}
//     animate={{ opacity: selectedHoliday ? 1 : 0, y: selectedHoliday ? 0 : -10 }}
//     transition={{ duration: 0.3 }}
//   >
//     {selectedHoliday ? `${selectedHoliday.day} - ${selectedHoliday.name}` : "Click a holiday to see details"}
//   </motion.div>
// </motion.section>


//           </div>
//           )}
//         </motion.div>
//       </section>
//     </main>
//   );
// };

// export default Gallery;


import React, { useEffect, useState, useRef } from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import banbg from "@/assets/banbg.png";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useGlobalTranslation } from "@/hooks/useGlobalTranslation";
import { PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
const generateCalendar = (month, year) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push("");
  for (let d = 1; d <= daysInMonth; d++) days.push(d.toString());
  return days;
};

const Gallery = () => {
  const [data, setData] = useState({ homeSettings: null, photos: [], videos: [], holidays: [] });
  const [loading, setLoading] = useState(true);
  const [galleryMode, setGalleryMode] = useState('photo');
  const [holidaysMap, setHolidaysMap] = useState(new Map());
  const [selectedHoliday, setSelectedHoliday] = useState(null);
    const [activeSocialLink, setActiveSocialLink] = useState("");

  const { translate } = useGlobalTranslation();
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const daysOfWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/gallery-and-events`);
        const fetchedData = response.data;
        setData(fetchedData);

           if (fetchedData.homeSettings?.facebookLink) {
          setActiveSocialLink(fetchedData.homeSettings.facebookLink);
        } else if (fetchedData.homeSettings?.instagramLink) {
          setActiveSocialLink(fetchedData.homeSettings.instagramLink);
        } else if (fetchedData.homeSettings?.twitterLink) {
          setActiveSocialLink(fetchedData.homeSettings.twitterLink);
        }


        const processedHolidays = new Map();
        if (fetchedData.holidays) {
          fetchedData.holidays.forEach(h => {
            const date = new Date(h.holiday_date);
            const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            processedHolidays.set(key, h.name);
          });
        }
        setHolidaysMap(processedHolidays);
      } catch (error) {
        console.error("Failed to fetch gallery data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_URL]);
  
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1);
  };
  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1);
  };

  const days = generateCalendar(month, year);
  const swiperRef = useRef(null);
  const slidePrev = () => swiperRef.current?.slidePrev();
  const slideNext = () => swiperRef.current?.slideNext();

  const currentGalleryItems = galleryMode === 'photo' ? data.photos : data.videos;

  return (
    <main className="w-full">
      <section
        className="relative w-full min-h-[548px] flex items-center justify-center bg-[#dadbfb] bg-no-repeat bg-cover py-12 mb-5"
        style={{ backgroundImage: `url(${banbg})`, backgroundAttachment: "fixed" }}
        role="region" aria-label="Gallery and Events Section"
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute left-0 top-0 h-full w-[28%] bg-[#4aa2ff66]" aria-hidden="true"></div>
        <div className="absolute right-0 top-0 h-full w-[28%] bg-[#4aa2ff66]" aria-hidden="true"></div>

        <motion.div
          className="relative z-10 max-w-[1880px] mx-auto w-full px-4 lg:px-8"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} transition={{ staggerChildren: 0.2 }}
        >
          {loading ? <div className="text-white text-center text-xl">Loading...</div> : (
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Social Links */}
       
                 <motion.section
                className="w-full md:w-[30%] bg-[#00000033] backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-md"
                custom={0}
                aria-labelledby="social-heading"
              >
                <h2
                  id="social-heading"
                  className="text-white text-lg font-semibold"
                >
                  {translate("Social Link")}
                </h2>
                <nav
                  aria-label="Social Media Links"
                  className="flex gap-2 mt-2"
                >
                  {data.homeSettings?.facebookLink && (
                    <motion.button
                              onClick={() => setActiveSocialLink(data.homeSettings.facebookLink)}

                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="bg-[#ffc107] text-black rounded px-2 py-1 hover:bg-yellow-400"
                      whileHover={{ scale: 1.1 }}
                    >
                      <FaFacebookF />
                    </motion.button>
                  )}
                  {data.homeSettings?.instagramLink && (
                    <motion.button
                        onClick={() => setActiveSocialLink(data.homeSettings.instagramLink)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="bg-[#ffc107] text-black rounded px-2 py-1 hover:bg-yellow-400"
                      whileHover={{ scale: 1.1 }}
                    >
                      <FaInstagram />
                    </motion.button>
                  )}
                  {data.homeSettings?.instagramLink && (
                    <motion.button
                             onClick={() => setActiveSocialLink(data.homeSettings.twitterLink)}

                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="bg-[#ffc107] text-black rounded px-2 py-1 hover:bg-yellow-400"
                      whileHover={{ scale: 1.1 }}
                    >
                      <FaTwitter />
                    </motion.button>
                  )}
                      {data.homeSettings?.linkedinLink && (
                    <motion.button
                       onClick={() => setActiveSocialLink(data.homeSettings.linkedinLink)}

                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="bg-[#ffc107] text-black rounded px-2 py-1 hover:bg-yellow-400"
                      whileHover={{ scale: 1.1 }}
                    >
                      <FaLinkedin />
                    </motion.button>
                  )}
                </nav>
                <div className="mt-3 border-t border-white/50"></div>
               
  <div className="h-[240px] mt-4 bg-[#00000055] rounded-lg border border-white/20 overflow-hidden">
    {activeSocialLink ? (
      <iframe
        src={activeSocialLink}
        title="Embedded Social Link"
        className="w-full h-full rounded-lg"
        allowFullScreen
      ></iframe>
    ) : (
      <p className="text-white text-center mt-20">No Social Link Available</p>
    )}
  </div>
              </motion.section>

            {/* Gallery */}
            <motion.section className="w-full md:w-[44%] bg-[#00000033] backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-md" 
            custom={1} aria-labelledby="gallery-heading">
              <div className="flex justify-between items-center">
              <Link to={galleryMode === 'photo' ? "/subpage/photo-gallery" : "/subpage/video-gallery"}  >
                <h2 id="gallery-heading" className="text-white text-lg font-semibold">
                  {galleryMode === "photo" ? "Photo Gallery" : "Video Gallery"}
                </h2> 
              </Link>
                <div className="flex gap-2">
                  <button onClick={() => setGalleryMode('photo')} className={`${galleryMode === 'photo' ? 'bg-[#ffc107]' : 'bg-white'} text-sm px-2 py-1 rounded`}>{translate("Photo")}</button>
                  <button onClick={() => setGalleryMode('video')} className={`${galleryMode === 'video' ? 'bg-[#ffc107]' : 'bg-white'} text-sm px-2 py-1 rounded`}>{translate("Video")}</button>
                </div>
              </div>
              <div className="mt-3 border-t border-white/50"></div>

              <Swiper onSwiper={(swiper) => (swiperRef.current = swiper)} slidesPerView={2} spaceBetween={12} loop={currentGalleryItems.length > 2} className="mt-4">
                {currentGalleryItems.map((item) => (
                  <SwiperSlide key={item.id}>
                    <a href={item.photolink || item.videolink || '#'} target="_blank" rel="noopener noreferrer">
                      <figure className="relative h-56 w-full overflow-hidden rounded-lg border border-white/20 group shadow-md">
                        {galleryMode === 'photo' ? (
                          <img src={`${API_URL}/uploads/photos/${item.photofile}`} alt={translate(item, 'title')} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy"/>
                        ) : (
                          <div className="h-full w-full bg-black flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                            <video></video>
                          </div>
                        )}
                        <figcaption className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 flex items-end">
                          <div className="w-full p-2 text-white text-sm bg-gradient-to-t from-black/60 to-transparent">{translate(item, 'title')}</div>
                        </figcaption>
                      </figure>
                    </a>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="mt-4 flex justify-end gap-2">
                <motion.button className="bg-[#ffc107] p-2 rounded-full" aria-label="Previous slide" whileHover={{ scale: 1.2 }} onClick={slidePrev}><IoIosArrowBack /></motion.button>
                <motion.button className="bg-[#ffc107] p-2 rounded-full" aria-label="Next slide" whileHover={{ scale: 1.2 }} onClick={slideNext}><IoIosArrowForward /></motion.button>
              </div>
            </motion.section>

            {/* Calendar */}
            <motion.section className="w-full md:w-[30%] bg-[#00000033] backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-md" 
            custom={2} aria-labelledby="calendar-heading">
              <h2 id="calendar-heading" className="text-white text-lg font-semibold">{translate("Event Calendar")}</h2>
              <div className="mt-3 border-t border-white/50"></div>
              <div className="flex justify-between items-center mt-4 text-white">
                <motion.button className="bg-[#ffc107] p-2 rounded-full" aria-label="Previous month" whileHover={{ scale: 1.2 }} onClick={prevMonth}><IoIosArrowBack /></motion.button>
                <h3 className="font-semibold">{months[month]} {year}</h3>
                <motion.button className="bg-[#ffc107] p-2 rounded-full" aria-label="Next month" whileHover={{ scale: 1.2 }} onClick={nextMonth}><IoIosArrowForward /></motion.button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mt-4 text-white text-sm">
                {daysOfWeek.map((d) => (<div key={d} className="text-center font-semibold">{d}</div>))}
                {days.map((day, i) => {
                  const dayDate = day ? parseInt(day) : 0;
                  const isToday = dayDate === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                  const holidayKey = `${year}-${month}-${dayDate}`;
                  const holidayName = holidaysMap.get(holidayKey);
                  const isHoliday = !!holidayName;

                  return (
                    <motion.div
                      key={i}
                      className={`text-center py-1 rounded-md transition-all ${day ? "cursor-pointer" : "cursor-default"} ${isToday ? "bg-[#ffc107] text-black font-bold" : isHoliday ? "bg-red-500 text-white font-bold" : day ? "border border-white/40 hover:bg-yellow-400 hover:text-black" : ""}`}
                      whileHover={day && !isToday ? { scale: 1.05 } : {}}
                      onClick={() => {
                        if (day) {
                          setSelectedHoliday({ day: dayDate, name: holidayName });
                        }
                      }}
                    >
                      {day}
                    </motion.div>
                  );
                })}
              </div>

              {/* Selected Holiday Display */}
              <motion.div
                className="mt-4 p-3 bg-[#ffffff22] rounded-md min-h-[40px] flex items-center justify-center text-white font-semibold text-center shadow-md"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {selectedHoliday ? (
                  selectedHoliday.name ? (
    
                    `${selectedHoliday.day} - ${selectedHoliday.name}`
                  ) : (
                    
                    `No Such Events  `
                  )
                ) : (
              
                  "Click on dates to see Events"
                )}
              </motion.div>
            </motion.section>

          </div>
          )}
        </motion.div>
      </section>
    </main>
  );
};

export default Gallery;