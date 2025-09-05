"use client"

import React from 'react';
import { Star } from 'lucide-react';


const TestimonialSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">Success Stories</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Rahul Kumar",
              role: "Software Engineer",
              image: "assets/profile1.png",
              quote: "FirstStep AI helped me discover my passion for coding and guided me through every step."
            },
            {
              name: "James Wilson",
              role: "UX Designer",
              image: "assets/profile2.png",
              quote: "The personalized roadmap was exactly what I needed to transition into design."
            },
            {
              name: "Vijay",
              role: "Data Scientist",
              image: "assets/profile3.png",
              quote: "Thanks to FirstStep AI, I found my dream career in data science."
            }
          ].map((testimonial, index) => (
            <div key={index} className="p-8 rounded-xl bg-gradient-to-b from-violet-50 to-white">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600">"{testimonial.quote}"</p>
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;