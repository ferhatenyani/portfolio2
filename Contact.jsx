import { useState } from 'react';
import { motion } from 'framer-motion';
import PixelDegrade from '../components/PixelDegrade';
import PixelBorder from '../components/PixelBorder';
import PixelText from '../components/PixelText';
import AnimatedText from '../components/AnimatedText';
import PixelThemeBlock from '../components/PixelThemeBlock';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { SiUpwork } from 'react-icons/si';

/**
 * Contact Section - Email form + social links with pixel animations
 */
export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isFocused, setIsFocused] = useState({
    name: false,
    email: false,
    message: false
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // EmailJS integration will go here later
    console.log('Form submitted:', formData);
    alert('Form submission will be connected to EmailJS later!');
  };

  const socialLinks = [
    {
      name: 'GitHub',
      icon: <FaGithub />,
      url: '#',
      color: 'var(--accent-cyan)'
    },
    {
      name: 'LinkedIn',
      icon: <FaLinkedin />,
      url: '#',
      color: 'var(--accent-cyan)'
    },
    {
      name: 'Upwork',
      icon: <SiUpwork />,
      url: '#',
      color: 'var(--accent-amber)'
    },
    {
      name: 'Email',
      icon: <FaEnvelope />,
      url: 'mailto:your.email@example.com',
      color: 'var(--accent-pink)'
    }
  ];

  return (
    <section id="contact" className="relative py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 overflow-hidden bg-[var(--bg-secondary)]">
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-[var(--accent-cyan)] rounded-full opacity-10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Title */}
        <PixelDegrade delay={0.2}>
          <motion.div className="mb-4 sm:mb-5 md:mb-6 text-center">
            <span className="pixel-text text-base sm:text-lg md:text-xl lg:text-2xl text-[var(--accent-pink)] -mb-10 md:-mb-20 lg:-mb-25 block font-semibold">
              <PixelText delay={0.1} stagger={0.02}>
                // Get In Touch
              </PixelText>
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold gradient-text mb-0 leading-tight"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              <AnimatedText delay={0.3} stagger={0.032} glitchIntensity="high" variant="full">
                LET'S CREATE
              </AnimatedText>
              <br />
              <AnimatedText delay={0.3} stagger={0.032} glitchIntensity="high" variant="full">
                TOGETHER
              </AnimatedText>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto px-2">
              Whether you have a project in mind, need design expertise, or just want
              to connect—I'd love to hear from you.
            </p>
          </motion.div>
        </PixelDegrade>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-start">
          {/* Contact Form */}
          <div className="lg:col-span-3 w-full">
            <PixelDegrade delay={0.4}>
              <PixelThemeBlock delay={0.15}>
                <PixelBorder className="bg-[var(--bg-primary)] p-4 sm:p-6 md:p-8 lg:p-10" delay={0.6}>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs sm:text-sm pixel-text text-[var(--text-secondary)] mb-1.5 sm:mb-2"
                    >
                      Name
                    </label>
                    <motion.input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setIsFocused({ ...isFocused, name: true })}
                      onBlur={() => setIsFocused({ ...isFocused, name: false })}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-[var(--bg-secondary)] border-2 border-[var(--bg-tertiary)] text-[var(--text-primary)] focus:border-[var(--accent-cyan)] focus:outline-none transition-colors"
                      animate={{
                        borderColor: isFocused.name ? 'var(--accent-cyan)' : 'var(--bg-tertiary)'
                      }}
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs sm:text-sm pixel-text text-[var(--text-secondary)] mb-1.5 sm:mb-2"
                    >
                      Email
                    </label>
                    <motion.input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setIsFocused({ ...isFocused, email: true })}
                      onBlur={() => setIsFocused({ ...isFocused, email: false })}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-[var(--bg-secondary)] border-2 border-[var(--bg-tertiary)] text-[var(--text-primary)] focus:border-[var(--accent-cyan)] focus:outline-none transition-colors"
                      animate={{
                        borderColor: isFocused.email ? 'var(--accent-cyan)' : 'var(--bg-tertiary)'
                      }}
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs sm:text-sm pixel-text text-[var(--text-secondary)] mb-1.5 sm:mb-2"
                    >
                      Message
                    </label>
                    <motion.textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setIsFocused({ ...isFocused, message: true })}
                      onBlur={() => setIsFocused({ ...isFocused, message: false })}
                      required
                      rows="5"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-[var(--bg-secondary)] border-2 border-[var(--bg-tertiary)] text-[var(--text-primary)] focus:border-[var(--accent-cyan)] focus:outline-none resize-none transition-colors"
                      animate={{
                        borderColor: isFocused.message ? 'var(--accent-cyan)' : 'var(--bg-tertiary)'
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    className="relative w-full py-3 sm:py-3.5 md:py-4 text-sm sm:text-base bg-[var(--accent-cyan)] text-[var(--bg-primary)] font-bold pixel-text overflow-hidden group cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10">Send Message</span>

                    {/* Hover Animation */}
                    <motion.div
                      className="absolute inset-0 bg-[var(--accent-pink)]"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{ originX: 0 }}
                    />

                    <span className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                      Send Message
                    </span>
                  </motion.button>
                </form>
                </PixelBorder>
              </PixelThemeBlock>
            </PixelDegrade>
          </div>

          {/* Social Links */}
          <div className="lg:col-span-2 w-full">
            <PixelDegrade delay={0.5}>
              <div className="space-y-3 sm:space-y-4">
                <h3
                  className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-4 sm:mb-6"
                  style={{ fontFamily: 'var(--font-tech)' }}
                >
                  <AnimatedText delay={0.6} stagger={0.03} glitchIntensity="medium" variant="simple">
                    Connect With Me
                  </AnimatedText>
                </h3>

                {socialLinks.map((social, idx) => (
                  <PixelThemeBlock key={social.name} delay={0.2 + idx * 0.05} sparkles={false}>
                    <motion.a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[var(--bg-primary)] border-2 border-transparent hover:border-[var(--accent-cyan)] transition-all group cursor-pointer"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                      whileHover={{ x: 8 }}
                    >
                    <div
                      className="text-2xl sm:text-3xl transition-colors flex-shrink-0"
                      style={{ color: social.color }}
                    >
                      {social.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm sm:text-base text-[var(--text-primary)] pixel-text">
                        {social.name}
                      </p>
                      <p className="text-xs sm:text-sm text-[var(--text-tertiary)] truncate">
                        Connect on {social.name}
                      </p>
                    </div>

                    {/* Pixel Accent */}
                      <motion.div
                        className="ml-auto w-2 h-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: social.color }}
                      />
                    </motion.a>
                  </PixelThemeBlock>
                ))}
              </div>
            </PixelDegrade>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          className="mt-12 sm:mt-16 md:mt-20 pt-6 sm:pt-8 border-t border-[var(--bg-tertiary)] text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
        >
          <p className="text-[var(--text-tertiary)] pixel-text text-xs sm:text-sm px-4">
            © 2025 Ferhaten Yani. Crafted with precision and passion.
          </p>
          <motion.div
            className="mt-3 sm:mt-4 w-10 sm:w-12 h-1 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-pink)] mx-auto"
            animate={{
              scaleX: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
