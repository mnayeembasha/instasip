import React from 'react';
// import Header from './components/Header';
import DiscoverProducts from '@/components/DiscoverProducts';
import AboutProduct from '@/components/AboutProduct';
import UnleashCreativity from '@/components/UnleashCreativity';
import WhyChooseUs from '@/components/WhyChooseUs';
// import MissionVision from '@/components/MissionVision';
// import HowToUsePreMix from '@/components/HowToUsePreMix';
// import HowToUseGreenTea from '@/components/HowToUseGreenTea';
import Benefits from '@/components/Benefits';
import InstasipBenefitsHomepage from "@/components/InstasipBenefitsHomepage";
import SustainablePackaging from '@/components/SustainablePackaging';
import Footer from '@/components/Footer';
import WhatsAppIcon from '@/components/WhatsappIcon';
import Hero from '@/components/Hero';


const App: React.FC = () => {
  return (


      <div className="min-h-screen bg-background text-gray-800 pb-15 md:pb-0">
      <main>
        <Hero />
        <InstasipBenefitsHomepage/>
        <DiscoverProducts />
        <AboutProduct />
        <UnleashCreativity />
        <WhyChooseUs />
        {/* <MissionVision /> */}
        {/* <HowToUsePreMix /> */}
        {/* <HowToUseGreenTea /> */}
        <Benefits />
        <SustainablePackaging />
      </main>
      <Footer />
      <WhatsAppIcon />
    </div>
  );
};

export default App;
