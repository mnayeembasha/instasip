import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Instasip and how do I use it?",
    answer: "Instasip offers premium, instant beverage solutions like our signature premix coffee and green tea. Simply empty the sachet into a cup, add hot or cold water based on your preference, stir, and your perfect cup is ready in just 10 seconds!"
  },
  {
    question: "Are your products made with natural ingredients?",
    answer: "Yes, absolutely! We source the finest, high-quality natural ingredients. Our blends are crafted carefully to deliver an authentic taste without any artificial preservatives or harmful additives."
  },
  {
    question: "What is the shelf life of Instasip products?",
    answer: "Our products boast a long shelf life of up to 12 months from the date of manufacturing. Thanks to our advanced packaging, they do not require refrigeration and stay pristine anywhere you go."
  },
  {
    question: "Is your packaging environmentally friendly?",
    answer: "We are deeply committed to sustainability. Our packaging is mindfully designed to minimize environmental impact, so you can enjoy your daily cup guilt-free while helping the planet."
  },
  {
    question: "How does the pricing compare to regular cafe beverages?",
    answer: "At approximately ₹20 per cup, Instasip provides a highly cost-effective alternative to expensive cafe beverages, saving you time and money without ever compromising on the premium taste or quality."
  }
];

const Faqs: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find everything you need to know about our products, ingredients, and mission. We're here to ensure every sip is perfect.
          </p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-100 p-6 sm:p-8 md:p-10">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="border border-gray-100 rounded-2xl px-6 data-[state=open]:bg-gray-50/50 data-[state=open]:border-primary/20 transition-all duration-200"
              >
                <AccordionTrigger className="text-left text-[1.1rem] md:text-xl font-semibold text-gray-800 hover:text-primary transition-colors py-5 hover:no-underline [&[data-state=open]]:text-primary focus:outline-none">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-base md:text-lg leading-relaxed pb-5 pt-1">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Faqs;
