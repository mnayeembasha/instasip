import React from 'react';
import { IconPhone, IconMail, IconBrandInstagram, IconMapPin } from "@tabler/icons-react";

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-secondary text-white pt-12 pb-8">
      <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl tracking-tighter mb-4">Insta-Sip</h3>
          <p className="text-gray-200">Revolutionizing tea, one sip at a time.</p>
        </div>
        <div>
          <h4 className="text-xl tracking-tighter mb-4">Products</h4>
          <ul className="space-y-2 text-gray-200">
            <li><a href="#" className="hover:text-primary">Pre-Mix</a></li>
            <li><a href="#" className="hover:text-primary">Green Tea</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl tracking-tighter mb-4">Support</h4>
          <ul className="space-y-2 text-gray-200">
            <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
            <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary">FAQ</a></li>
          </ul>
        </div>
        <div className="">
      <h4 className="text-xl tracking-tighter mb-4 text-lg">Contact</h4>

      <div className="space-y-3 text-gray-200">
         <div className="space-y-4">
      {/* Phone */}
      <a href="tel:8074581961" className="flex items-center gap-3 hover:text-primary transition">
        <IconPhone className="w-6 h-6" />
        <span>8074581961</span>
      </a>
      <a href="tel:9885401716" className="flex items-center gap-3 hover:text-primary transition">
        <IconPhone className="w-6 h-6" />
        <span>9885401716</span>
      </a>

      {/* Email */}
      <a href="mailto:instasipfoodbeverages@gmail.com" className="flex items-center gap-3 hover:text-primary transition">
        <IconMail className="w-6 h-6" />
        <span>instasipfoodbeverages@gmail.com</span>
      </a>

      {/* Instagram */}
      <a href="https://www.instagram.com/_insta_sip/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary transition">
        <IconBrandInstagram className="w-6 h-6" />
        <span>@_insta_sip</span>
      </a>

      {/* Address / Google Maps */}
      <a
        href="https://www.google.com/maps/search/?api=1&query=No+18/1,+13th+cross+Sahara+building,+Hongasandra+Begur+Main+Road,+Opp+Emerald+School,+Bangalore+560068"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-3 hover:text-primary transition"
      >
        <IconMapPin className="w-6 h-6 mt-1" />
        <span>
          No 18/1, 13th cross Sahara building,<br />
          Hongasandra Begur Main Road,<br />
          Opp Emerald School, Bangalore, 560068
        </span>
      </a>
    </div>
      </div>
    </div>
      </div>
      <div className="border-t border-white/20 mt-8 pt-8 text-center">
        <p>&copy; 2025 Insta-Sip. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;