import React from 'react';
import { IconCup, IconLeaf, IconDroplet, IconRecycle, IconBolt, IconArrowRight, IconSparkles } from '@tabler/icons-react';
import {Link} from "react-router-dom";
const InstasipBenefitsHomepage = () => {
  const benefits = [
    {
      icon: IconCup,
      heading: "Cup Material",
      tagline: "Made from 270 GSM biodegradable food-grade paper with no wax coating, ensuring an eco-friendly and fresh tea experience.",
      gradient: "from-amber-400 to-orange-500",
      position: "top"
    },
    {
      icon: IconLeaf,
      heading: "Tea Quality",
      tagline: "Crafted using fresh organic tea leaves sourced via fair trade from India's best estates, ground and packaged to perfection.",
      gradient: "from-emerald-400 to-green-600",
      position: "right"
    },
    {
      icon: IconDroplet,
      heading: "Infusion Layer",
      tagline: "A high-quality techno layer lets only hot water mix with tea at regulated rates, giving the perfect flavor every sip.",
      gradient: "from-blue-400 to-cyan-500",
      position: "bottom-right"
    },
    {
      icon: IconRecycle,
      heading: "Eco-Friendly Cups",
      tagline: "Free from wax coating and plastic linings, made from edible-grade materials that are 100% biodegradable.",
      gradient: "from-teal-400 to-emerald-500",
      position: "bottom-left"
    },
    {
      icon: IconBolt,
      heading: "Instant Preparation",
      tagline: "No stove or filter needed — ready in seconds anytime, anywhere for a quick, clean, and consistent tea experience.",
      gradient: "from-purple-400 to-pink-500",
      position: "left"
    }
  ];

  const BenefitCard = ({ benefit }) => {
    const Icon = benefit.icon;
    return (
      <div className="bg-white rounded-2xl p-5 w-96 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-base font-bold mb-2 text-primary">{benefit.heading}</h3>
        <p className="text-xs text-gray-600 leading-relaxed">{benefit.tagline}</p>
      </div>
    );
  };

  return (
    <div className="font-archivo py-20 sm:px-6 px-4 lg:px-15" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 rounded-full mb-4" style={{ backgroundColor: '#A86934', color: 'white' }}>
            <span className="text-sm font-semibold tracking-wide">REVOLUTIONIZING TEA</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl mb-4 tracking-tighter leading-tight text-primary md:font-bold">
            Why Instasip is Different
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#6D6154' }}>
            The world's first infusion-layer tea cup. Premium organic tea meets cutting-edge convenience.
          </p>
        </div>

        {/* Rainbow Benefits Layout - Desktop */}
        <div className="hidden lg:block relative mb-32">
          <div className="relative w-full" style={{ height: '750px' }}>
            {/* Center Image */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
  <div className="relative">
    {/* Glow / background gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full blur-2xl opacity-10"></div>
    
    {/* Outer circle with gradient border */}
    <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-gray-300 to-gray-200 p-[6px]">
      {/* Inner white circle with full image */}
      <div className="w-full h-full rounded-full bg-white overflow-hidden">
        <img
          src="/logo.jpg"
          alt="Instasip Logo"
          className="w-full h-full  object-bottom rounded-full"
        />
      </div>
    </div>
  </div>
</div>


            {/* Top Benefit */}
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
              <div className="group cursor-pointer">
                <BenefitCard benefit={benefits[0]} />
                <div className="w-0.5 h-6 bg-gradient-to-b from-gray-200 to-transparent mx-auto"></div>
              </div>
            </div>

            {/* Right Benefit */}
            <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
              <div className="group cursor-pointer flex items-center">
                <div className="w-16 h-0.5 bg-gradient-to-l from-gray-200 to-transparent"></div>
                <div className="hover:translate-x-2 transition-all duration-300">
                  <BenefitCard benefit={benefits[1]} />
                </div>
              </div>
            </div>

            {/* Bottom Right Benefit */}
            <div className="absolute bottom-4 right-32 transform translate-y-0">
              <div className="group cursor-pointer">
                <div className="w-0.5 h-16 bg-gradient-to-t from-gray-200 to-transparent mx-auto mb-0"></div>
                <div className="hover:translate-y-2 transition-all duration-300">
                  <BenefitCard benefit={benefits[2]} />
                </div>
              </div>
            </div>

            {/* Bottom Left Benefit */}
            <div className="absolute bottom-4 left-32 transform translate-y-0">
              <div className="group cursor-pointer">
                <div className="w-0.5 h-16 bg-gradient-to-t from-gray-200 to-transparent mx-auto mb-0"></div>
                <div className="hover:translate-y-2 transition-all duration-300">
                  <BenefitCard benefit={benefits[3]} />
                </div>
              </div>
            </div>

            {/* Left Benefit */}
            <div className="absolute top-1/2 left-8 transform -translate-y-1/2">
              <div className="group cursor-pointer flex items-center">
                <div className="hover:-translate-x-2 transition-all duration-300">
                  <BenefitCard benefit={benefits[4]} />
                </div>
                <div className="w-16 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden mb-16">
          {/* Center Image */}
        <div className="hidden flex justify-center mb-12">
  <div className="relative">
    {/* Glow / background */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full blur-2xl opacity-10"></div>

    {/* Outer gradient ring */}
    <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-primary to-secondary p-[6px] shadow-lg">
      {/* Inner circle */}
      <div className="w-full h-full rounded-full bg-white overflow-hidden">
        <img
          src="/logo.jpg"
          alt="Instasip Logo"
          className="w-full h-full object-cover object-top rounded-full"
        />
      </div>
    </div>
  </div>
</div>



          {/* Benefits Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="group cursor-pointer">
                  <div className="bg-gradient-to-tr from-white  to-amber-50 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-base font-bold mb-2 text-primary">{benefit.heading}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{benefit.tagline}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Highlight */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br rounded-3xl p-10 text-white shadow-xl hover:shadow-2xl transition-all duration-300" style={{ background: 'linear-gradient(135deg, #4D301A 0%, #A86934 100%)' }}>
            <h3 className="text-3xl font-bold mb-4">First of Its Kind</h3>
            <p className="text-lg mb-6 text-white/90">
              Revolutionary 270 GSM food-grade paper cup with smart infusion technology. No wax coating, 100% biodegradable.
            </p>
            <div className="flex items-center gap-2">
              {/*<IconSparkles className="w-6 h-6" />*/}
              {/*<span className="font-semibold">Patent-Pending Technology</span>*/}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <h3 className="text-3xl font-bold mb-4 text-primary">Perfect for Corporates</h3>
            <ul className="space-y-3">
              {['Save operational hours', 'Reduce water usage', 'Eco-conscious branding', 'Energized workforce'].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#A86934' }}>
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/benefits" 
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            style={{ backgroundColor: '#A86934', color: 'white' }}
          >
            View All Benefits
            <IconArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="mt-4 text-sm" style={{ color: '#6D6154' }}>
            Discover all 10 health benefits and technical innovations
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstasipBenefitsHomepage;