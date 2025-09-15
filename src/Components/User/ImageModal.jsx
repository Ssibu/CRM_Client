
import React, { useEffect, useRef, useState } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ImageModal = ({ photos, currentIndex, onClose, onNext, onPrev, link }) => {
  const modalRef = useRef();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 10);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onNext, onPrev]);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 200);
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
        show ? "opacity-100 bg-black/80" : "opacity-0 bg-black/0"
      }`}
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className={`relative bg-transparent p-4 max-w-5xl w-full flex items-center justify-center transform transition-all duration-200 ${
          show ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-6 text-white hover:text-gray-300"
          onClick={handleClose}
        >
          <FaTimes size={24} />
        </button>

        {/* Prev button */}
        <button
          className="absolute left-4 text-white hover:text-gray-300"
          onClick={onPrev}
        >
          <FaChevronLeft size={36} />
        </button>

        {/* Image */}
       {link ? <a href={link} target="_blank" >
         <img
          src={photos[currentIndex].photo_url}
          alt={photos[currentIndex].en_title}
          className="max-h-[80vh] max-w-full rounded-lg shadow-lg"
        /> 
       </a> :  <img
          src={photos[currentIndex].photo_url}
          alt={photos[currentIndex].en_title}
          className="max-h-[80vh] max-w-full rounded-lg shadow-lg"
        />}

        {/* Next button */}
        <button
          className="absolute right-4 text-white hover:text-gray-300"
          onClick={onNext}
        >
          <FaChevronRight size={36} />
        </button>

        {/* Caption */}
        <div className="absolute bottom-4 text-center text-white w-full">
          {photos[currentIndex].en_title} ({currentIndex + 1} of {photos.length})
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
