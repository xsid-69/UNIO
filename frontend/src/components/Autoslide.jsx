import { ArrowRight } from '@phosphor-icons/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import PageHeader from './ui/PageHeader';

const slides = [
  { image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=82', label: 'Read with intention', title: 'A quieter digital library.', copy: 'Keep the right material close and give one subject your full attention.' },
  { image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=82', label: 'Prepare steadily', title: 'Build confidence before exams.', copy: 'Use notes, syllabus, and previous papers as one connected study routine.' },
  { image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=82', label: 'Make progress visible', title: 'Start with one useful step.', copy: 'A clear workspace helps you spend less time organising and more time learning.' },
];

export default function Autoslide() {
  return <div className="gallery-page"><PageHeader back eyebrow="Study perspective" title="A better learning rhythm" description="Simple principles for a calm and focused university workflow." /><Swiper effect="fade" loop autoplay={{ delay: 4800, disableOnInteraction: false }} pagination={{ clickable: true }} modules={[Autoplay, EffectFade, Pagination]} className="study-gallery">{slides.map((slide) => <SwiperSlide key={slide.title}><article className="gallery-slide"><img src={slide.image} alt="" /><div className="gallery-slide__shade" /><div className="gallery-slide__copy"><span>{slide.label}</span><h2>{slide.title}</h2><p>{slide.copy}</p><a href="/archive">Open study library <ArrowRight size={17} /></a></div></article></SwiperSlide>)}</Swiper></div>;
}
