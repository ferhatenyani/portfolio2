import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef, useMemo, useCallback, memo } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { throttle } from '../utils/throttle';

/**
 * AdminCaseStudy - Cinematic case study modal with one-image-per-frame storytelling
 * Horizontal mode: Each screenshot gets its own dedicated frame with context
 * Vertical mode: Stacked layout with clear visual hierarchy and spacing
 * Switches to vertical scroll at <1025px for optimal tablet/mobile viewing
 * Memoized to prevent unnecessary re-renders when parent updates
 */
function AdminCaseStudy({ isOpen, onClose, caseStudy }) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [zoomedFrame, setZoomedFrame] = useState(null);
  const scrollContainerRef = useRef(null);

  // Determine if we're in mobile/vertical mode based on screen size
  const [isVerticalLayout, setIsVerticalLayout] = useState(false);
  const [showKeyboardHints, setShowKeyboardHints] = useState(false);

  // Flatten panels into individual frames (one image per frame)
  const frames = useMemo(() => {
    if (!caseStudy) return [];

    const allFrames = [];

    // Intro frame
    allFrames.push({
      type: 'intro',
      title: caseStudy.title,
      description: caseStudy.description
    });

    // Create individual frames for each image with enhanced context
    caseStudy.panels.forEach((panel, panelIndex) => {
      panel.mockups.forEach((mockup, mockupIndex) => {
        allFrames.push({
          type: 'content',
          panelLabel: panel.label,
          panelTitle: panel.title,
          description: panel.description,
          mockup: mockup,
          imageNumber: mockupIndex + 1,
          totalImages: panel.mockups.length,
          panelIndex: panelIndex,
          isFirstInPanel: mockupIndex === 0,
          isLastInPanel: mockupIndex === panel.mockups.length - 1
        });
      });
    });

    return allFrames;
  }, [caseStudy]);

  // Track window size for responsive behavior (desktop breakpoint: 1025px)
  useEffect(() => {
    const checkLayout = () => {
      setIsVerticalLayout(window.innerWidth < 1025);
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

  // Reset to first frame when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentFrame(0);
      setZoomedFrame(null);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = 0;
        scrollContainerRef.current.scrollTop = 0;
      }
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen || !caseStudy) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (zoomedFrame !== null) {
          setZoomedFrame(null);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        navigateToFrame(currentFrame + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        navigateToFrame(currentFrame - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentFrame, zoomedFrame, onClose, caseStudy]);

  // Update active frame on scroll (properly throttled for performance)
  const handleScroll = useCallback(
    throttle(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollPosition = isVerticalLayout ? container.scrollTop : container.scrollLeft;
      const containerSize = isVerticalLayout ? container.offsetHeight : container.offsetWidth;
      const activeIndex = Math.round(scrollPosition / containerSize);
      setCurrentFrame(activeIndex);
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

  const navigateToFrame = useCallback((index) => {
    if (index < 0 || index >= frames.length) return;

    const container = scrollContainerRef.current;
    if (container) {
      const frameSize = isVerticalLayout ? container.offsetHeight : container.offsetWidth;

      if (isVerticalLayout) {
        container.scrollTo({
          top: frameSize * index,
          behavior: 'smooth'
        });
      } else {
        container.scrollTo({
          left: frameSize * index,
          behavior: 'smooth'
        });
      }
      setCurrentFrame(index);
    }
  }, [frames.length, isVerticalLayout]);

  if (!caseStudy) return null;

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
            {/* Close Button */}
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
            {!isVerticalLayout && currentFrame > 0 && (
              <motion.button
                onClick={() => navigateToFrame(currentFrame - 1)}
                className="absolute left-6 z-[10001] w-12 h-12 flex items-center justify-center bg-[var(--bg-primary)]/80 border-2 border-[var(--accent-cyan)] text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)] hover:text-[var(--bg-primary)] transition-all"
                style={{ cursor: 'none' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Previous frame"
              >
                <FaChevronLeft size={18} />
              </motion.button>
            )}

            {!isVerticalLayout && currentFrame < frames.length - 1 && (
              <motion.button
                onClick={() => navigateToFrame(currentFrame + 1)}
                className="absolute right-6 z-[10001] w-12 h-12 flex items-center justify-center bg-[var(--bg-primary)]/80 border-2 border-[var(--accent-cyan)] text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)] hover:text-[var(--bg-primary)] transition-all"
                style={{ cursor: 'none' }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Next frame"
              >
                <FaChevronRight size={18} />
              </motion.button>
            )}

            {/* Scroll Container */}
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

                  @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                  }

                  .animate-fade-in {
                    animation: fadeIn 0.4s ease-out;
                  }

                  /* Vertical Layout Spacing */
                  @media (max-width: 1024px) {
                    .scroll-container {
                      padding-right: 3.5rem !important;
                    }

                    .close-button {
                      right: 0.875rem !important;
                    }

                    .frame-content {
                      padding: 4rem 2rem !important;
                    }

                    .frame-header {
                      margin-bottom: 3rem !important;
                    }

                    .frame-image-container {
                      margin-top: 3rem !important;
                    }
                  }

                  @media (max-width: 640px) {
                    .scroll-container {
                      padding-right: 3.5rem !important;
                    }

                    .close-button {
                      right: 0.875rem !important;
                    }

                    .frame-content {
                      padding: 3rem 1.5rem !important;
                      padding-bottom: 8rem !important;
                    }

                    .frame-header {
                      margin-bottom: 2.5rem !important;
                    }

                    .frame-image-container {
                      margin-top: 2.5rem !important;
                    }
                  }

                  @media (max-width: 480px) {
                    .scroll-container {
                      padding-right: 3.25rem !important;
                    }

                    .close-button {
                      right: 0.825rem !important;
                    }

                    .frame-content {
                      padding: 2.5rem 1.25rem !important;
                      padding-bottom: 7rem !important;
                    }

                    .frame-header {
                      margin-bottom: 2rem !important;
                    }

                    .frame-image-container {
                      margin-top: 2rem !important;
                    }
                  }

                  @media (max-width: 375px) {
                    .scroll-container {
                      padding-right: 2.75rem !important;
                    }

                    .close-button {
                      right: 0.675rem !important;
                    }

                    .frame-content {
                      padding: 2rem 1rem !important;
                      padding-bottom: 6rem !important;
                    }

                    .frame-header {
                      margin-bottom: 1.75rem !important;
                    }

                    .frame-image-container {
                      margin-top: 1.75rem !important;
                    }
                  }
                `}
              </style>

              {/* Render Frames */}
              {frames.map((frame, frameIndex) => {
                if (frame.type === 'intro') {
                  return (
                    <div
                      key={frameIndex}
                      className={`${isVerticalLayout ? 'min-h-full' : 'min-w-full'} w-full h-full snap-start flex flex-col items-center justify-center px-6 py-12 bg-[var(--bg-secondary)]`}
                    >
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
                          className="text-5xl md:text-7xl font-bold gradient-text mb-6 leading-tight"
                          style={{ fontFamily: 'var(--font-pixel)' }}
                        >
                          {frame.title}
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed">
                          {frame.description}
                        </p>
                      </motion.div>
                    </div>
                  );
                }

                // Content Frame (one image per frame)
                return (
                  <div
                    key={frameIndex}
                    className={`frame-content ${isVerticalLayout ? 'min-h-full' : 'min-w-full'} w-full h-full snap-start flex items-center justify-center bg-[var(--bg-secondary)]`}
                    style={{
                      padding: isVerticalLayout ? '4rem 2rem' : '3rem 6rem'
                    }}
                  >
                    <div className={`max-w-7xl w-full h-full flex ${
                      !isVerticalLayout
                        ? 'flex-row items-center gap-12'
                        : 'flex-col items-center justify-center'
                    }`}>
                      {/* Header Section */}
                      <div className={`frame-header ${
                        !isVerticalLayout
                          ? 'flex-shrink-0 w-96 text-left'
                          : 'w-full text-center'
                      } ${isVerticalLayout ? 'mb-8' : 'mb-0'}`}>
                        {/* Feature Label with Progress */}
                        <div className={`flex items-center gap-3 mb-4 ${
                          !isVerticalLayout ? 'justify-start' : 'justify-center'
                        }`}>
                          <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] pixel-text uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)]" />
                            <span>{frame.panelLabel}</span>
                          </div>

                          {frame.totalImages > 1 && (
                            <>
                              <span className="text-[var(--text-tertiary)]/30">•</span>
                              <div className="text-xs text-[var(--accent-pink)] pixel-text">
                                {frame.imageNumber} / {frame.totalImages}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Feature Title - Only show on first image of panel */}
                        {frame.isFirstInPanel && (
                          <h2
                            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight mb-4"
                            style={{ fontFamily: 'var(--font-pixel)' }}
                          >
                            {frame.panelTitle}
                          </h2>
                        )}

                        {/* Feature Description - Only show on first image of panel */}
                        {frame.isFirstInPanel && (
                          <p className={`text-base md:text-lg text-[var(--text-secondary)] leading-relaxed ${
                            !isVerticalLayout ? 'max-w-none' : 'max-w-2xl mx-auto'
                          }`}>
                            {frame.description}
                          </p>
                        )}
                      </div>

                      {/* Image Container */}
                      <div className={`frame-image-container flex items-center justify-center ${
                        !isVerticalLayout
                          ? 'flex-1'
                          : 'w-full mt-6'
                      }`}>
                        <motion.div
                          className="relative"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: zoomedFrame === frameIndex ? 1.02 : 1 }}
                          transition={{ duration: 0.4 }}
                        >
                          <div
                            className={`relative overflow-hidden bg-[var(--bg-tertiary)] border-2 ${
                              zoomedFrame === frameIndex
                                ? 'border-[var(--accent-cyan)] shadow-[0_0_30px_rgba(0,255,255,0.4)]'
                                : 'border-[var(--accent-cyan)]/30 hover:border-[var(--accent-cyan)]/60'
                            } cursor-pointer transition-all duration-300 inline-block`}
                            style={{
                              borderRadius: '0.75rem'
                            }}
                            onClick={() => setZoomedFrame(zoomedFrame === frameIndex ? null : frameIndex)}
                          >
                            <img
                              src={frame.mockup.src}
                              alt={frame.mockup.alt}
                              className="block"
                              style={{
                                background: 'var(--bg-primary)',
                                borderRadius: '0.75rem',
                                maxHeight: isVerticalLayout ? '50vh' : '75vh',
                                width: 'auto',
                                height: 'auto',
                                maxWidth: '100%'
                              }}
                              loading="lazy"
                            />

                            {/* Zoom Indicator */}
                            {zoomedFrame !== frameIndex && (
                              <motion.div
                                className="absolute bottom-4 right-4 px-3 py-2 bg-[var(--bg-primary)]/90 border border-[var(--accent-cyan)]/50 text-[var(--text-tertiary)] text-xs pixel-text"
                                style={{ borderRadius: '0.375rem' }}
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                              >
                                Click to zoom
                              </motion.div>
                            )}
                          </div>

                          {/* Image Caption (if alt text is meaningful) */}
                          {frame.mockup.alt && frame.mockup.alt !== 'Mockup' && (
                            <p className={`text-sm text-[var(--text-tertiary)] mt-4 pixel-text ${
                              !isVerticalLayout ? 'text-left' : 'text-center'
                            }`}>
                              {frame.mockup.alt}
                            </p>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* Navigation Dots */}
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
              {frames.map((_, index) => (
                <button
                  key={index}
                  onClick={() => navigateToFrame(index)}
                  className={`navigation-dot transition-all ${
                    currentFrame === index
                      ? isVerticalLayout
                        ? 'h-8 w-2 bg-[var(--accent-cyan)] rounded-sm'
                        : 'w-8 h-2 bg-[var(--accent-cyan)] rounded-sm'
                      : 'w-2 h-2 bg-[var(--text-tertiary)]/30 hover:bg-[var(--text-tertiary)]/60 rounded-full'
                  }`}
                  style={{ cursor: 'none' }}
                  aria-label={`Go to frame ${index + 1}`}
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
export default memo(AdminCaseStudy);
