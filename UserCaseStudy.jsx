import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef, memo, useCallback, useMemo } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { throttle } from '../utils/throttle';

/**
 * UserCaseStudy - Mobile-optimized case study modal for user/student interfaces
 * Designed for portrait app screenshots with vertical scrolling on mobile devices
 * Switches to vertical scroll at <641px for optimal mobile viewing
 * Memoized to prevent unnecessary re-renders when parent updates
 */
function UserCaseStudy({ isOpen, onClose, caseStudy }) {
  const [currentPanel, setCurrentPanel] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const scrollContainerRef = useRef(null);

  // Determine if we're in mobile/vertical mode based on screen size
  const [isVerticalLayout, setIsVerticalLayout] = useState(false);
  const [showKeyboardHints, setShowKeyboardHints] = useState(false);

  // Track window size for responsive behavior (mobile breakpoint: 641px)
  useEffect(() => {
    const checkLayout = () => {
      setIsVerticalLayout(window.innerWidth < 641);
      setShowKeyboardHints(window.innerWidth >= 1024);
    };

    checkLayout();
    window.addEventListener('resize', checkLayout);
    return () => window.removeEventListener('resize', checkLayout);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Reset to first panel when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentPanel(0);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = 0;
        scrollContainerRef.current.scrollTop = 0;
      }
    }
  }, [isOpen]);

  // Keyboard navigation (always enabled)
  useEffect(() => {
    if (!isOpen || !caseStudy) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        navigateToPanel(currentPanel + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        navigateToPanel(currentPanel - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentPanel, onClose, caseStudy]);

  // Update active panel on scroll (properly throttled for performance)
  const handleScroll = useCallback(
    throttle(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollPosition = isVerticalLayout ? container.scrollTop : container.scrollLeft;
      const containerSize = isVerticalLayout ? container.offsetHeight : container.offsetWidth;
      const activeIndex = Math.round(scrollPosition / containerSize);
      setCurrentPanel(activeIndex);
    }, 100),
    [isVerticalLayout]
  );

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isOpen) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen, handleScroll]);

  // Dismiss zoom on any click anywhere
  useEffect(() => {
    if (!isOpen || !activeImageIndex) return;

    const handleClick = (e) => {
      const clickedElement = e.target;
      const isClickOnImage = clickedElement.tagName === 'IMG' || clickedElement.closest('.zoomed-image');

      if (!isClickOnImage) {
        setActiveImageIndex(null);
      }
    };

    setTimeout(() => {
      document.addEventListener('click', handleClick, true);
    }, 10);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [isOpen, activeImageIndex]);

  const navigateToPanel = useCallback((index) => {
    if (!caseStudy || index < 0 || index >= caseStudy.panels.length + 1) return;

    const container = scrollContainerRef.current;
    if (container) {
      const panelSize = isVerticalLayout ? container.offsetHeight : container.offsetWidth;

      if (isVerticalLayout) {
        container.scrollTo({
          top: panelSize * index,
          behavior: 'smooth'
        });
      } else {
        container.scrollTo({
          left: panelSize * index,
          behavior: 'smooth'
        });
      }
      setCurrentPanel(index);
    }
  }, [caseStudy, isVerticalLayout]);

  if (!caseStudy) return null;

  const totalPanels = caseStudy.panels.length + 1; // +1 for intro panel

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/90 z-[9999]"
            style={{ cursor: 'none' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="fixed inset-0 z-[10000] flex items-center justify-center"
            style={{ cursor: 'none' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close Button - Smaller on mobile */}
            <button
              onClick={onClose}
              className={`close-button absolute top-4 md:top-6 z-[10002] w-8 h-8 md:w-14 md:h-14 flex items-center justify-center bg-[var(--bg-primary)] border-2 border-[var(--accent-pink)] text-[var(--accent-pink)] hover:bg-[var(--accent-pink)] hover:text-[var(--bg-primary)] transition-all ${
                isVerticalLayout ? '' : 'right-4 md:right-6'
              }`}
              style={{
                boxShadow: '0 0 20px rgba(255, 0, 255, 0.3)',
                cursor: 'none'
              }}
              aria-label="Close modal"
            >
              <FaTimes className="text-base md:text-xl" />
            </button>

            {/* Keyboard Hints - Hidden below 1024px */}
            {showKeyboardHints && (
              <motion.div
                className={`absolute top-6 left-1/2 -translate-x-1/2 z-[10001] px-5 py-3 bg-[var(--bg-primary)]/90 border-2 border-[var(--accent-cyan)]/50 text-[var(--text-tertiary)] text-xs pixel-text pointer-events-none items-center gap-4 ${
                  isVerticalLayout ? 'hidden' : 'flex'
                }`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: isVerticalLayout ? 0 : 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.3 }}
                style={{
                  boxShadow: '0 0 15px rgba(0, 255, 255, 0.2)'
                }}
              >
                <span>Press <span className="text-[var(--accent-cyan)] mx-1">←</span> <span className="text-[var(--accent-cyan)] mx-1">→</span> to navigate</span>
                <span className="text-[var(--text-tertiary)]/50">|</span>
                <span>Press <span className="text-[var(--accent-pink)] mx-1">ESC</span> to close</span>
              </motion.div>
            )}

            {/* Navigation Arrows - Hidden in vertical layout */}
            {!isVerticalLayout && currentPanel > 0 && (
              <motion.button
                onClick={() => navigateToPanel(currentPanel - 1)}
                className="absolute left-6 z-[10001] w-12 h-12 flex items-center justify-center bg-[var(--bg-primary)]/80 border-2 border-[var(--accent-cyan)] text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)] hover:text-[var(--bg-primary)] transition-all"
                style={{ cursor: 'none' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Previous panel"
              >
                <FaChevronLeft size={18} />
              </motion.button>
            )}

            {!isVerticalLayout && currentPanel < totalPanels - 1 && (
              <motion.button
                onClick={() => navigateToPanel(currentPanel + 1)}
                className="absolute right-6 z-[10001] w-12 h-12 flex items-center justify-center bg-[var(--bg-primary)]/80 border-2 border-[var(--accent-cyan)] text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)] hover:text-[var(--bg-primary)] transition-all"
                style={{ cursor: 'none' }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Next panel"
              >
                <FaChevronRight size={18} />
              </motion.button>
            )}

            {/* Scroll Container - Adaptive direction */}
            <motion.div
              ref={scrollContainerRef}
              className={`w-full h-full ${
                isVerticalLayout
                  ? 'overflow-y-auto overflow-x-hidden flex-col snap-y'
                  : 'overflow-x-auto overflow-y-hidden flex snap-x'
              } flex snap-mandatory scroll-container`}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                cursor: 'none',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)'
              }}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <style>
                {`
                  .scroll-container::-webkit-scrollbar {
                    display: none;
                  }

                  /* Default padding for vertical layout */
                  .scroll-container {
                    padding-right: 0;
                  }

                  @keyframes fadeIn {
                    from {
                      opacity: 0;
                    }
                    to {
                      opacity: 1;
                    }
                  }

                  .animate-fade-in {
                    animation: fadeIn 0.4s ease-out;
                  }

                  /* ===== MOBILE LAYOUT STYLING (Portrait Screenshots) ===== */

                  /* Tablets and small laptops (900px to 1024px) */
                  @media (max-width: 1024px) and (min-width: 901px) {
                    .case-study-panel {
                      padding: 2rem 1.5rem;
                      padding-bottom: 5rem;
                    }

                    .case-study-panel-inner {
                      flex-direction: column;
                      gap: 2rem;
                      justify-content: center;
                    }

                    .case-study-text-content {
                      flex: 0 0 auto;
                      text-align: center;
                      max-width: 500px;
                      width: 100%;
                    }

                    .case-study-mockups {
                      gap: 1.5rem;
                      width: 100%;
                      max-width: 600px;
                    }

                    .mockup-primary {
                      height: 45vh !important;
                      max-height: 420px !important;
                    }

                    .mockup-secondary {
                      height: 38vh !important;
                      max-height: 360px !important;
                    }

                    .mockup-tertiary {
                      height: 32vh !important;
                      max-height: 300px !important;
                    }
                  }

                  /* Tablets portrait and landscape (641px to 900px) */
                  @media (max-width: 900px) and (min-width: 641px) {
                    .case-study-panel {
                      padding: 2rem 1.5rem;
                      padding-bottom: 5rem;
                    }

                    .case-study-panel-inner {
                      flex-direction: column;
                      gap: 2rem;
                      justify-content: center;
                    }

                    .case-study-text-content {
                      flex: 0 0 auto;
                      text-align: center;
                      max-width: 500px;
                      width: 100%;
                    }

                    .case-study-mockups {
                      gap: 1.5rem;
                      width: 100%;
                      max-width: 600px;
                    }

                    .mockup-primary {
                      height: 45vh !important;
                      max-height: 420px !important;
                    }

                    .mockup-secondary {
                      height: 38vh !important;
                      max-height: 360px !important;
                    }

                    .mockup-tertiary {
                      height: 32vh !important;
                      max-height: 300px !important;
                    }
                  }

                  /* Mobile landscape and small tablets (max-width: 768px) */
                  @media (max-width: 768px) {
                    .case-study-panel {
                      padding: 1.5rem 1.25rem;
                      padding-bottom: 5rem;
                    }

                    .case-study-mockups {
                      gap: 1rem;
                    }

                    .mockup-primary {
                      height: 40vh !important;
                      max-height: 380px !important;
                    }

                    .mockup-secondary {
                      height: 34vh !important;
                      max-height: 320px !important;
                    }

                    .mockup-tertiary {
                      height: 28vh !important;
                      max-height: 260px !important;
                    }
                  }

                  /* ===== VERTICAL SCROLL MODE - Mobile Portrait ===== */
                  @media (max-width: 640px) {
                    /* Scroll container padding for vertical layout */
                    .scroll-container {
                      padding-right: 3.5rem !important;
                    }

                    /* Close button - centered in black strip */
                    .close-button {
                      right: 0.875rem !important;
                    }

                    /* Navigation dots - centered in black strip */
                    .navigation-dots {
                      right: 0.875rem !important;
                      padding: 0.75rem 0.5rem !important;
                      gap: 0.625rem !important;
                      border-width: 1.5px !important;
                    }

                    .navigation-dot {
                      width: 0.5rem !important;
                    }

                    .navigation-dot.h-8 {
                      height: 2rem !important;
                    }

                    /* Intro panel */
                    .intro-panel {
                      padding: 3rem 1.5rem !important;
                      padding-bottom: 10rem !important;
                      background-color: var(--bg-secondary) !important;
                    }

                    /* Mobile layout panels */
                    .mobile-layout .case-study-panel {
                      padding: 2rem 1rem !important;
                      padding-bottom: 10rem !important;
                      overflow-y: visible;
                      background-color: var(--bg-secondary) !important;
                    }

                    .mobile-layout .case-study-panel-inner {
                      flex-direction: column !important;
                      gap: 3rem !important;
                      justify-content: flex-start !important;
                      align-items: center !important;
                      height: auto !important;
                      min-height: auto !important;
                    }

                    .mobile-layout .case-study-text-content {
                      flex: 0 0 auto !important;
                      text-align: center !important;
                      gap: 0.625rem;
                      max-width: 100%;
                      width: 100%;
                      z-index: 10;
                      margin-bottom: 0 !important;
                    }

                    /* Dribbble-inspired mockups container */
                    .mobile-layout .case-study-mockups {
                      position: relative;
                      width: 100%;
                      height: auto;
                      min-height: auto !important;
                      display: flex !important;
                      flex-direction: row !important;
                      flex-wrap: wrap !important;
                      gap: 1.5rem !important;
                      align-items: center !important;
                      justify-content: center !important;
                      max-height: none !important;
                      margin-top: 0 !important;
                    }

                    /* Dribbble-style mockups with rotations */
                    .mobile-layout .mockup-primary {
                      position: relative !important;
                      width: 60% !important;
                      max-width: 200px !important;
                      height: auto !important;
                      transform: rotate(-2deg) translateY(-8px) !important;
                      z-index: 3 !important;
                      box-shadow: 0 8px 20px rgba(255, 0, 255, 0.2), 0 12px 32px rgba(0, 255, 255, 0.15) !important;
                      transition: transform 0.3s ease, box-shadow 0.3s ease !important;
                      top: auto !important;
                      left: auto !important;
                      right: auto !important;
                      bottom: auto !important;
                    }

                    .mobile-layout .mockup-secondary {
                      position: relative !important;
                      width: 56% !important;
                      max-width: 185px !important;
                      height: auto !important;
                      transform: rotate(1.5deg) translateY(4px) !important;
                      z-index: 2 !important;
                      box-shadow: 0 6px 16px rgba(255, 0, 255, 0.16), 0 10px 28px rgba(0, 255, 255, 0.12) !important;
                      transition: transform 0.3s ease, box-shadow 0.3s ease !important;
                      top: auto !important;
                      left: auto !important;
                      right: auto !important;
                      bottom: auto !important;
                    }

                    .mobile-layout .mockup-tertiary {
                      position: relative !important;
                      width: 52% !important;
                      max-width: 170px !important;
                      height: auto !important;
                      transform: rotate(-1deg) translateY(0px) !important;
                      z-index: 1 !important;
                      box-shadow: 0 4px 12px rgba(255, 0, 255, 0.12), 0 8px 24px rgba(0, 255, 255, 0.1) !important;
                      transition: transform 0.3s ease, box-shadow 0.3s ease !important;
                      top: auto !important;
                      left: auto !important;
                      right: auto !important;
                      bottom: auto !important;
                    }

                    /* Active state */
                    .mobile-layout .mockup-primary.active-mobile,
                    .mobile-layout .mockup-secondary.active-mobile,
                    .mobile-layout .mockup-tertiary.active-mobile {
                      transform: scale(1.05) rotate(0deg) !important;
                      z-index: 10 !important;
                      box-shadow: 0 12px 32px rgba(255, 0, 255, 0.35), 0 16px 48px rgba(0, 255, 255, 0.3) !important;
                    }

                    /* Single image - centered with subtle tilt */
                    .mobile-layout .case-study-mockups:has(.mockup-primary:only-child) .mockup-primary {
                      transform: rotate(-1.5deg) !important;
                    }
                  }

                  /* Small mobile devices (max-width: 480px) */
                  @media (max-width: 480px) {
                    /* Scroll container padding */
                    .scroll-container {
                      padding-right: 3.25rem !important;
                    }

                    /* Close button - centered in black strip */
                    .close-button {
                      right: 0.825rem !important;
                    }

                    /* Navigation dots - centered in black strip */
                    .navigation-dots {
                      right: 0.825rem !important;
                      padding: 0.625rem 0.4rem !important;
                      gap: 0.5rem !important;
                    }

                    .navigation-dot {
                      width: 0.4rem !important;
                    }

                    .navigation-dot.h-8 {
                      height: 1.75rem !important;
                    }

                    .intro-panel {
                      padding: 2.5rem 1rem !important;
                      padding-bottom: 9rem !important;
                    }

                    .mobile-layout .case-study-panel {
                      padding: 1.75rem 0.875rem !important;
                      padding-bottom: 9rem !important;
                    }

                    .mobile-layout .case-study-panel-inner {
                      gap: 2.75rem !important;
                    }

                    .mobile-layout .case-study-mockups {
                      gap: 1.25rem !important;
                    }

                    .mobile-layout .mockup-primary {
                      max-width: 185px !important;
                      width: 58% !important;
                    }

                    .mobile-layout .mockup-secondary {
                      max-width: 170px !important;
                      width: 54% !important;
                    }

                    .mobile-layout .mockup-tertiary {
                      max-width: 155px !important;
                      width: 50% !important;
                    }
                  }

                  /* Very small screens (max-width: 375px) */
                  @media (max-width: 375px) {
                    /* Scroll container padding */
                    .scroll-container {
                      padding-right: 2.75rem !important;
                    }

                    /* Close button - centered in black strip */
                    .close-button {
                      right: 0.675rem !important;
                    }

                    /* Navigation dots - centered in black strip */
                    .navigation-dots {
                      right: 0.675rem !important;
                      padding: 0.5rem 0.35rem !important;
                      gap: 0.4rem !important;
                      border-width: 1px !important;
                    }

                    .navigation-dot {
                      width: 0.35rem !important;
                    }

                    .navigation-dot.h-8 {
                      height: 1.5rem !important;
                    }

                    .intro-panel {
                      padding: 2rem 0.75rem !important;
                      padding-bottom: 8.5rem !important;
                    }

                    .intro-panel h1 {
                      font-size: clamp(1.65rem, 5.5vw, 2.25rem) !important;
                      line-height: 1.15 !important;
                    }

                    .intro-panel p {
                      font-size: clamp(0.9rem, 4vw, 1.05rem) !important;
                      line-height: 1.5 !important;
                    }

                    .mobile-layout .case-study-panel {
                      padding: 1.5rem 0.75rem !important;
                      padding-bottom: 8.5rem !important;
                    }

                    .mobile-layout .case-study-panel-inner {
                      gap: 2.5rem !important;
                    }

                    .mobile-layout .case-study-mockups {
                      gap: 1.25rem !important;
                    }

                    .mobile-layout .mockup-primary {
                      max-width: 175px !important;
                      width: 58% !important;
                    }

                    .mobile-layout .mockup-secondary {
                      max-width: 160px !important;
                      width: 54% !important;
                    }

                    .mobile-layout .mockup-tertiary {
                      max-width: 145px !important;
                      width: 50% !important;
                    }
                  }

                  /* Extra small screens (320px) */
                  @media (max-width: 320px) {
                    /* Scroll container padding */
                    .scroll-container {
                      padding-right: 2.5rem !important;
                    }

                    /* Close button - centered in black strip */
                    .close-button {
                      right: 0.55rem !important;
                    }

                    /* Navigation dots - centered in black strip */
                    .navigation-dots {
                      right: 0.55rem !important;
                      padding: 0.4rem 0.3rem !important;
                      gap: 0.3rem !important;
                      border-width: 1px !important;
                    }

                    .navigation-dot {
                      width: 0.3rem !important;
                    }

                    .navigation-dot.h-8 {
                      height: 1.375rem !important;
                    }

                    .intro-panel {
                      padding: 1.75rem 0.625rem !important;
                      padding-bottom: 8rem !important;
                    }

                    .intro-panel h1 {
                      font-size: clamp(1.5rem, 6vw, 2rem) !important;
                      line-height: 1.1 !important;
                    }

                    .intro-panel p {
                      font-size: clamp(0.85rem, 4.2vw, 1rem) !important;
                    }

                    .mobile-layout .case-study-panel {
                      padding: 1.25rem 0.625rem !important;
                      padding-bottom: 8rem !important;
                    }

                    .mobile-layout .case-study-panel-inner {
                      gap: 2.25rem !important;
                    }

                    .mobile-layout .case-study-mockups {
                      gap: 1rem !important;
                    }

                    .mobile-layout .mockup-primary {
                      max-width: 160px !important;
                      width: 56% !important;
                    }

                    .mobile-layout .mockup-secondary {
                      max-width: 145px !important;
                      width: 52% !important;
                    }

                    .mobile-layout .mockup-tertiary {
                      max-width: 130px !important;
                      width: 48% !important;
                    }
                  }

                  /* Best practices for small screens (below 450px) */
                  @media (max-width: 450px) {
                    /* Scroll container padding */
                    .scroll-container {
                      padding-right: 3rem !important;
                    }

                    /* Close button - centered in black strip */
                    .close-button {
                      right: 0.75rem !important;
                    }

                    /* Navigation dots - centered in black strip */
                    .navigation-dots {
                      right: 0.75rem !important;
                      padding: 0.55rem 0.375rem !important;
                      gap: 0.45rem !important;
                    }

                    .navigation-dot {
                      width: 0.375rem !important;
                    }

                    .navigation-dot.h-8 {
                      height: 1.625rem !important;
                    }

                    .intro-panel {
                      padding: 2rem 1.25rem !important;
                      padding-bottom: 8.5rem !important;
                    }

                    .intro-panel h1 {
                      font-size: clamp(1.75rem, 5.2vw, 2.5rem) !important;
                      line-height: 1.15 !important;
                      letter-spacing: -0.02em !important;
                    }

                    .intro-panel p {
                      font-size: clamp(0.9rem, 3.6vw, 1.05rem) !important;
                      line-height: 1.5 !important;
                      max-width: 90% !important;
                      margin: 0 auto !important;
                    }

                    .intro-panel .inline-flex {
                      font-size: 0.7rem !important;
                      padding: 0.5rem 0.75rem !important;
                    }

                    .mobile-layout .case-study-panel {
                      padding: 2.25rem 1.25rem !important;
                      padding-bottom: 9rem !important;
                    }

                    .mobile-layout .case-study-panel-inner {
                      gap: 2.5rem !important;
                    }

                    .case-study-text-content {
                      gap: 0.75rem !important;
                      padding: 0 0.25rem !important;
                    }

                    .case-study-text-content .pixel-text {
                      font-size: 0.65rem !important;
                      letter-spacing: 0.05em !important;
                    }

                    .case-study-text-content h2 {
                      font-size: clamp(1.5rem, 4.8vw, 2rem) !important;
                      line-height: 1.2 !important;
                      letter-spacing: -0.01em !important;
                    }

                    .case-study-text-content p {
                      font-size: clamp(0.875rem, 3.4vw, 1rem) !important;
                      line-height: 1.55 !important;
                    }
                  }
                `}
              </style>

              {/* Intro Panel */}
              <div className={`intro-panel ${isVerticalLayout ? 'min-h-full' : 'min-w-full'} w-full h-full snap-start flex flex-col items-center justify-center px-6 py-12 bg-[var(--bg-secondary)]`}>
                <motion.div
                  className="max-w-3xl text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-[var(--bg-primary)] border-2 border-[var(--accent-cyan)]/40 text-[var(--text-tertiary)] text-xs pixel-text uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] animate-pulse" />
                    <span>Case Study</span>
                  </div>

                  {/* Title */}
                  <h1
                    className="text-6xl md:text-7xl font-bold gradient-text mb-6 leading-tight"
                    style={{ fontFamily: 'var(--font-pixel)' }}
                  >
                    {caseStudy.title}
                  </h1>

                  {/* Description */}
                  <p className="text-xl text-[var(--text-secondary)] leading-relaxed">
                    {caseStudy.description}
                  </p>
                </motion.div>
              </div>

              {/* Feature Panels */}
              {caseStudy.panels.map((panel, index) => {
                const totalMockups = panel.mockups.length;
                const bgColor = index % 2 === 0 ? 'var(--bg-secondary)' : 'var(--bg-primary)';

                return (
                  <div
                    key={index}
                    className={`case-study-panel ${isVerticalLayout ? 'min-h-full' : 'min-w-full'} w-full h-full snap-start flex items-center justify-center px-6 md:px-12 py-12`}
                    style={{
                      backgroundColor: bgColor
                    }}
                  >
                    <div className="case-study-panel-inner max-w-7xl w-full flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
                      {/* Text Content */}
                      <div className="case-study-text-content flex-shrink-0 lg:w-80 flex flex-col gap-4 animate-fade-in">
                        {/* Feature Label */}
                        <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] pixel-text uppercase tracking-widest">
                          <span className="w-1 h-1 rounded-full bg-[var(--accent-cyan)]" />
                          <span>{panel.label}</span>
                        </div>

                        {/* Feature Title */}
                        <h2
                          className="text-4xl md:text-5xl lg:text-4xl font-bold text-[var(--text-primary)] leading-tight"
                          style={{ fontFamily: 'var(--font-pixel)' }}
                        >
                          {panel.title}
                        </h2>

                        {/* Feature Description */}
                        <p className="text-lg md:text-base text-[var(--text-secondary)] leading-relaxed">
                          {panel.description}
                        </p>
                      </div>

                      {/* Mockups Container - Mobile Layout */}
                      <div className="case-study-mockups mobile-layout flex-1 flex gap-6 items-center justify-center animate-fade-in relative">
                        {panel.mockups.map((mockup, mockupIndex) => {
                          const imageKey = `${index}-${mockupIndex}`;
                          const isActive = activeImageIndex === imageKey;

                          // Mobile screenshots - height-based sizing
                          let mockupHeight, mockupMaxHeight, mockupClass;

                          if (totalMockups === 1) {
                            mockupHeight = '65vh';
                            mockupMaxHeight = '600px';
                            mockupClass = 'mockup-primary';
                          } else if (totalMockups === 2) {
                            mockupHeight = mockupIndex === 0 ? '60vh' : '55vh';
                            mockupMaxHeight = mockupIndex === 0 ? '560px' : '520px';
                            mockupClass = mockupIndex === 0 ? 'mockup-primary' : 'mockup-secondary';
                          } else {
                            mockupHeight = mockupIndex === 0 ? '65vh' : mockupIndex === 1 ? '50vh' : '42vh';
                            mockupMaxHeight = mockupIndex === 0 ? '600px' : mockupIndex === 1 ? '460px' : '380px';
                            mockupClass = mockupIndex === 0 ? 'mockup-primary' : mockupIndex === 1 ? 'mockup-secondary' : 'mockup-tertiary';
                          }

                          // Calculate horizontal shift for neighboring images
                          let xShift = 0;
                          if (activeImageIndex) {
                            const activeIndex = parseInt(activeImageIndex.split('-')[1]);
                            if (mockupIndex < activeIndex) {
                              xShift = -50;
                            } else if (mockupIndex > activeIndex) {
                              xShift = 50;
                            }
                          }

                          const activeScale = 1;
                          const inactiveScale = activeImageIndex ? 0.82 : 1;

                          return (
                            <motion.div
                              key={mockupIndex}
                              className={`${mockupClass} relative overflow-hidden bg-[var(--bg-tertiary)] border-2 border-[var(--accent-cyan)]/30 hover:border-[var(--accent-cyan)] cursor-pointer ${isActive ? 'zoomed-image active-mobile' : ''}`}
                              style={{
                                borderRadius: '0.5rem',
                                height: mockupHeight,
                                maxHeight: mockupMaxHeight,
                                width: 'auto',
                                willChange: 'transform, opacity',
                                backfaceVisibility: 'hidden',
                                perspective: 1000,
                                transformStyle: 'preserve-3d',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              onClick={() => {
                                setActiveImageIndex(isActive ? null : imageKey);
                              }}
                              animate={{
                                scale: isActive ? activeScale : inactiveScale,
                                x: isActive ? 0 : xShift,
                                opacity: activeImageIndex && !isActive ? 0.35 : 1,
                                zIndex: isActive ? 10 : 1
                              }}
                              transition={{
                                type: 'spring',
                                stiffness: 300,
                                damping: 30,
                                mass: 0.8
                              }}
                              whileHover={!isActive && !activeImageIndex ? {
                                y: -8,
                                transition: { duration: 0.2 }
                              } : {}}
                            >
                              {/* Mockup Image */}
                              <img
                                src={mockup.src}
                                alt={mockup.alt}
                                className="w-full h-full object-contain"
                                style={{
                                  background: 'var(--bg-primary)',
                                  pointerEvents: 'none',
                                  imageRendering: 'auto',
                                  backfaceVisibility: 'hidden',
                                  transform: 'translateZ(0)',
                                  WebkitFontSmoothing: 'antialiased',
                                  borderRadius: '0.5rem'
                                }}
                                loading="lazy"
                              />
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* Navigation Dots - Adaptive positioning */}
            <div
              className={`navigation-dots absolute z-[10001] ${
                isVerticalLayout
                  ? 'right-4 top-1/2 -translate-y-1/2 flex-col gap-3 py-4 px-2'
                  : 'bottom-6 left-1/2 -translate-x-1/2 flex-row gap-2 px-5 py-3'
              } flex bg-[var(--bg-primary)]/90 backdrop-blur-sm border-2 border-[var(--accent-cyan)]/40 ${
                isVerticalLayout ? 'rounded-lg' : 'rounded-full'
              }`}
              style={{
                boxShadow: '0 0 15px rgba(0, 255, 255, 0.2)'
              }}
            >
              {Array.from({ length: totalPanels }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => navigateToPanel(index)}
                  className={`navigation-dot transition-all ${
                    currentPanel === index
                      ? isVerticalLayout
                        ? 'h-8 w-2 bg-[var(--accent-cyan)] rounded-sm'
                        : 'w-8 h-2 bg-[var(--accent-cyan)] rounded-sm'
                      : 'w-2 h-2 bg-[var(--text-tertiary)]/30 hover:bg-[var(--text-tertiary)]/60 rounded-full'
                  }`}
                  style={{ cursor: 'none' }}
                  aria-label={`Go to panel ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Memoize component to prevent re-renders when parent updates
export default memo(UserCaseStudy);
