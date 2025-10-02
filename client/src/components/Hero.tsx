import React, { useState, useEffect } from 'react';

const images = [
  'hero4.jpg',
  'hero1.jpg',
  'hero2.jpg',
  'hero3.jpg',
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
      className="font-archivo relative bg-gradient-to-br from-primary/70 to-accent/70 text-white py-20 overflow-hidden min-h-screen md:h-[90vh] flex flex-col justify-center items-center"
    >
      {/* Background Image + Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-0"></div>
        <img
          src={images[currentImage]}
          alt={`Hero ${currentImage + 1}`}
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 text-center relative pt-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          Elevate Your Sips
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-95 drop-shadow-md">
          Where Tradition Meets Innovation in Every Effortless Brew
        </p>
        <div className="space-x-4 mb-12">
          <a
            href="/products"
            className="bg-primary text-white px-10 py-[0.85rem] rounded-full font-semibold hover:bg-white hover:text-primary transition-all duration-300 drop-shadow-lg"
          >
            Shop Now
          </a>
          <a
            href="#about"
            className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary transition-all duration-300 drop-shadow-lg"
          >
            Learn More
          </a>
        </div>
      </div>

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
    </section>
  );
};

export default Hero;
