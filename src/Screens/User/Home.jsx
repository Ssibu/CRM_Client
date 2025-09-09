import React, { useState, useEffect } from "react";
import Banner from "@/Components/User/Home/Banner";
import TickerBar from "@/Components/User/Home/TickerBar";
import DirectorDesk from "@/Components/User/Home/DirectorDesk";
import Board from "@/Components/User/Home/Board";
import Galary from "@/Components/User/Home/Gallery";
import ImageModal from "@/Components/User/ImageModal";
import axios from "axios";

const Home = () => {
  const [ads, setAds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/ads`);
        if (res.data.success && res.data.data.length > 0) {
          const formattedAds = res.data.data.map((ad) => ({
            photo_url: `${import.meta.env.VITE_API_BASE_URL}/uploads/advertisements/${ad.en_adphoto || ad.od_adphoto}`,
            en_title: ad.en_title || "Advertisement",
          }));
          setAds(formattedAds);
          setShowModal(true);
        }
      } catch (err) {
        console.error("Error fetching ads:", err);
      }
    };
    fetchAds();
  }, []);

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % ads.length);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);

  return (
    <div>
      {showModal && ads.length > 0 && (
        <ImageModal
          photos={ads}
          currentIndex={currentIndex}
          onClose={() => setShowModal(false)}
          onNext={handleNext}
          onPrev={handlePrev}
          link={ads.ad_link}
        />
      )}

      <Banner />
      <TickerBar />
      <DirectorDesk />
      <Board />
      <Galary />
    </div>
  );
};

export default Home;
