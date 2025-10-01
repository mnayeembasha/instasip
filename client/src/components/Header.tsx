import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary flex items-center">
          <span className="mr-2">🍵</span> {/* Placeholder logo */}
          Insta-Sip
        </div>
        <ul className="hidden md:flex space-x-6">
          <li><a href="#products" className="hover:text-primary transition-colors">Products</a></li>
          <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
          <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
        </ul>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-primary"
        >
          ☰
        </button>
      </nav>
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <ul className="px-4 py-2 space-y-2">
            <li><a href="#products" className="block hover:text-primary">Products</a></li>
            <li><a href="#about" className="block hover:text-primary">About</a></li>
            <li><a href="#contact" className="block hover:text-primary">Contact</a></li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;