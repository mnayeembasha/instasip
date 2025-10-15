import React from 'react';
import { Link } from 'react-router-dom';

const SustainablePackaging: React.FC = () => {
  return (
    <section className="relative py-20 bg-white">
      {/* Background Image */}
      <div className="relative md:mx-20">
        <img
          src="sustainable.png"
          alt="Sustainable Packaging"
          className="w-full h-[60vh] object-cover"
        />

        {/* Overlay */}
        <div className="md:rounded-4xl absolute inset-0 bg-black/70 bg-opacity-40 flex flex-col justify-center items-center text-center px-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white mb-4">
            Sustainable Packaging
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-6">
            Our cups are designed to break down leaving no contaminating waste.
          </p>
            <Link to="/products" className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-accent transition-colors">
            Discover Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SustainablePackaging;
