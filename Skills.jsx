import { motion } from 'framer-motion';
import PixelText from '../components/PixelText';
import AnimatedText from '../components/AnimatedText';

/**
 * Skills Section - OPTIMIZED & RESPONSIVE
 * Mobile-first design with progressive reveal animations (320px+)
 * GPU-accelerated scroll animations for consistent performance
 */
export default function Skills() {
  const skillCategories = [
    {
      name: 'Specialization',
      color: 'pink',
      skills: ['Framer Motion Mastery', 'Performance & Optimization', 'Responsive & Mobile-First Design','Micro-Interactions', 'Scroll-Driven Animations', 'Component-Driven Development']
    },
    {
      name: 'Frontend Development',
      color: 'cyan',
      skills: ['React', 'TypeScript', 'TanStack Query', 'Zustand', 'Tailwind CSS', 'JavaScript', 'React Native']
    },
    {
      name: 'Animation & Motion',
      color: 'pink',
      skills: ['Framer Motion', 'CSS Animations', 'GSAP ScrollTrigger', 'Three.js']
    },
    {
      name: 'Design Tools',
      color: 'amber',
      skills: ['Figma', 'Adobe XD', 'Adobe Illustrator', 'Adobe Photoshop']
    },
    {
      name: 'Development Tools',
      color: 'cyan',
      skills: ['Git & GitHub','Vercel & Netlify Deployments', 'Linux', 'Jira', 'Chrome DevTools', 'Docker']
    }
  ];

  const getColorVar = (color) => {
    const colors = {
      cyan: 'var(--accent-cyan)',
      pink: 'var(--accent-pink)',
      amber: 'var(--accent-amber)'
    };
    return colors[color] || colors.cyan;
  };

  return (
    <section id="skills" className="relative py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Pixel Grid Background */}
      <div className="absolute inset-0 pixel-grid-bg opacity-5" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Title */}
        <motion.div
          className="mb-12 sm:mb-16 lg:mb-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
        >
          <span className="pixel-text text-xs sm:text-sm text-[var(--accent-amber)] mb-2 block">
            <PixelText delay={0.1} stagger={0.02}>
              // Technical Arsenal
            </PixelText>
          </span>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text mb-3 sm:mb-4"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            <AnimatedText delay={0.2} stagger={0.03} glitchIntensity="high" variant="full">
              SKILLS & TOOLS
            </AnimatedText>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto px-4">
            A versatile toolkit spanning design, development, and animation—
            continuously expanding with emerging technologies.
          </p>
        </motion.div>

        {/* Skills Grid - Mobile-first responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
          {skillCategories.map((category, categoryIdx) => (
            <motion.div
              key={category.name}
              className="space-y-4 sm:space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.5,
                delay: categoryIdx * 0.08,
                ease: [0.16, 1, 0.3, 1]
              }}
              style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div
                  className="w-2 h-2 sm:w-3 sm:h-3"
                  style={{ backgroundColor: getColorVar(category.color) }}
                />
                <h3
                  className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]"
                  style={{ fontFamily: 'var(--font-tech)' }}
                >
                  {category.name}
                </h3>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {category.skills.map((skill, skillIdx) => (
                  <motion.div
                    key={skill}
                    className="group"
                    initial={{ opacity: 0, y: 12, scale: 0.92 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "0px 0px -200px 0px", amount: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: skillIdx * 0.025,
                      ease: [0.21, 0.45, 0.27, 0.9]
                    }}
                    style={{
                      willChange: 'transform, opacity',
                      transform: 'translateZ(0)'
                    }}
                  >
                    <motion.div
                      className="relative px-3 py-2 sm:px-4 sm:py-2.5 bg-[var(--bg-secondary)] border-2 cursor-default overflow-hidden"
                      style={{
                        borderColor: getColorVar(category.color),
                        willChange: 'transform',
                        transform: 'translateZ(0)'
                      }}
                      whileHover={{
                        scale: 1.05,
                        borderColor: 'var(--text-primary)'
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="relative z-10 text-[var(--text-primary)] font-medium pixel-text text-xs sm:text-sm">
                        {skill}
                      </span>

                      {/* Hover Background Fill */}
                      <motion.div
                        className="absolute inset-0"
                        style={{
                          backgroundColor: getColorVar(category.color),
                          originX: 0,
                          opacity: 0.1,
                          willChange: 'transform'
                        }}
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />

                      {/* Pixel Corner Accent */}
                      <div
                        className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: getColorVar(category.color) }}
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Accent - Responsive sizing */}
        <motion.div
          className="mt-12 sm:mt-16 lg:mt-20 flex justify-center gap-1.5 sm:gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ willChange: 'opacity' }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[var(--accent-cyan)]"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut'
              }}
              style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
