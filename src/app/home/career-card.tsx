import { motion } from 'framer-motion';
import { getTextMaskVariants, liItemVariants } from './framer-motion-utils';

import { tv } from 'tailwind-variants';

interface CareerCardProps {
  company: string;
  description: string;
  duration: string;
  tasks: string[];
  image: string;
  reserved?: boolean;
}

const careerCardVariants = tv({
  base: 'flex w-full max-w-[1000px] items-center gap-16 max-md:flex-col max-md:items-start max-md:gap-8',
  variants: {
    reserved: {
      true: 'flex-row-reverse',
    },
  },
});

export default function CareerCard({
  company,
  description,
  duration,
  tasks,
  image,
  reserved,
}: CareerCardProps) {
  return (
    <motion.div
      initial='initial'
      whileInView='whileInView'
      exit='initial'
      className={careerCardVariants({ reserved })}
      viewport={{ amount: 1, margin: '100px' }}>
      <div className='flex flex-1 flex-col gap-4'>
        <div>
          <div className='overflow-hidden'>
            <motion.h2
              transition={{ duration: 1 }}
              variants={getTextMaskVariants('up')}
              className='w-fit text-4xl'>
              {company}
            </motion.h2>
          </div>
          <div>
            <div className='overflow-hidden'>
              <motion.p
                transition={{ duration: 1 }}
                variants={getTextMaskVariants('down')}>
                {description}
              </motion.p>
            </div>
            <div className='overflow-hidden'>
              <motion.p
                transition={{ duration: 1 }}
                variants={getTextMaskVariants('down')}>
                {duration}
              </motion.p>
            </div>
          </div>
        </div>
        <div className='overflow-hidden'>
          <motion.ul
            variants={{
              initial: {
                transition: { staggerChildren: 0.05, staggerDirection: -1 },
              },
              whileInView: {
                transition: { staggerChildren: 0.07, delayChildren: 0.2 },
              },
            }}>
            {tasks.map((task, index) => (
              <motion.li
                transition={{ duration: 1 }}
                key={index}
                variants={liItemVariants}>
                {task}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
      <div className='overflow-hidden'>
        <motion.img
          transition={{ duration: 1.5 }}
          variants={getTextMaskVariants(reserved ? 'down' : 'up', 'x', 2)}
          className='h-[300px] w-[500px] rounded-2xl object-cover'
          src={image}
        />
      </div>
    </motion.div>
  );
}
