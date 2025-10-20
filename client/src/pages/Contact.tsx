import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconPhone, IconMail, IconBrandInstagram, IconMapPin, IconMessageCircle } from '@tabler/icons-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-accent mb-4">Get In Touch</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have a question or want to place an order? We're here to help!
            Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information Card */}
          <Card className="shadow-lg border-t-4 border-primary">
            <CardHeader className="tracking-tighter">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <IconMessageCircle className="w-7 h-7 text-primary" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Phone Numbers */}
              <div>
                <h3 className="font-semibold text-accent mb-3 flex items-center gap-2">
                  {/*<IconPhone className="w-5 h-5" />*/}
                  Phone Numbers
                </h3>
                <div className="space-y-3 ml-7">
                  <a
                    href="tel:8074581961"
                    className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <IconPhone className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">8074581961</span>
                  </a>
                  <a
                    href="tel:9885401716"
                    className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <IconPhone className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">9885401716</span>
                  </a>
                </div>
              </div>

              {/* Email */}
              <div>
                <h3 className="font-semibold text-accent mb-3 flex items-center gap-2">
                  {/*<IconMail className="w-5 h-5" />*/}
                  Email
                </h3>
                <div className="ml-7">
                  <a
                    href="mailto:instasipfoodbeverages@gmail.com"
                    className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <IconMail className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium break-all">instasipfoodbeverages@gmail.com</span>
                  </a>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="font-semibold text-accent mb-3 flex items-center gap-2">
                  {/*<IconBrandInstagram className="w-5 h-5" />*/}
                  Follow Us
                </h3>
                <div className="ml-7">
                  <a
                    href="https://www.instagram.com/_insta_sip/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-colors">
                      <IconBrandInstagram className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="font-medium">@_insta_sip</span>
                  </a>
                </div>
              </div>

              {/* Business Hours */}
              <div>
                <h3 className="font-semibold text-accent mb-3 flex items-center gap-2">
                  {/*<IconClock className="w-5 h-5" />*/}
                  Business Hours
                </h3>
                <div className="ml-7 space-y-2">
                  <div className="flex justify-between items-center text-gray-700">
                    <span>Monday - Saturday</span>
                    <span className="font-medium">9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-700">
                    <span>Sunday</span>
                    <span className="font-medium">10:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card className="shadow-lg border-t-4 border-accent">
            <CardHeader className="">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <IconMapPin className="w-7 h-7 text-accent" />
                Visit Our Store
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              {/* Address */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=No+18/1,+13th+cross+Sahara+building,+Hongasandra+Begur+Main+Road,+Opp+Emerald+School,+Bangalore+560068"
                target="_blank"
                rel="noopener noreferrer"
                className="block mb-6 group"
              >
                <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-lg p-6 hover:from-accent/10 hover:to-primary/10 transition-colors">
                  <div className="flex items-start gap-4">
                    {/*<div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/30 transition-colors">
                      <IconMapPin className="w-6 h-6 text-accent" />
                    </div>*/}
                    <div className="text-gray-700 leading-relaxed">
                      <p className="font-semibold text-accent mb-2">InstaSip Food & Beverages</p>
                      <p>No 18/1, 13th cross Sahara building,</p>
                      <p>Hongasandra Begur Main Road,</p>
                      <p>Opp Emerald School,</p>
                      <p>Bangalore, Karnataka 560068</p>
                    </div>
                  </div>
                </div>
              </a>

              {/* Map Embed */}
              <div className="rounded-lg overflow-hidden shadow-md border border-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.6447!2d77.6089!3d12.8588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDUxJzMxLjciTiA3N8KwMzYnMzIuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="InstaSip Location"
                  className="w-full"
                />
              </div>

              {/* Direction Button */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=No+18/1,+13th+cross+Sahara+building,+Hongasandra+Begur+Main+Road,+Opp+Emerald+School,+Bangalore+560068"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full bg-accent text-white py-3 px-4 rounded-lg font-medium hover:bg-primary transition-colors flex items-center justify-center gap-2"
              >
                <IconMapPin className="w-5 h-5" />
                Get Directions
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info Section */}
        <Card className="mt-8 shadow-lg bg-gradient-to-r from-primary/5 to-accent/5 mb-10 md:mb-0">
          <CardContent className="p-6 md:p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-accent mb-3">Need Help?</h2>
              <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
                Our customer support team is ready to assist you with product inquiries,
                bulk orders, or any questions you may have about our services.
              </p>
              <div className="flex gap-4 justify-center items-center">
                <a
                  href="tel:8074581961"
                  className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <IconPhone className="w-5 h-5" />
                  Call Us Now
                </a>
                <a
                  href="mailto:instasipfoodbeverages@gmail.com"
                  className="bg-white text-primary border-2 border-primary px-6 py-3 rounded-lg font-medium hover:bg-primary hover:text-white transition-colors flex items-center gap-2"
                >
                  <IconMail className="w-5 h-5" />
                  Send Email
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
