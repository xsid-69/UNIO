import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
        duration: 0.4,
        ease: [0.25, 1, 0.5, 1] // Cubic bezier similar to iOS
    }
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
        duration: 0.2,
        ease: 'easeIn'
    }
  }
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
