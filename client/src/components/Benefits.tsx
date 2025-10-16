import React from 'react';

const Benefits: React.FC = () => {
  const benefits = [
    { title: 'Time-Saving', desc: 'Ready in 10 secs', image: 'https://media.istockphoto.com/id/1677846143/photo/time-management-planning.webp?a=1&b=1&s=612x612&w=0&k=20&c=5dC0CGCaS-8Vmcql80lJHMlqAtJTCHmsnQNtOFSZaKU=' },
    { title: 'Cost-Saving', desc: '₹20 per cup', image: 'https://images.unsplash.com/photo-1736319666684-a0f1f6b679cc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y29zdCUyMHNhdmluZ3xlbnwwfHwwfHx8MA%3D%3D' },
    { title: 'Portability', desc: 'Carry anywhere', image: 'https://images.unsplash.com/photo-1653888702916-599a590837c2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cG9ydGFiaWxpdHl8ZW58MHx8MHx8fDA%3D' },
    { title: 'Consistent Taste', desc: 'Same taste every cup', image: 'https://media.istockphoto.com/id/2231351867/photo/urkish-coffee-served-in-a-white-cup-with-a-rich-foamy-top.webp?a=1&b=1&s=612x612&w=0&k=20&c=C-nnN6Hhu40jSnr1Is1IVsYEawORzFjZVO3QodQWWyY=' },
    { title: 'Long Shelf Life', desc: 'No refrigeration', image: 'https://images.unsplash.com/photo-1631966518546-bb17f437ee70?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bG9uZyUyMHNoZWxmJTIwbGlmZXxlbnwwfHwwfHx8MA%3D%3D' },
    { title: 'Eco-Friendly', desc: 'Sustainable', image: 'https://media.istockphoto.com/id/1411289606/photo/paper-eco-friendly-disposable-tableware-with-recycling-signs-on-the-background-of-green-plants.webp?a=1&b=1&s=612x612&w=0&k=20&c=IsQIDLzWK0jvVJFbrMv_l_j4nLuZb56JDkhY_i9xbfo=' }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-center mb-12 text-primary">Key Benefits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="relative rounded-lg overflow-hidden shadow-lg h-64 animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
              {/* Image */}
              <img src={benefit.image} alt={benefit.title} className="w-full h-full object-cover" />

              {/* Overlay with text */}
              <div className="absolute inset-0 bg-black/70 bg-opacity-30 flex flex-col justify-end p-4">
                <h3 data-aos="fade-in-up" className="text-xl tracking-tighter text-white">{benefit.title}</h3>
                <p data-aos="fade-in-up" className="text-sm text-gray-300 mt-1">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
