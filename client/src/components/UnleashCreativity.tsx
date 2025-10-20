import React from "react";

const UnleashCreativity: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#FAF5F0]">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tighter md:font-bold text-center mb-6 text-primary max-w-[80vw] mx-auto md:max-w-[unset] leading-tight">
          Unleash Your Creativity With InstaSip
        </h2>
        <p className="md:text-center text-lg mb-16 max-w-2xl mx-auto text-gray-600">
          Experiment with different flavors and create your own unique recipes.
          Our innovative cups give you the freedom to enjoy delicious hot or cold drinks anytime.
        </p>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-10">
          {/* Card 1 */}
          <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
            <img
              src="https://images.unsplash.com/photo-1563912318602-3c017a39e996?w=800&auto=format&fit=crop&q=60"
              alt="Hot Tea"
              className="w-full h-80 object-cover group-hover:opacity-70 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4 transition-all duration-500 group-hover:bg-black/50">
              <h3 data-aos="fade-in" className="text-2xl tracking-tighter text-white mb-2">Hot Brew</h3>
              <p data-aos="fade-in" className="text-white/90">Classic warmth in seconds.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
            <img
              src="https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&auto=format&fit=crop&q=60"
              alt="Iced Tea"
              className="w-full h-80 object-cover group-hover:opacity-70 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4 transition-all duration-500 group-hover:bg-black/50">
              <h3 data-aos="fade-in" className="text-2xl tracking-tighter text-white mb-2">Iced Delight</h3>
              <p data-aos="fade-in" className="text-white/90">Refresh with a chill twist.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
            <img
              src="https://plus.unsplash.com/premium_photo-1731696604013-52ccf4c49bd9?w=800&auto=format&fit=crop&q=60"
              alt="Custom"
              className="w-full h-80 object-cover group-hover:opacity-70 transition-transform duration-500"
            />
            <div  className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4 transition-all duration-500 group-hover:bg-black/50">
              <h3 data-aos="fade-in" className="text-2xl tracking-tighter text-white mb-2">Your Recipe</h3>
              <p data-aos="fade-in" className="text-white/90">Mix and match flavors.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UnleashCreativity;
