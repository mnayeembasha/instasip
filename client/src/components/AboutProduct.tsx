import React from 'react';
import { IconLeaf, IconClock, IconCup } from '@tabler/icons-react';

const AboutProduct: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-gray-50 ">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Heading & Description */}
        <div data-aos="fade-in" className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tighter font-bold text-primary mb-4">
            About Our Product
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl md:mx-auto text-left md:text-center">
            Insta-Sip revolutionizes your tea experience with our ready-to-brew tea cups. Fresh, organic leaves meet smart infusion technology for a hassle-free, delightful cup every time.
          </p>
        </div>

        {/* Second Row: Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div data-aos="zoom-in" className="flex flex-col items-center text-center p-6  bg-[#F9EEDC] rounded-xl shadow hover:shadow-lg transition">
            <IconLeaf className="text-primary w-12 h-12 mb-3" />
            <h4 className="tracking-tight text-gray-800 mb-1">Organic Leaves</h4>
            <p className="text-gray-600 text-sm">Fresh, premium green tea leaves in every cup.</p>
          </div>
          <div data-aos="zoom-in" className="flex flex-col items-center text-center p-6 bg-[#F9EEDC] rounded-xl shadow hover:shadow-lg transition">
            <IconClock className="text-primary w-12 h-12 mb-3" />
            <h4 className=" text-gray-800 mb-1">Brew in Seconds</h4>
            <p className="text-gray-600 text-sm">Instant tea with no mess or waiting time.</p>
          </div>
          <div data-aos="zoom-in" className="flex flex-col items-center text-center p-6 bg-[#F9EEDC] rounded-xl shadow hover:shadow-lg transition">
            <IconCup className="text-primary w-12 h-12 mb-3" />
            <h4 className=" text-gray-800 mb-1">Portable & Safe</h4>
            <p className="text-gray-600 text-sm">Enjoy tea anywhere with spill-free, travel-ready cups.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/products"
            className="inline-block bg-primary text-white tracking-tighter shadow-xl px-6 py-3 rounded-xl shadow hover:bg-primary/90 transition"
          >
            Explore Our Products
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutProduct;
