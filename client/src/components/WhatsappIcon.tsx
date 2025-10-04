import React, { useEffect, useState } from 'react';
import { IconBrandWhatsapp } from '@tabler/icons-react';

const WhatsAppIcon: React.FC = () => {
  const phoneNumber = '8074581961';
  const countryCode = '91';
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) { 
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {show && (
        <a
          href={`https://wa.me/${countryCode}${phoneNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-20 md:bottom-6 right-6 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition duration-300"
        >
          <IconBrandWhatsapp size={28} />
        </a>
      )}
    </>
  );
};

export default WhatsAppIcon;
