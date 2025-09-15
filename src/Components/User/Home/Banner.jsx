import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import bgPattern from "@/assets/bodybg.jpg";
import axios from "axios";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useGlobalTranslation } from "@/hooks/useGlobalTranslation";

const BANNERS_API_URL = "http://localhost:5000/home/allbanners";

const Banner = () => {
  const swiperRef = useRef(null);
  const [adminsRaw, setAdminsRaw] = useState([]);  // raw admin data from API
  const [cardsData, setCardsData] = useState([]); // translated + colored cards
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const { translate } = useGlobalTranslation();

  // Fetch admins and banners only once on mount
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get("http://localhost:5000/display-home-admins");
        if (response.data && response.data.data) {
          setAdminsRaw(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching home admins:", error);
      }
    };

    const fetchBanners = async () => {
      try {
        const response = await axios.get(BANNERS_API_URL);
        if (response.data && response.data.banners) {
          const activeBanners = response.data.banners.filter((banner) => banner.is_active);
          setBanners(activeBanners);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
    fetchBanners();
  }, []);

  // Update cardsData when adminsRaw or translate function changes (e.g. on language change)
  useEffect(() => {
    if (adminsRaw.length === 0) return;

    setCardsData(
      adminsRaw.map((admin, i) => ({
        id: i,
        name: translate(admin, "name") || admin.en_name || "—",
        designation: translate(admin, "designation") || admin.en_designation || "—",
        image: admin.image_url,
        color: ["bg-[#e3b016d9]", "bg-[#5f5edbb0]", "bg-[#2196f396]"][i % 3],
      }))
    );
  }, [adminsRaw, translate]);

  return (
    <section className="w-full max-w-[2000px] mx-auto z-0">
      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[400px] lg:min-h-[500px] shadow-xl overflow-hidden">
        {/* Left Section - Swiper */}
        <div className="relative lg:col-span-3 h-[300px] sm:h-[400px] lg:h-[500px]">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Autoplay, Pagination]}
            loop
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{
              clickable: true,
              bulletClass: "swiper-pagination-bullet",
            }}
            className="w-full h-full"
          >
            {banners.length > 0 ? (
              banners.map((banner) => (
                <SwiperSlide key={banner.id}>
                  <img
                    src={banner.image_url}
                    alt={`Banner ${banner.id}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-700">
                  No banners to display
                </div>
              </SwiperSlide>
            )}
          </Swiper>

          {/* Custom Navigation */}
          <div className="absolute bottom-4 right-4 flex gap-3 z-10">
            <button
              onClick={() => swiperRef.current?.swiper?.slidePrev()}
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-white
                bg-gradient-to-r from-indigo-600 to-amber-300/95 shadow-lg hover:scale-105 transition"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={() => swiperRef.current?.swiper?.slideNext()}
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-white
                bg-gradient-to-r from-indigo-600 to-amber-300/95 shadow-lg hover:scale-105 transition"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Right Section - Leadership Cards */}
        <div
          className="relative flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8
            min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]"
          style={{
            backgroundImage: `url(${bgPattern})`,
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
            backgroundPosition: "top left",
          }}
        >
          <div className="absolute inset-0 bg-black/10" />

          <div className="relative z-10 w-full max-w-sm mx-auto space-y-6">
            {loading ? (
              <p className="text-center text-white">Loading team members...</p>
            ) : cardsData.length === 0 ? (
              <p className="text-center text-white">No active team members found.</p>
            ) : (
              cardsData.map((card) => (
                <div
                  key={card.id}
                  className={`relative p-6 rounded-xl shadow-md hover:shadow-lg transition
                    transform hover:scale-[1.02] duration-300 ease-in-out ${card.color} text-white`}
                >
                  <div className="absolute top-[0.4rem] left-[-1.5rem] w-[6rem] h-[6rem] rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={card.image}
                      alt={`Portrait of ${card.name}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="pl-20">
                    <h3 className="font-semibold text-xl tracking-wide truncate">{card.name}</h3>
                    <p className="text-lg tracking-wide opacity-80 truncate">{card.designation}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .swiper-pagination {
          bottom: 20px !important;
        }
        .swiper-pagination-bullet {
          width: 8px !important;
          height: 8px !important;
          margin: 0 4px !important;
          background: rgba(255, 255, 255, 0.5) !important;
          opacity: 1 !important;
        }
        .swiper-pagination-bullet-active {
          background: white !important;
        }
      `}</style>
    </section>
  );
};

export default Banner;
