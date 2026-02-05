import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';

export default function Autoslide() {
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
      title: "Advanced Technology",
      subtitle: "Empowering your learning with AI"
    },
    {
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80",
      title: "Digital Library",
      subtitle: "Access thousands of resources"
    },
    {
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80",
      title: "Master Your Skills",
      subtitle: "Practice with real-world problems"
    },
    {
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
      title: "Community Growth",
      subtitle: "Learn and collaborate together"
    }
  ];

  return (
    <>
      <Swiper
        spaceBetween={0}
        effect={'fade'}
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
            clickable: true,
            dynamicBullets: true,
        }}
        modules={[Autoplay, EffectFade, Pagination]}
        className="mySwiper w-full h-full rounded-2xl"
      >
        {slides.map((slide, index) => (
           <SwiperSlide key={index} className='relative w-full h-full'>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover transition-transform duration-[10s] ease-linear hover:scale-110" 
              />
              <div className="absolute bottom-6 left-6 z-20 text-white animate-[fadeIn_0.5s_ease-out]">
                 <h2 className="text-2xl md:text-3xl font-bold mb-1 drop-shadow-lg">{slide.title}</h2>
                 <p className="text-gray-200 text-sm md:text-base drop-shadow-md">{slide.subtitle}</p>
              </div>
           </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
