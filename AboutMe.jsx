import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import PixelBorder from '../components/PixelBorder';
import PixelDegrade from '../components/PixelDegrade';
import PixelText from '../components/PixelText';

/**
 * About Me Section - Data Chip Design
 * Bio structured like a futuristic ID card/data chip with modules
 * Accordion-style sections for mobile (< 600px)
 */
export default function AboutMe() {
  const [openSection, setOpenSection] = useState(0);

  const bioSections = [
    {
      id: 0,
      label: "OVERVIEW",
      content: "Ferhaten — UI/UX designer & frontend developer crafting web experiences with soul, speed, and precision.",
      preview: "Ferhaten — UI/UX designer & frontend developer crafting web experiences..."
    },
    {
      id: 1,
      label: "EXPERTISE",
      content: "I design in Figma, build with React + TypeScript, style with Tailwind, and bring interfaces to life using Framer Motion — delivering production-ready products like embedded SaaS analytics dashboards, AI-powered medical assistants, and modern e-commerce web apps that perform flawlessly and drive real results.",
      preview: "I design in Figma, build with React + TypeScript, style with Tailwind..."
    },
    {
      id: 2,
      label: "BACKGROUND",
      content: "Final-year Computer Science student actively freelancing and shipping personal projects reaching thousands of users, with a sharp focus on accessibility, performance, and scalable design systems.",
      preview: "Final-year Computer Science student actively freelancing and shipping personal projects..."
    }
  ];

  const toggleSection = (id) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <section id="about" className="relative py-10 [@media(min-width:375px)]:py-11 [@media(min-width:480px)]:py-12 sm:py-16 md:py-20 px-4 [@media(min-width:375px)]:px-5 sm:px-6 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent-pink)] to-transparent opacity-30" />

      <div className="max-w-6xl mx-auto">
        {/* Section Title - Skills Style */}
        <motion.div
          className="mb-8 [@media(min-width:375px)]:mb-9 [@media(min-width:480px)]:mb-10 sm:mb-12 md:mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
        >
          <span className="pixel-text text-[var(--accent-cyan)] mb-2 block" style={{ fontSize: 'clamp(0.7rem, 3vw, 0.875rem)' }}>
            <PixelText delay={0.1} stagger={0.02}>
              // About me
            </PixelText>
          </span>

        </motion.div>

        {/* Data Chip Container - Wider for Large Screens */}
        <div className="max-w-[90%] [@media(min-width:375px)]:max-w-[88%] [@media(min-width:480px)]:max-w-[85%] sm:max-w-2xl md:max-w-3xl mx-auto">
          <PixelDegrade delay={0.4}>
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {/* Main Chip Card with notched corners */}
              <div
                className="relative bg-[var(--bg-secondary)] overflow-hidden"
                style={{
                  clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
                }}
              >
                <PixelBorder delay={0.5}>
                  {/* Header Module - Profile Label */}
                  <motion.div
                    className="bg-[var(--bg-tertiary)] p-3 [@media(min-width:375px)]:p-3.5 [@media(min-width:480px)]:p-4 sm:p-4 md:p-6 border-b-2 border-[var(--accent-cyan)]"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center justify-between gap-3 [@media(min-width:480px)]:gap-4 md:gap-6">
                      {/* Profile Image */}
                      <motion.div
                        className="w-12 h-12 [@media(min-width:375px)]:w-13 [@media(min-width:375px)]:h-13 [@media(min-width:480px)]:w-14 [@media(min-width:480px)]:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-[var(--bg-secondary)] border-2 border-[var(--accent-cyan)] relative overflow-hidden flex-shrink-0"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                      >
                        <img
                          src="/profilePic2.JPG"
                          alt="Ferhaten Profile"
                          className="w-full h-full object-cover"
                        />
                      </motion.div>

                      {/* Profile ID - Moved to Right */}
                      <div className="text-right">
                        <p className="font-mono text-[var(--text-tertiary)] uppercase tracking-wider" style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)' }}>
                          PROFILE ID
                        </p>
                        <p
                          className="font-bold text-[var(--accent-cyan)]"
                          style={{ fontFamily: 'var(--font-tech)', fontSize: 'clamp(1.125rem, 5vw, 1.5rem)' }}
                        >
                          FERHATEN
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Bio Module - ACCORDION ON MOBILE */}
                  <motion.div
                    className="p-4 [@media(min-width:375px)]:p-4.5 [@media(min-width:480px)]:p-5 sm:p-6 md:p-8 lg:p-10"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                  >
                    {/* Mobile: Accordion sections */}
                    <div className="[@media(max-width:599px)]:block hidden">
                      <div className="space-y-2">
                        {bioSections.map((section, index) => (
                          <div key={section.id} className="border border-[var(--text-tertiary)] border-opacity-20 overflow-hidden">
                            {/* Accordion Header */}
                            <button
                              onClick={() => toggleSection(section.id)}
                              className="w-full text-left bg-[var(--bg-tertiary)] hover:bg-opacity-80 transition-all"
                            >
                              {/* Header Row */}
                              <div className="flex items-center justify-between p-2.5 pb-1.5">
                                <span className="font-mono text-[var(--accent-cyan)] uppercase tracking-wider" style={{ fontSize: 'clamp(0.65rem, 2.8vw, 0.75rem)' }}>
                                  {section.label}
                                </span>

                                {/* Chevron Indicator */}
                                <motion.div
                                  className="text-[var(--accent-cyan)] font-mono flex-shrink-0"
                                  animate={{ rotate: openSection === section.id ? 180 : 0 }}
                                  transition={{ duration: 0.3, ease: "easeInOut" }}
                                  style={{ fontSize: 'clamp(0.7rem, 3vw, 0.85rem)' }}
                                >
                                  ▼
                                </motion.div>
                              </div>

                              {/* Preview Text (always visible) */}
                              <div className="px-2.5 pb-2.5">
                                <p className="text-[var(--text-secondary)] leading-relaxed" style={{ fontSize: 'clamp(0.75rem, 3vw, 0.85rem)' }}>
                                  {section.preview}{' '}
                                  {openSection !== section.id && (
                                    <span className="text-[var(--accent-cyan)] font-medium">Read more</span>
                                  )}
                                </p>
                              </div>
                            </button>

                            {/* Accordion Content (Remaining Text) */}
                            <AnimatePresence>
                              {openSection === section.id && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3, ease: "easeInOut" }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-2.5 pb-2.5 text-[var(--text-secondary)] leading-relaxed" style={{ fontSize: 'clamp(0.8rem, 3.2vw, 1rem)' }}>
                                    {section.content.replace(section.preview, '')}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>

                      {/* CTA below accordion */}
                      <p className="text-[var(--accent-cyan)] font-medium mt-4 text-center" style={{ fontSize: 'clamp(0.85rem, 3.5vw, 1rem)' }}>
                        Let's build something exceptional together.
                      </p>
                    </div>

                    {/* Desktop: Normal view (600px+) */}
                    <div className="[@media(max-width:599px)]:hidden block space-y-3 [@media(min-width:480px)]:space-y-3.5 sm:space-y-4 md:space-y-5 text-[var(--text-secondary)] leading-relaxed" style={{ fontSize: 'clamp(0.875rem, 3.5vw, 1.125rem)' }}>
                      <p>
                        Ferhaten — UI/UX designer & frontend developer crafting web experiences with soul, speed, and precision.
                      </p>
                      <p>
                        I design in Figma, build with React + TypeScript, style with Tailwind, and bring interfaces to life using Framer Motion — delivering production-ready products like embedded SaaS analytics dashboards, AI-powered medical assistants, and modern e-commerce web apps that perform flawlessly and drive real results.
                      </p>
                      <p>
                        Final-year Computer Science student actively freelancing and shipping personal projects reaching thousands of users, with a sharp focus on accessibility, performance, and scalable design systems.
                      </p>
                      <p className="text-[var(--accent-cyan)] font-medium mt-4 [@media(min-width:480px)]:mt-5 sm:mt-6 md:mt-8" style={{ fontSize: 'clamp(0.9rem, 3.75vw, 1.15rem)' }}>
                        Let's build something exceptional together.
                      </p>
                    </div>
                  </motion.div>

                  {/* Bottom Info Module - Location, Age & Status */}
                  <motion.div
                    className="bg-[var(--bg-tertiary)] p-3 [@media(min-width:375px)]:p-3.5 [@media(min-width:480px)]:p-4 sm:p-4 md:p-6 border-t-2 border-[var(--accent-pink)]"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.0 }}
                  >
                    <div className="grid grid-cols-3 gap-2 [@media(min-width:375px)]:gap-2.5 [@media(min-width:480px)]:gap-3 sm:gap-4 md:gap-6">
                      {/* Location */}
                      <div>
                        <p className="font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-1.5 [@media(min-width:480px)]:mb-2" style={{ fontSize: 'clamp(0.625rem, 2.5vw, 0.75rem)' }}>
                          LOCATION
                        </p>
                        <div className="flex items-center gap-1 [@media(min-width:375px)]:gap-1.5 [@media(min-width:480px)]:gap-2">
                          <div className="w-1.5 h-1.5 [@media(min-width:480px)]:w-2 [@media(min-width:480px)]:h-2 bg-[var(--accent-pink)] flex-shrink-0" />
                          <span className="font-mono text-[var(--accent-pink)] truncate" style={{ fontSize: 'clamp(0.7rem, 3vw, 1rem)' }}>
                            ALGERIA
                          </span>
                        </div>
                      </div>

                      {/* Age */}
                      <div>
                        <p className="font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-1.5 [@media(min-width:480px)]:mb-2" style={{ fontSize: 'clamp(0.625rem, 2.5vw, 0.75rem)' }}>
                          AGE
                        </p>
                        <div className="flex items-center gap-1 [@media(min-width:375px)]:gap-1.5 [@media(min-width:480px)]:gap-2">
                          <div className="w-1.5 h-1.5 [@media(min-width:480px)]:w-2 [@media(min-width:480px)]:h-2 bg-[var(--accent-cyan)] flex-shrink-0" />
                          <span className="font-mono text-[var(--accent-cyan)]" style={{ fontSize: 'clamp(0.7rem, 3vw, 1rem)' }}>
                            23
                          </span>
                        </div>
                      </div>

                      {/* Status - Available for Work */}
                      <div>
                        <p className="font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-1.5 [@media(min-width:480px)]:mb-2" style={{ fontSize: 'clamp(0.625rem, 2.5vw, 0.75rem)' }}>
                          STATUS
                        </p>
                        <div className="flex items-center gap-1 [@media(min-width:375px)]:gap-1.5 [@media(min-width:480px)]:gap-2">
                          <motion.div
                            className="w-1.5 h-1.5 [@media(min-width:480px)]:w-2 [@media(min-width:480px)]:h-2 bg-[var(--accent-cyan)] flex-shrink-0"
                            animate={{
                              opacity: [1, 0.3, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                          <span className="font-mono text-[var(--accent-cyan)] truncate" style={{ fontSize: 'clamp(0.7rem, 3vw, 1rem)' }}>
                            AVAILABLE FOR WORK
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </PixelBorder>

                {/* Circuit Line Decorations */}
                <svg
                  className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20"
                  style={{ mixBlendMode: 'screen' }}
                >
                  <motion.line
                    x1="0"
                    y1="50%"
                    x2="100%"
                    y2="50%"
                    stroke="var(--accent-cyan)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7, duration: 1.5 }}
                  />
                  <motion.line
                    x1="50%"
                    y1="0"
                    x2="50%"
                    y2="100%"
                    stroke="var(--accent-pink)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9, duration: 1.5 }}
                  />
                </svg>
              </div>

              {/* Corner Notch Accents */}
              <motion.div
                className="absolute top-0 left-0 w-3 h-3 [@media(min-width:480px)]:w-4 [@media(min-width:480px)]:h-4 border-t-2 border-l-2 border-[var(--accent-cyan)]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.3 }}
              />
              <motion.div
                className="absolute bottom-0 right-0 w-3 h-3 [@media(min-width:480px)]:w-4 [@media(min-width:480px)]:h-4 border-b-2 border-r-2 border-[var(--accent-pink)]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.3 }}
              />

              {/* Hover Tilt Effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                whileHover={{
                  rotateX: 2,
                  rotateY: 2,
                }}
                transition={{ duration: 0.3 }}
                style={{ perspective: 1000 }}
              />
            </motion.div>
          </PixelDegrade>
        </div>

        {/* Bottom Pixel Separator */}
        <motion.div
          className="mt-12 md:mt-14 h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)] to-transparent opacity-30"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4, duration: 1 }}
        />
      </div>
    </section>
  );
}
