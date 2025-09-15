// import React from "react";
// import { motion } from "framer-motion";
// import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaChevronRight } from "react-icons/fa";

// import { COLORS, FACET_BG } from "./constants";
// import SectionHeading from "./SectionHeading";
// import LinkItem from "./LinkItem";
// import ContactRow from "./ContactRow";
// import LogoRail from "./LogoRail";

// const AllFooterComponent = () => {
//   return (
//     <footer
//       className={`relative isolate bg-[#5f77a5] ${FACET_BG} bg-blend-multiply`}
//       aria-labelledby="site-footer-heading"
//     >
//       <h2 id="site-footer-heading" className="sr-only">
//         Site footer
//       </h2>

//       <LogoRail />

//       <motion.div
//         initial={{ opacity: 0, y: 12 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.5, ease: "easeOut" }}
//         className="relative mx-auto w-[95%] md:w-[88%] px-4 md:px-2 pb-10 pt-10"
//       >
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
//           {/* Useful Links */}
//           <nav aria-label="Useful links">
//             <SectionHeading>Useful Links</SectionHeading>
//             <ul className="space-y-3">
//               <LinkItem
//                 href="https://www.cewacor.nic.in/error/error.html"
//                 label="Test Link"
//               />
//             </ul>
//           </nav>

//           {/* Important Links */}
//           <nav aria-label="Important links">
//             <SectionHeading>Important Links</SectionHeading>
//             <ul className="space-y-3">
//               <LinkItem href="https://mohfw.gov.in/" label="Ministry Of Health &amp; Family" />
//               <LinkItem href="https://odisha.gov.in/" label="Government Of Orissa Website" />
//               <LinkItem href="https://nhmodisha.gov.in/" label="National Health Mission, Odisha" />
//               <LinkItem href="https://ncdc.gov.in/" label="National Institute Of" />
//               <LinkItem href="https://idsp.nic.in/" label="Integrated Disease Surveillance" />
//               <li className="pt-1">
//                 <a
//                   href="https://mtpl.work/dph/en/light/implinks"
//                   className="inline-flex items-center gap-2 text-[15px] font-medium transition-colors"
//                   style={{ color: COLORS.accent }}
//                 >
//                   Read More
//                   <FaChevronRight aria-hidden="true" />
//                 </a>
//               </li>
//             </ul>
//           </nav>

//           {/* Contact Us */}
//           <address className="not-italic">
//             <SectionHeading>Contact Us</SectionHeading>
//             <ul className="space-y-4">
//               <ContactRow icon={FaMapMarkerAlt}>
//                 Ground Floor, HOD Building, Bhubaneswar- 751001
//               </ContactRow>
//               <ContactRow icon={FaEnvelope} href="mailto:dph.orissa@gmail.com">
//                 dph[dot]orissa[at]gmail[dot]com
//               </ContactRow>
//               <ContactRow icon={FaPhone} href="tel:+916742396977">
//                 91-674-2396977
//               </ContactRow>
//             </ul>
//           </address>
//         </div>
//       </motion.div>

//       {/* Bottom Bar */}
//       <div
//         className="relative mt-2 w-full py-3 text-center text-[13px]"
//         style={{ backgroundColor: COLORS.bottom, color: COLORS.textDim }}
//       >
//         © {new Date().getFullYear()} Department of Public Health | All Rights Reserved
        
//       </div>
//     </footer>
//   );
// };

// export default AllFooterComponent;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaChevronRight } from "react-icons/fa";
import { useGlobalTranslation } from "@/hooks/useGlobalTranslation"; 
import { Link } from "react-router-dom";

import { COLORS, FACET_BG } from "./constants";
import SectionHeading from "./SectionHeading";
import LinkItem from "./LinkItem";
import ContactRow from "./ContactRow";
import LogoRail from "./LogoRail";

const AllFooterComponent = () => {
  const { translate } = useGlobalTranslation(); 
  const [footerData, setFooterData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/footer-data`);
        setFooterData(response.data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch footer data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  if (isLoading) {
    return (
        <footer className="text-center p-10 bg-[#5f77a5]">
            Loading Footer...
        </footer>
    );
  }

  if (error) {
    return (
        <footer className="text-center p-10 bg-[#5f77a5] text-red-300">
            Error: {error}
        </footer>
    );
  }

  if (!footerData) return null; 

  return (
    <footer
      className={`relative isolate bg-[#5f77a5] ${FACET_BG} bg-blend-multiply`}
      aria-labelledby="site-footer-heading"
    >
      <h2 id="site-footer-heading" className="sr-only">
        Site footer
      </h2>

      <LogoRail logos={footerData.logoRail} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative mx-auto w-[95%] md:w-[88%] px-4 md:px-2 pb-10 pt-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Useful Links */}
          <nav aria-label={translate(footerData.usefulLinks, 'title')}>
            <SectionHeading>{translate(footerData.usefulLinks, 'title')}</SectionHeading>
            <ul className="space-y-3">
              {footerData.usefulLinks.links.map((link, index) => (
                <LinkItem
                  key={index}
                  href={link.href}
                  label={translate(link, 'title')}
                />
              ))}
              {footerData.usefulLinks.links.length >= 5 && <li className="pt-1">
                <Link
                  to={footerData.usefulLinks.readMore.href}
                  className="inline-flex items-center gap-2 text-[15px] font-medium transition-colors"
                  style={{ color: COLORS.accent }}
                >
                  {translate(footerData.usefulLinks.readMore, 'title')}
                  <FaChevronRight aria-hidden="true" />
                </Link>
              </li> }
            </ul>
          </nav>

          {/* Important Links */}
          <nav aria-label={translate(footerData.importantLinks, 'title')}>
            <SectionHeading>{translate(footerData.importantLinks, 'title')}</SectionHeading>
            <ul className="space-y-3">
               {footerData.importantLinks.links.map((link, index) => (
                <LinkItem
                  key={index}
                  href={link.href}
                  label={translate(link, 'title')}
                />
              ))}
              {footerData.importantLinks.links.length >= 5 && <li className="pt-1">
                <Link
                  to={footerData.importantLinks.readMore.href}
                  className="inline-flex items-center gap-2 text-[15px] font-medium transition-colors"
                  style={{ color: COLORS.accent }}
                >
                  {translate(footerData.importantLinks.readMore, 'title')}
                  <FaChevronRight aria-hidden="true" />
                </Link>
              </li> }
            </ul>
          </nav>

          {/* Contact Us */}
          <address className="not-italic">
            <SectionHeading>{translate(footerData.contactInfo, 'title')}</SectionHeading>
            <ul className="space-y-4">
              <ContactRow icon={FaMapMarkerAlt}>
                {translate(footerData.contactInfo.address, 'text')}
              </ContactRow>
              <ContactRow icon={FaEnvelope} href={footerData.contactInfo.email.href}>
                {translate(footerData.contactInfo.email, 'text')}
              </ContactRow>
              <ContactRow icon={FaPhone} href={footerData.contactInfo.phone.href}>
                {translate(footerData.contactInfo.phone, 'text')}
              </ContactRow>
            </ul>
          </address>
          


        </div>
      </motion.div>

      {/* Bottom Bar with Total Visitors on the right, vertically centered */}
    <div
          className="relative mt-2 w-full py-3 px-4 flex justify-evenly items-center text-[13px]"
          style={{ backgroundColor: COLORS.bottom, color: COLORS.textDim }}
        >
     {/* Left: copyright */}
      <div className="text-left">
        © {new Date().getFullYear()} Department of Public Health | All Rights Reserved
      </div>

      {/* Right: Total Visitors */}
      <div className="text-right text-white font-large">
            Total Visitors: {footerData.totalVisitors}
      </div>
    </div>

    </footer>
  );
};

export default AllFooterComponent;