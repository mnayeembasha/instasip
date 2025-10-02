import React from 'react';

const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl text-center">
        <h2 className="text-4xl font-bold mb-12 text-primary">Why Choose InstaSip?</h2>
        <p className="text-lg mb-16 text-gray-700 text-left md:text-center">
          We chose Insta-Sip because it solves a real problem in today’s fast-paced lifestyle—people love tea but don’t always have the time or setup to brew it properly.
          With our ready-to-use, eco-friendly tea cups, we bring together convenience, health, and taste in one product.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div className="relative rounded-lg overflow-hidden shadow-md animate-bounce-in">
            <img
              src="https://media.istockphoto.com/id/1344939844/photo/hand-holding-drawing-virtual-lightbulb-with-brain-on-bokeh-background-for-creative-and-smart.webp?a=1&b=1&s=612x612&w=0&k=20&c=Q1LGFdFoZQ0YRWTcHtSZpvfJ_DtgD86aMMuUYxPtz8s="
              alt="Innovative & Convenient"
              className="w-full h-[300px] object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/70 bg-opacity-40 flex flex-col justify-end items-center px-6 py-8">
              <h3 className="text-2xl font-semibold mb-2 text-white">Innovative & Convenient</h3>
              <p className="text-white text-center">Trendy, marketable, affordable & scalable.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative rounded-lg overflow-hidden shadow-md animate-bounce-in" style={{ animationDelay: '0.1s' }}>
            <img
              src="https://media.istockphoto.com/id/1263548947/photo/sustainable-lifestyle-and-environmental.webp?a=1&b=1&s=612x612&w=0&k=20&c=N_hzpwaHGLxTMU4hHFHtQYJCCGkM_NxIzHCY9ZZAW1o="
              alt="Sustainable Choice"
              className="w-full h-[300px] object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/70 bg-opacity-40 flex flex-col justify-end items-center px-6 py-8">
              <h3 className="text-2xl font-semibold mb-2 text-white">Sustainable Choice</h3>
              <p className="text-white text-center">Blends tradition with innovation for a lifestyle brand.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
