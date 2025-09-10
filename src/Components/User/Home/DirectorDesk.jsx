
import React, { useState, useEffect } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useGlobalTranslation } from "@/hooks/useGlobalTranslation";
import { Link } from "react-router-dom";

// Animation variants
const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1 } };

// Reusable Section Title
const SectionTitle = ({ children }) => (
  <>
    <motion.h2
      variants={fadeInUp}
      className="text-[#6260d9] text-[25px] tracking-wide font-semibold"
    >
      {children}
    </motion.h2>
    <motion.div
      variants={fadeIn}
      className="h-[1px] bg-gray-300 w-full mt-1 mb-6 relative"
    >
      <span className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-[#facc15]" />
    </motion.div>
  </>
);

// Reusable Button
const ReadMoreButton = ({ label }) => (
  <motion.button
    aria-label={label}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-[#facc15] text-black w-24 h-10 flex items-center justify-center rounded-full shadow hover:bg-yellow-400 transition-colors duration-300"
  >
    <ArrowRight size={20} />
  </motion.button>
);

export default function DirectorDeskComponent() {
  const [directorDesk, setDirectorDesk] = useState(null);
  const [homeSetting, setHomeSetting] = useState(null);
  const [loading, setLoading] = useState(true);
  const { translate } = useGlobalTranslation();
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/home-d-desk`);
        setDirectorDesk(res.data.directorDesk || null);
        setHomeSetting(res.data.homeSetting || null);
      } catch (err) {
        console.error("Error fetching director desk and about data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  const directorName = directorDesk ? translate(directorDesk, "name") : "";
  const directorMessage = directorDesk
    ? DOMPurify.sanitize(translate(directorDesk, "message") || "")
    : "";

  const aboutUs = homeSetting
    ? DOMPurify.sanitize(translate(homeSetting, "overview_description") || "")
    : "";

  return (
    <section
      className="relative w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://mtpl.work/dph/assets/user/images/bodybg-two.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-white/90 pointer-events-none" />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.2 }}
        className="relative px-6 py-10 lg:px-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left Section - Director's Desk */}
          {directorDesk && (
            <motion.article variants={fadeInUp}>
              <SectionTitle>{translate(directorDesk, "title")}</SectionTitle>
              <div className="flex gap-5 items-start">
                <motion.figure
                  variants={fadeIn}
                  whileHover={{ scale: 1.03 }}
                  className="flex-shrink-0 border border-gray-300 p-1 bg-white"
                >
                  <img
                    src={`${API_URL}/uploads/director-desk/${directorDesk.director_img}`}
                    alt={directorName}
                    className="w-[13rem] h-[14rem] object-cover rounded-sm"
                    loading="lazy"
                  />
                </motion.figure>
                <motion.div variants={fadeInUp}>
                  <h3 className="text-[#6260d9] text-[22px] font-semibold mb-2">
                    {directorName}
                  </h3>
                  <div
                    className="text-gray-700 text-[16px] leading-relaxed text-justify max-w-lg line-clamp-6"
                    dangerouslySetInnerHTML={{ __html: directorMessage }}
                  />
                </motion.div>
              </div>
              <Link to="/director-desk" className="mt-6 w-fit float-end">
                <ReadMoreButton
                  label={`Read more about ${directorName}'s message`}
                />
              </Link>
            </motion.article>
          )}

          {/* Right Section - About Us */}
          {homeSetting && (
            <motion.article variants={fadeInUp} className="relative">
              <div
                className="absolute -left-[3.5rem] top-0 bottom-0 hidden lg:flex flex-col justify-center"
                style={{
                  backgroundImage:
                    "url('https://mtpl.work/dph/assets/user/images/spiral.png')",
                  backgroundRepeat: "repeat-y",
                  backgroundSize: "auto 10px",
                  width: "28px",
                }}
                aria-hidden="true"
              />
              <SectionTitle>{translate("About Us")}</SectionTitle>
              <div
                className="text-gray-700 text-[16px] leading-relaxed text-justify max-w-5xl line-clamp-[20]"
                dangerouslySetInnerHTML={{ __html: aboutUs }}
              />
              <Link to="/page/about-us" className="mt-6 w-fit float-end pt-[4rem]">
                <ReadMoreButton label="Read more About Us" />
              </Link>
            </motion.article>
          )}
        </div>
      </motion.div>
    </section>
  );
}
