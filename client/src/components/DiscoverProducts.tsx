import React, { useState } from 'react';
import HomeProductCard from './HomeProductCard';

const preMixProducts = [
  { name: 'Masala Tea', price: '₹220', image: 'https://res.cloudinary.com/drzq4285d/image/upload/v1759487448/instasip/lkjopeknfhhx3vfce6ap.jpg',link:"/products/masala-tea" },
  { name: 'Coffee', price: '₹220', image: 'https://res.cloudinary.com/drzq4285d/image/upload/v1759487431/instasip/n67g3hlumuutxtrq96hw.jpg',link:"/products/coffee" },
  { name: 'Lemon Tea', price: '₹220', image: 'https://res.cloudinary.com/drzq4285d/image/upload/v1759487405/instasip/i7vacfkhpncjmibufu5l.jpg',link:"/products/lemon-tea" }
];

const greenTeaProducts = [
  { name: 'Pomegranate Flavoured Green Tea', price: '₹220', image: 'https://res.cloudinary.com/drzq4285d/image/upload/v1760536304/instasip/fjdz2k2irdp2jgvw4uco.jpg',link:"/products/pomegranate-flavoured-green-tea" },
  { name: 'Mint Flavoured Green Tea', price: '₹220', image: 'https://res.cloudinary.com/drzq4285d/image/upload/v1760536282/instasip/tmt6iezplgclvbxi8ot0.png',link:"/products/mint-flavoured-green-tea" },
  { name: 'Ginger Lemon Flavoured Green Tea', price: '₹220', image: 'https://res.cloudinary.com/drzq4285d/image/upload/v1760536260/instasip/hi0hbv8o0dx9azlvwebh.png',link:"/products/ginger-lemon-flavoured-green-tea" }
];

// Combine products for "All"
const allProducts = [ ...greenTeaProducts,...preMixProducts];

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
        <h2 data-aos="fade-in" className="text-4xl md:text-5xl lg:text-6xl text-center mb-6 text-primary tracking-tighter md:font-bold">
          Discover Our Products
        </h2>

        {/* Tabs */}
        <div  data-aos="fade-in"  className="flex justify-center mb-12">
          <div className="flex bg-secondary/10 rounded-full p-1 tracking-tighter">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2 rounded-full  transition-all duration-300
                ${activeTab === 'all'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-accent hover:bg-primary/10 hover:text-primary'
                }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('premix')}
              className={`px-6 py-2 rounded-full transition-all duration-300 tracking-tighter
                ${activeTab === 'premix'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-accent hover:bg-primary/10 hover:text-primary'
                }`}
            >
              Pre-Mix
            </button>
            <button
              onClick={() => setActiveTab('greentea')}
              className={`px-6 py-2 rounded-full transition-all duration-300 tracking-tighter
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
