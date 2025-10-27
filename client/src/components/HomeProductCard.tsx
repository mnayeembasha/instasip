import React from 'react';
import {Link} from "react-router-dom";

interface HomeProductCardProps {
  name: string;
  price: string;
  image: string;
  link:string;
}

const HomeProductCard: React.FC<HomeProductCardProps> = ({ name, price, image,link }) => {
  return (
    <div data-aos="fade-in" className="relative rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 animate-fade-in-up">
      {/* Product Image */}
      <img src={image} alt={name} className="w-full h-96 object-cover" />

      {/* Gradient Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="text-lg tracking-tight mb-1">{name}</h3>
        {/*<p className="text-xl font-bold mb-3" style={{ color: "#E7A873" }}>
          {price}
        </p>*/}
        <Link to={link}>
          <button
            className="w-full py-2 bg-gray-200/20 text-white rounded-full transition-colors cursor-pointer"
          >
            Buy Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomeProductCard;
