import React from 'react';
import { IconLeaf, IconClock, IconCup } from '@tabler/icons-react';

const AboutProduct: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Heading & Description */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            About Our Product
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Insta-Sip revolutionizes your tea experience with our ready-to-brew tea cups. Fresh, organic leaves meet smart infusion technology for a hassle-free, delightful cup every time.
          </p>
        </div>

        {/* First Row: Text + Image */}
        {/* <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
          <div className="md:w-1/2 space-y-6 animate-slide-in-left">
            <p className="text-lg text-gray-700 leading-relaxed">
              Our signature <span className="font-semibold text-primary">infusion layer technology</span> keeps tea leaves fresh and ready for brewing. Just pour hot water, wait a few seconds, and enjoy a smooth, aromatic cup of tea—no bags, no strainers, no mess.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Perfect for your office desk, travel adventures, study sessions, or cozy home moments, Insta-Sip Tea Cups make tea preparation effortless and enjoyable.
            </p>
          </div>

          <div className="md:w-1/2 animate-slide-in-right">
            <img
              src="infusion_layer.jpeg"
              alt="Infusion Layer"
              className="rounded-3xl shadow-xl w-full h-[40vh] object-cover"
            />
          </div>
        </div> */}

        {/* Second Row: Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-6  bg-[#F9EEDC] rounded-xl shadow hover:shadow-lg transition">
            <IconLeaf className="text-primary w-12 h-12 mb-3" />
            <h4 className="font-semibold text-gray-800 mb-1">Organic Leaves</h4>
            <p className="text-gray-500 text-sm">Fresh, premium green tea leaves in every cup.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-[#F9EEDC] rounded-xl shadow hover:shadow-lg transition">
            <IconClock className="text-primary w-12 h-12 mb-3" />
            <h4 className="font-semibold text-gray-800 mb-1">Brew in Seconds</h4>
            <p className="text-gray-500 text-sm">Instant tea with no mess or waiting time.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-[#F9EEDC] rounded-xl shadow hover:shadow-lg transition">
            <IconCup className="text-primary w-12 h-12 mb-3" />
            <h4 className="font-semibold text-gray-800 mb-1">Portable & Safe</h4>
            <p className="text-gray-500 text-sm">Enjoy tea anywhere with spill-free, travel-ready cups.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/products"
            className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-primary/90 transition"
          >
            Explore Our Products
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutProduct;
