// import { useEffect } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import { useGlobalTranslation } from "@/hooks/useGlobalTranslation";

// const AdvertisementModal = ({ ads, onClose }) => {
//   const { language } = useGlobalTranslation();

//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, []);

//   if (!ads || ads.length === 0) return null;

//   const getAdImage = (ad) => {
//     if (language === "od") return ad.od_adphoto;
//     return ad.en_adphoto;
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className=" p-4 rounded shadow-lg max-w-5xl relative">
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 text-white text-2xl z-50"
//         >
//           X
//         </button>

//         <Swiper
//           modules={[Navigation, Pagination]}
//           navigation
//           pagination={{ clickable: true }}
//           spaceBetween={20}
//           slidesPerView={1}
//           className="rounded text-white"
//         >
//           {ads.map((ad) => {
//             const image = getAdImage(ad);
//             if (!image) return null;

//             return (
//            <SwiperSlide key={ad.id} className="flex flex-col items-center">
//   <img
//     src={`${import.meta.env.VITE_API_BASE_URL}/uploads/advertisements/${image}`}
//     alt="Advertisement"
//     className="rounded object-contain max-h-[70vh] max-w-full"
//   />

//   {ad.ad_link && (
//     <a
//       href={ad.ad_link}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
//     >
//       Visit Link
//     </a>
//   )}
// </SwiperSlide>

//             );
//           })}
//         </Swiper>
//       </div>
//     </div>
//   );
// };

// export default AdvertisementModal;

import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useGlobalTranslation } from "@/hooks/useGlobalTranslation";

// It's recommended to import custom styles for Swiper
import "./AdvertisementModal.css";

const AdvertisementModal = ({ ads, onClose }) => {
  const { language } = useGlobalTranslation();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!ads || ads.length === 0) return null;

  const getAdImage = (ad) => {
    if (language === "od") return ad.od_adphoto;
    return ad.en_adphoto;
  };

  return (
    // 1. OVERLAY: Covers the screen and centers everything. `p-4` provides a safe area.
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000] p-4">
      
      {/* Close button is now a direct child of the overlay for easier positioning */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-4xl z-50 hover:opacity-75 transition-opacity"
        aria-label="Close"
      >
        &times;
      </button>

      {/* 2. SWIPER CONTAINER: This is the key. It is constrained by the viewport size.
          `w-auto` and `h-auto` allow it to shrink or grow to match its content (the image). */}
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        slidesPerView={1}
        className=" h-auto container"
      >
        {ads.map((ad) => {
          const image = getAdImage(ad);
          if (!image) return null;

          return (
            // 3. SLIDE: Acts as a flex container to center the content perfectly.
            <SwiperSlide key={ad.id} className="flex justify-center items-center">

              {/* 4. CONTENT WRAPPER: This new div holds the visual elements.
                  It has the background, padding, and shadow. It will shrink-to-fit the image and link.
                  This is what solves the "empty white space" problem. */}
              <div className="p-3 flex flex-col items-center">
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}/uploads/advertisements/${image}`}
                  alt={ad.en_title || "Advertisement"}
                  // The image is contained within its parent (the content wrapper)
                  className="object-contain rounded"
                  // No max-height here; it's controlled by the Swiper container's max-height
                />

               
              </div>
             <div className="flex justify-center " >
                {ad.ad_link && (
                  <a
                    href={ad.ad_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md"
                  >
                    Visit Link
                  </a>
                )}
             </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default AdvertisementModal;