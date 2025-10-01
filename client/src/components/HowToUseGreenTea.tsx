import React from 'react';

const HowToUseGreenTea: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-primary">How to Use Green-Tea Products</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center animate-slide-in-up">
            <img src="https://via.placeholder.com/200x200?text=Step+1" alt="Step 1" className="mx-auto mb-4 rounded-lg" />
            <h3 className="text-xl font-semibold mb-2">1. Pour hot water</h3>
          </div>
          <div className="text-center animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            <img src="https://via.placeholder.com/200x200?text=Step+2" alt="Step 2" className="mx-auto mb-4 rounded-lg" />
            <h3 className="text-xl font-semibold mb-2">2. Swirl & wait for 10 secs</h3>
          </div>
          <div className="text-center animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <img src="https://via.placeholder.com/200x200?text=Step+3" alt="Step 3" className="mx-auto mb-4 rounded-lg" />
            <h3 className="text-xl font-semibold mb-2">3. Fill the cup with hot water</h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToUseGreenTea;