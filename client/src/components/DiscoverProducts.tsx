import React, { useState } from 'react';
import HomeProductCard from './HomeProductCard';

const preMixProducts = [
  { name: 'Masala Tea', price: '₹20', image: 'https://res.cloudinary.com/drzq4285d/image/upload/v1759487448/instasip/lkjopeknfhhx3vfce6ap.jpg' },
  { name: 'Coffee', price: '₹25', image: 'https://res.cloudinary.com/drzq4285d/image/upload/v1759487431/instasip/n67g3hlumuutxtrq96hw.jpg' },
  { name: 'Lemon Tea', price: '₹18', image: 'https://res.cloudinary.com/drzq4285d/image/upload/v1759487405/instasip/i7vacfkhpncjmibufu5l.jpg' }
];

const greenTeaProducts = [
  { name: 'Pomegranate Flavoured Green Tea', price: '₹22', image: 'https://res.cloudinary.com/drzq4285d/image/upload/v1759487382/instasip/ddwxuzan8zph3efgqccj.jpg' },
  { name: 'Mint Flavoured Green Tea', price: '₹20', image: 'https://res.cloudinary.com/drzq4285d/image/upload/v1759487351/instasip/n5cqakcr6z0tsqrew4nk.jpg' },
  { name: 'Ginger Lemon Flavoured Green Tea', price: '₹24', image: 'https://res.cloudinary.com/drzq4285d/image/upload/v1759487329/instasip/v0seuojdg54ss0x7i0mm.jpg' }
];

// Combine products for "All"
const allProducts = [...preMixProducts, ...greenTeaProducts];

const DiscoverProducts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'premix' | 'greentea'>('all');

  const renderProducts = () => {
    let products;
    if (activeTab === 'premix') products = preMixProducts;
    else if (activeTab === 'greentea') products = greenTeaProducts;
    else products = allProducts;

    return (
      <div className="grid md:grid-cols-3 gap-8">
        {products.map((product, idx) => (
          <HomeProductCard key={idx} {...product} />
        ))}
      </div>
    );
  };

  return (
    <section id="products" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-primary">
          Discover Our Products
        </h2>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-secondary/10 rounded-full p-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300
                ${activeTab === 'all'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-accent hover:bg-primary/10 hover:text-primary'
                }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('premix')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300
                ${activeTab === 'premix'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-accent hover:bg-primary/10 hover:text-primary'
                }`}
            >
              Pre-Mix
            </button>
            <button
              onClick={() => setActiveTab('greentea')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300
                ${activeTab === 'greentea'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-accent hover:bg-primary/10 hover:text-primary'
                }`}
            >
              Green Tea
            </button>
          </div>
        </div>

        {/* Products */}
        {renderProducts()}
      </div>
    </section>
  );
};

export default DiscoverProducts;
