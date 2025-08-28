import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const SkeletonCard = () => (
  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-lg animate-pulse">
    <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
  </div>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [hoverIndex, setHoverIndex] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const cards = [
    { title: "Tenders", value: "120+", gradient: "from-blue-500 to-blue-700" },
    {
      title: "Notice & Advertisement",
      value: "85",
      gradient: "from-green-500 to-green-700",
    },
    {
      title: "News & Events",
      value: "60+",
      gradient: "from-red-500 to-red-700",
    },
    { title: "Users", value: "30", gradient: "from-purple-500 to-purple-700" },
  ];

  return (
    <div className="min-h-[80vh] bg-gray-50 py-4 sm:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : cards.map((card, i) => {
              const isHovered = hoverIndex === i;
              return (
                <motion.div
                  key={card.title}
                  className="group relative"
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, rotateX: 8, rotateY: -8 }}
                  style={{ transformStyle: "preserve-3d" }}
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  <div
                    className={`relative overflow-hidden bg-gradient-to-br ${card.gradient} text-white rounded-xl p-4 shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-white/20 transition-all duration-300`}
                    style={{ perspective: "1000px" }}
                  >
                    {/* Base Texture */}
                    <div
                      className="absolute inset-0 opacity-20 pointer-events-none"
                      style={{
                        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)`,
                        backgroundSize: "30px 30px",
                        animation: `moveTexture ${
                          isHovered ? "4s" : "8s"
                        } linear infinite`,
                      }}
                    ></div>

                    {/* Animated Diagonal Lines */}
                    <div
                      className="absolute inset-0 opacity-10 pointer-events-none"
                      style={{
                        backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                        backgroundSize: "40px 40px",
                        animation: `moveLines ${
                          isHovered ? "6s" : "12s"
                        } linear infinite`,
                      }}
                    ></div>

                    {/* Animated Wave Shape */}
                    <div
                      className="absolute bottom-[-8px] left-0 w-full h-16 opacity-20"
                      style={{
                        background: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1440 320' xmlns='http://www.w3.org/2000/svg'><path fill='white' fill-opacity='6' d='M0,96L48,85.3C96,75,192,53,288,64C384,75,480,117,576,138.7C672,160,768,160,864,144C960,128,1056,96,1152,85.3C1248,75,1344,85,1392,90.7L1440,96L1440,320L0,320Z'></path></svg>")`,
                        backgroundSize: "cover",
                        animation: `
      waveMove ${isHovered ? "3s" : "6s"} ease-in-out infinite alternate,
      pulseOpacity 2s ease-in-out infinite
    `,
                      }}
                    ></div>

                    {/* Floating Circles */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle 6px, rgba(255,255,255,0.5) 100%, transparent 0)`,
                        backgroundSize: "120px 120px",
                        animation: `floatCircles ${
                          isHovered ? "3s" : "7s"
                        } ease-in-out infinite alternate`,
                      }}
                    ></div>

                    {/* Card Content */}
                    <div className="relative text-center space-y-2">
                      <h3 className="text-lg font-semibold drop-shadow-md">
                        {card.title}
                      </h3>
                      <p className="text-2xl font-bold drop-shadow-lg">
                        {card.value}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
      </div>

      {/* Keyframes */}
      <style>
        {`
          @keyframes moveTexture {
            0% { background-position: 0 0; }
            100% { background-position: 100px 100px; }
          }
          @keyframes moveLines {
            0% { background-position: 0 0; }
            100% { background-position: 200px 200px; }
          }
          @keyframes waveMove {
            0% { transform: translateY(0); }
            100% { transform: translateY(-5px); }
          }
          @keyframes floatCircles {
            0% { background-position: 0 0; }
            100% { background-position: 60px 60px; }
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;
