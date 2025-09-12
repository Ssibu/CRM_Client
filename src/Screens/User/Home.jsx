// import React, { useState, useEffect } from "react";
// import Banner from "@/Components/User/Home/Banner";
// import TickerBar from "@/Components/User/Home/TickerBar";
// import DirectorDesk from "@/Components/User/Home/DirectorDesk";
// import Board from "@/Components/User/Home/Board";
// import Galary from "@/Components/User/Home/Gallery";
// import AdvertisementModal from "@/Components/User/Home/AdvertisementModal";
// import axios from "axios";

// const Home = () => {
//   const [ads, setAds] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const fetchAds = async () => {
//       try {
//         const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/ads`);
//         if (res.data.success && res.data.data.length > 0) {
//           const formattedAds = res.data.data.map((ad) => ({
//             photo_url: `${import.meta.env.VITE_API_BASE_URL}/uploads/advertisements/${ad.en_adphoto || ad.od_adphoto}`,
//             en_title: ad.en_title || "Advertisement",
//           }));
//           setAds(formattedAds);
//           setShowModal(true);
//         }
//       } catch (err) {
//         console.error("Error fetching ads:", err);
//       }
//     };
//     fetchAds();
//   }, []);

//   const handleNext = () =>
//     setCurrentIndex((prev) => (prev + 1) % ads.length);

//   const handlePrev = () =>
//     setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);

//   return (
//     <div>
// {showModal && ads.length > 0 && (
//   <AdvertisementModal
//     ads={ads}
//     onClose={() => setShowModal(false)}
//   />
// )}


//       <Banner />
//       <TickerBar />
//       <DirectorDesk />
//       <Board />
//       <Galary />
//     </div>
//   );
// };

// export default Home;


import React, { useState, useEffect } from "react";
import Banner from "@/Components/User/Home/Banner";
import TickerBar from "@/Components/User/Home/TickerBar";
import DirectorDesk from "@/Components/User/Home/DirectorDesk";
import Board from "@/Components/User/Home/Board";
import Galary from "@/Components/User/Home/Gallery";
import AdvertisementModal from "@/Components/User/Home/AdvertisementModal";
import axios from "axios";

const Home = () => {
  const [ads, setAds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  // FIX 1: Removed redundant currentIndex, handleNext, and handlePrev state and functions.
  // The Swiper component handles its own navigation.

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/ads`);
        
        // Ensure the API call was successful and returned data
        if (res.data.success && res.data.data.length > 0) {
          // FIX 2: Do NOT transform the data. Pass the original data array directly.
          // The modal component needs the original properties (id, en_adphoto, ad_link, etc.)
          setAds(res.data.data);
          setShowModal(true); // Show the modal once data is ready
        }
      } catch (err) {
        console.error("Error fetching ads:", err);
      }
    };
    fetchAds();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div>
      {/* FIX 3: Changed prop name from "photos" to "ads" to match the modal's expected prop. */}
      {/* Also removed the unused props (currentIndex, onNext, onPrev, link). */}
      {showModal && ads.length > 0 && (
        <AdvertisementModal
          ads={ads}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* The rest of your page components */}
      <Banner />
      <TickerBar />
      <DirectorDesk />
      <Board />
      <Galary />
    </div>
  );
};

export default Home;