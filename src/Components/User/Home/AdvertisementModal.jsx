import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useGlobalTranslation } from "@/hooks/useGlobalTranslation";

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className=" p-4 rounded shadow-lg max-w-5xl relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-white text-2xl"
        >
          X
        </button>

        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={20}
          slidesPerView={1}
          className="rounded text-white"
        >
          {ads.map((ad) => {
            const image = getAdImage(ad);
            if (!image) return null; 

            return (
              <SwiperSlide key={ad.id} className="flex justify-center">
                {ad.ad_link ? (
                  <a href={ad.ad_link} target="_blank" rel="noopener noreferrer">
                   <img
  src={`${import.meta.env.VITE_API_BASE_URL}/uploads/advertisements/${image}`}
  alt="Advertisement"
  className="rounded object-contain max-h-[80vh] max-w-full"
/>

                  </a>
                ) : (
                <img
  src={`${import.meta.env.VITE_API_BASE_URL}/uploads/advertisements/${image}`}
  alt="Advertisement"
  className="rounded object-contain max-h-[80vh] max-w-full"
/>

                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default AdvertisementModal;
