import React from 'react';
import { IconBrandWhatsapp } from '@tabler/icons-react';

const WhatsAppIcon: React.FC = () => {
  const phoneNumber = '8074581961'; // From PDF
  const countryCode = '91'; // India

  return (
    <a
      href={`https://wa.me/${countryCode}${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 md:p-3 rounded-full shadow-2xl hover:bg-green-600 transition-all duration-300 transform hover:scale-110 z-50"
      aria-label="Chat on WhatsApp"
    >
      <IconBrandWhatsapp size={24} />
    </a>
  );
};

export default WhatsAppIcon;
