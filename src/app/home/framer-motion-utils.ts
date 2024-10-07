export const getTextMaskVariants = (
  direction: 'up' | 'down' = 'up',
  axis: 'x' | 'y' = 'y',
  duration: number = 0.75
) => {
  const value = direction === 'up' ? '100%' : '-100%';
  if (axis === 'y') {
    return {
      initial: {
        y: value,
        transition: {
          duration,
          ease: [0.33, 1, 0.68, 1],
        },
      },
      whileInView: {
        y: '0%',
        transition: { duration, ease: [0.33, 1, 0.68, 1] },
      },
    };
  }
  return {
    initial: {
      x: value,
      transition: {
        duration,
        ease: [0.33, 1, 0.68, 1],
        type: 'keyframes',
      },
    },
    whileInView: {
      x: '0%',
      transition: { duration, ease: [0.33, 1, 0.68, 1] },
    },
  };
};

export const liItemVariants = {
  initial: {
    opacity: 0,
    y: '100%',
    transition: {
      y: { stiffness: 1000 },
    },
  },
  whileInView: {
    opacity: 1,
    y: '0%',
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
};
