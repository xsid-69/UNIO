import { motion, useReducedMotion } from 'framer-motion';

const MotionDiv = motion.div;

const PageTransition = ({ children }) => {
  const reduced = useReducedMotion();
  return (
    <MotionDiv
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, y: -5 }}
      transition={{ duration: reduced ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      {children}
    </MotionDiv>
  );
};

export default PageTransition;
