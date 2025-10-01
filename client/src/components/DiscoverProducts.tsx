import React, { useState } from 'react';
import HomeProductCard from './HomeProductCard';

const preMixProducts = [
  { name: 'Masala Tea', price: '₹20', image: 'https://cupji.com/cdn/shop/files/Namitafavourite_600x.jpg?v=1737123784' },
  { name: 'Coffee', price: '₹25', image: 'https://cupji.com/cdn/shop/files/CupJi_Premix_RW-02_600x600.jpg?v=1757736159' },
  { name: 'Cardamon Tea', price: '₹18', image: 'https://cupji.com/cdn/shop/files/26812_V-03_1_600x600.jpg?v=1757686218' }
];

const greenTeaProducts = [
  { name: 'Pomegranate', price: '₹22', image: 'https://cupji.com/cdn/shop/files/A7406587_600x600.jpg?v=1717648757' },
  { name: 'Mint', price: '₹20', image: 'https://cupji.com/cdn/shop/files/A7406588_600x.jpg?v=1717648154' },
  { name: 'Ginger Lemon', price: '₹24', image: 'https://cupji.com/cdn/shop/files/LEmonginger4_600x.jpg?v=1737116431' }
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
