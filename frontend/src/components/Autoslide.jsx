import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
// import required modules
import {Autoplay, EffectFade } from 'swiper/modules';

export default function App() {
  return (
    <>
      <Swiper
        spaceBetween={30}
        effect={'fade'}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay,EffectFade]}
        className="mySwiper text-black rounded-3xl w-full "
      >
        <SwiperSlide className='object-fill'><img src="https://i.pinimg.com/1200x/13/19/f4/1319f4d3f391acacc992ff9392f35c14.jpg" alt="" /></SwiperSlide>
        <SwiperSlide><img src="https://i.pinimg.com/1200x/50/29/bd/5029bd8c92916b025e032be0134572d7.jpg" alt="" /></SwiperSlide>
        <SwiperSlide><img src="https://i.pinimg.com/1200x/50/29/bd/5029bd8c92916b025e032be0134572d7.jpg" alt="" /></SwiperSlide>
        <SwiperSlide><img src="https://i.pinimg.com/1200x/78/30/1d/78301d0de37bc222369e665c3c5c59fa.jpg" alt="" /></SwiperSlide>
        
      </Swiper>
    </>
  );
}
