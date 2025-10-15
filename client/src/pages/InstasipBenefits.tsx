import React from 'react';
import { IconLeaf, IconShieldCheck, IconClock, IconRecycle, IconBriefcase, IconHeart, IconEye, IconBone, IconBrain, IconActivity, IconBan, IconDroplet, IconWeight, IconDental, IconCup, IconFlame, IconSparkles, IconTrendingDown } from '@tabler/icons-react';
import {Link} from "react-router-dom";

const InstasipBenefits = () => {
  const benefits = [
    { icon: IconHeart, title: "Prevent Diabetes", color: "bg-orange-100" },
    { icon: IconEye, title: "Prevent Eye Disease", color: "bg-green-100" },
    { icon: IconBone, title: "Improve Bone Density", color: "bg-red-100" },
    { icon: IconBrain, title: "Improve Memory", color: "bg-blue-100" },
    { icon: IconActivity, title: "Reduce Cholesterol", color: "bg-yellow-100" },
    { icon: IconDroplet, title: "Lower Blood Pressure", color: "bg-emerald-100" },
    { icon: IconShieldCheck, title: "Cancer Prevention", color: "bg-teal-100" },
    { icon: IconHeart, title: "Protect Heart Health", color: "bg-sky-100" },
    { icon: IconWeight, title: "Weight Loss", color: "bg-amber-100" },
    { icon: IconDental, title: "Improves Dental Health", color: "bg-lime-100" }
  ];

  const features = [
    {
      icon: IconCup,
      title: "First of Its Kind",
      subtitle: "CUP MATERIAL",
      desc: "Cups made of 270 GSM revolutionary food grade paper with no wax coating and 100% biodegradable"
    },
    {
      icon: IconLeaf,
      title: "Premium Tea Quality",
      subtitle: "TEA QUALITY",
      desc: "Fresh organic tea leaves from India's best estates, ground and packaged to perfection"
    },
    {
      icon: IconFlame,
      title: "Smart Infusion Layer",
      subtitle: "INFUSION LAYER",
      desc: "Temperature-controlled techno layer mixes hot water with tea at the perfect rate"
    }
  ];

  const solutions = [
    { icon: IconClock, title: "Instant Preparation", desc: "No stove, filter, or boiling. Ready in seconds, anytime, anywhere" },
    { icon: IconLeaf, title: "Pure Organic", desc: "Natural tea leaves with holy basil, cardamom, ginger, lemon & masala. No preservatives" },
    { icon: IconBriefcase, title: "Perfect for Corporates", desc: "Save time, money, water, and manpower. Boost satisfaction with hygienic drinks" },
    { icon: IconShieldCheck, title: "Hygienic & Safe", desc: "100% hygienic and sealed for safety. No wax, no plastic, no preservatives" },
    { icon: IconRecycle, title: "Eco-Friendly", desc: "100% biodegradable & compostable. Banana fiber infusion layer reduces waste" }
  ];

  const corporateBenefits = [
    "Save man-hours and operational effort",
    "Reduce water and cleaning product usage",
    "Promote eco-conscious branding",
    "Keep workforce refreshed & energized"
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAFA' }}>
      {/* Hero Section */}
      <div className="pt-20 relative overflow-hidden" style={{ backgroundColor: '#4D301A' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Why Choose Instasip?</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Revolutionary tea brewing technology meets premium organic ingredients for the perfect cup every time
            </p>
          </div>
        </div>
      </div>

      {/* Innovation Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: '#4D301A' }}>
          Innovation That Stands Out
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2" style={{ borderColor: '#A86934' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#A86934' }}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm font-semibold mb-2" style={{ color: '#A86934' }}>{feature.subtitle}</p>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#4D301A' }}>{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Health Benefits Grid */}
      <div className="py-16" style={{ backgroundColor: '#F5F1ED' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#4D301A' }}>
              10 Powerful Health Benefits
            </h2>
            <p className="text-xl" style={{ color: '#6D6154' }}>
              Premium organic green tea packed with natural wellness
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 text-center hover:scale-105 transition-transform shadow-md">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${benefit.color}`}>
                  <benefit.icon className="w-8 h-8" style={{ color: '#4D301A' }} />
                </div>
                <h3 className="font-semibold text-sm" style={{ color: '#4D301A' }}>{benefit.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Solutions Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#4D301A' }}>
          Our Solution: Quick, Clean, Consistent
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, idx) => (
            <div key={idx} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all border-l-4" style={{ borderColor: '#A86934' }}>
              <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#A86934' }}>
                <solution.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#4D301A' }}>{solution.title}</h3>
              <p className="text-gray-600">{solution.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Corporate Benefits */}
      <div className="py-16" style={{ backgroundColor: '#4D301A' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Corporate Benefits</h2>
            <p className="text-xl text-white/90">Revolutionize workplace refreshments</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {corporateBenefits.map((benefit, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#A86934' }}>
                  <IconSparkles className="w-5 h-5 text-white" />
                </div>
                <p className="text-white text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl p-12 text-center shadow-2xl" style={{ background: `linear-gradient(135deg, #A86934 0%, #4D301A 100%)` }}>
          <h2 className="text-4xl font-bold text-white mb-6">
            Experience Tea, The Easy Way
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Naturally delicious. Responsibly made. Effortlessly served.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/products">
            <button className="px-8 py-4 bg-white rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg" style={{ color: '#4D301A' }}>
              Shop Now
            </button>
            </Link>
            {/*<button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
              Request Samples
            </button>*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstasipBenefits;