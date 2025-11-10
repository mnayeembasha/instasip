import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const images = [
  { link: 'hero3.jpg', position: 'object-center' },
  { link: 'hero1.jpg', position: 'object-bottom' },
  { link: 'hero2.jpg', position: 'object-center' },
  { link: 'hero4.jpg', position: 'object-right' },
];

const desktopImages = [
  { link: 'hero1.jpg', position: 'object-bottom',href:"/products" },
  { link: 'hero2.jpg', position: 'object-center',href:"/coffee" },
  { link: 'hero3.jpg', position: 'object-center',href:"/products/lemon-tea" },
  { link: 'hero4.jpg', position: 'object-right',href:"/products/masala-tea" },
];

const Hero: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="flex flex-col justify-center items-center font-archivo text-neutral-950 pt-20 md:py-20 bg-gradient-to-r from-amber-200 via-amber-50 to-amber-200"
    >
      {/* Content */}
      <div data-aos="fade-out" className="container mx-auto px-4 text-center pt-15 mb-12 ">
        <motion.h1 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-6xl 2xl:text-7xl mb-4 drop-shadow-lg tracking-tighter"
        >
          {/*Elevate Your Sips*/}
        Brew Less<span className="">.</span> Sip More<span className="">.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="md:hidden text-xl md:text-xl 2xl:text-2xl mb-8 max-w-lg mx-auto opacity-95 drop-shadow-md"
        >
          {/*Where Tradition Meets Innovation in Every Effortless Brew*/}
   Experience instant aromatic freshness with eco-friendly tea cups, blending convenience with pure taste
   </motion.p>
    <motion.p 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      className="hidden md:block text-xl md:text-xl 2xl:text-2xl mb-8 max-w-lg md:max-w-2xl mx-auto opacity-95 drop-shadow-md text-neutral-800"
    >
          {/*Where Tradition Meets Innovation in Every Effortless Brew*/}
Experience instant aromatic freshness with eco-friendly tea cups, blending convenience with pure taste and a touch of everyday mindful luxury   </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="space-x-4"
        >
          <a
            href="/products"
            className="bg-primary text-white px-10 py-[0.85rem] rounded-full font-semibold hover:bg-accent transition-all duration-300 drop-shadow-lg"
          >
            Shop Now
          </a>
          <a
            href="#about"
            className="border-2 border-white bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary transition-all duration-300 drop-shadow-lg"
          >
            Learn More
          </a>
        </motion.div>
      </div>
      
      {/* Mobile Slideshow */}
      <div className="container mx-auto md:px-4 md:hidden">
        <div className="relative w-full max-w-7xl 2xl:max-w-[90vw] mx-auto h-120 md:h-140 md:rounded-4xl overflow-hidden">
          <img
            src={images[currentImage].link}
            alt={`Hero ${currentImage + 1}`}
            className={`w-full h-full object-cover mask-t-from-5% md:mask-none ${images[currentImage].position}`}
          />
          {/* Slideshow indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`w-2 h-2 rounded-full ${idx === currentImage ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Marquee */}
      <div className="hidden md:block container mx-auto md:px-4 relative 2xl:mt-10">
        <div className="relative w-full max-w-7xl 2xl:max-w-[90vw] mx-auto  rounded-4xl overflow-hidden">
          {/* Left mask */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-amber-200 to-transparent z-10 pointer-events-none"></div>
          
          {/* Right mask */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-amber-200 to-transparent z-10 pointer-events-none"></div>
          
          {/* Marquee container */}
          <div className="flex animate-marquee group/marquee">
            {/* First set of images */}
            {desktopImages.map((image, idx) => (
              <a 
                key={`first-${idx}`} 
                href={image.href}
                className="flex-shrink-0 w-[350px] 2xl:w-[500px] h-50 2xl:h-75 px-2 hover:pause-animation"
              >
                <img
                  src={image.link}
                  alt={`Hero ${idx + 1}`}
                  className={`w-full h-full object-cover rounded-xl ${image.position}`}
                />
              </a>
            ))}
            {/* Second set of images for seamless loop */}
            {desktopImages.map((image, idx) => (
              <a 
                key={`second-${idx}`} 
                href={image.href}
                className="flex-shrink-0 w-[350px] 2xl:w-[500px] h-50 2xl:h-75 px-2 hover:pause-animation"
              >
                <img
                  src={image.link}
                  alt={`Hero ${idx + 1}`}
                  className={`w-full h-full object-cover rounded-xl ${image.position}`}
                />
              </a>
            ))}
          </div>
        </div>

        
      </div>
    </section>
  );
};

export default Hero;