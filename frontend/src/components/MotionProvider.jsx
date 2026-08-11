import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MotionProvider = ({ children }) => {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) return undefined;

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1,
      anchors: { offset: -24 },
    });

    const update = (time) => lenis.raf(time * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    const context = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((element) => {
        gsap.fromTo(element,
          { autoAlpha: 0.35, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power4.out', scrollTrigger: { trigger: element, start: 'top 92%', once: true } },
        );
      });
    });

    return () => {
      context.revert();
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return children;
};

export default MotionProvider;
