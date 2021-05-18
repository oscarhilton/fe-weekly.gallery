import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import styled from 'styled-components';

export default function SwiperComponent({ children }) {
  const slides = React.Children.toArray(children);
  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      pagination={{ clickable: false }}
      allowTouchMove={false}
      // onSlideChange={() => console.log('slide change')}
      // onSwiper={(swiper) => console.log(swiper)}
    >
      {slides && slides.length && slides.map(slide => (
        <SwiperSlide>
          <SlideContainer>
            {slide}
          </SlideContainer>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

const SlideContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;