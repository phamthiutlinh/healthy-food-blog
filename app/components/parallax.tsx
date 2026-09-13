'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Parallax — moves its child slower/faster than the scroll.
 * @param speed 0.1 = subtle, 0.3 = strong. Negative moves opposite direction.
 * Uses rAF + translate3d only (GPU-friendly), disabled on prefers-reduced-motion.
 */
export function Parallax({
  children,
  speed = 0.15,
  className = '',
  style,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;
    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      // Distance of element center from viewport center
      const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translate3d(0, ${(-offset * speed).toFixed(1)}px, 0)`;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        raf = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [speed]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`} style={style}>
      {children}
    </div>
  );
}

/**
 * Reveal — fade/slide in once when scrolled into view.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.classList.add('is-visible');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms`, ['--reveal-y' as string]: `${y}px` }}
    >
      {children}
    </div>
  );
}

/**
 * HeroParallax — to be placed inside the hero container.
 * Give it refs to background + content to get classic hero parallax:
 * background drifts slower, content floats up + fades.
 */
export function useHeroParallax<T extends HTMLElement>() {
  const bgRef = useRef<T>(null);
  const contentRef = useRef<T>(null);

  useEffect(() => {
    const bg = bgRef.current;
    const content = contentRef.current;
    if (prefersReducedMotion()) return;
    let raf = 0;
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      // Only animate while hero is on screen (avoid wasted work)
      if (y > window.innerHeight * 1.2) return;
      if (bg) bg.style.transform = `translate3d(0, ${(y * 0.28).toFixed(1)}px, 0) scale(1.15)`;
      if (content) {
        content.style.transform = `translate3d(0, ${(y * 0.12).toFixed(1)}px, 0)`;
        content.style.opacity = `${Math.max(0, 1 - y / (window.innerHeight * 0.75))}`;
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        raf = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return { bgRef, contentRef };
}
