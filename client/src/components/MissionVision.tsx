import React from 'react';

const MissionVision: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 max-w-4xl">
        <div className="animate-slide-in-left">
          <h2 className="text-3xl font-bold mb-4 text-primary">Mission</h2>
          <p className="text-lg">
            To revolutionize tea drinking by delivering fresh, healthy, and flavorful sips through innovative, eco-friendly tea cups that bring convenience, quality and joy to every sip – anytime, anywhere.
          </p>
        </div>
        <div className="animate-slide-in-right">
          <h2 className="text-3xl font-bold mb-4 text-primary">Vision</h2>
          <p className="text-lg">
            To be the world’s most trusted and preferred tea brand, inspiring healthier lifestyles and sustainable choices while making premium tea accessible to everyone, everywhere.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 text-center">
        <div className="bg-gray-100 p-8 rounded-lg max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4 text-accent">Duration Highlights</h3>
          <p><strong>Pre-Mix Products:</strong> Best Before 120 days (3 months) from manufacturing date.</p>
          <p className="mt-2"><strong>Green-Tea Products:</strong> Best Before 24 months from manufacturing date.</p>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;