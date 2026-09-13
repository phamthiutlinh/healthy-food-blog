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
 * Supports exit animations when leaving viewport.
 * variant "up" = flat fade-up (default).
 * 3D variants: "zoom", "flip", "flip-up", "left", "right".
 */
export type RevealVariant = 'up' | 'zoom' | 'flip' | 'flip-up' | 'left' | 'right';

export function Reveal({
  children,
  delay = 0,
  y = 24,
  variant = 'up',
  className = '',
  onExit,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  variant?: RevealVariant;
  className?: string;
  onExit?: (direction: 'up' | 'down') => void;
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
            entry.target.classList.remove('is-exiting-up', 'is-exiting-down', 'is-exiting-left', 'is-exiting-right');
          } else {
            entry.target.classList.remove('is-visible');
            // Determine exit direction based on bounding rect
            const rect = entry.boundingClientRect;
            if (rect.top < 0) {
              entry.target.classList.add('is-exiting-up');
              onExit?.('up');
            } else {
              entry.target.classList.add('is-exiting-down');
              onExit?.('down');
            }
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [onExit]);

  return (
    <div
      ref={ref}
      className={`reveal reveal-${variant} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ['--reveal-y' as string]: `${y}px` }}
    >
      {children}
    </div>
  );
}

/**
 * Tilt — mouse-driven 3D tilt (rotateX/rotateY) with perspective.
 * For hover 3D on cards below the hero. Owns its own transform,
 * so nest it INSIDE Reveal (not the other way around).
 * Disabled on touch devices + prefers-reduced-motion.
 */
export function Tilt({
  children,
  max = 9,
  scale = 1.03,
  className = '',
  style,
}: {
  children: ReactNode;
  max?: number;
  scale?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (
      typeof window !== 'undefined' &&
      (window.matchMedia?.('(hover: none)').matches || 'ontouchstart' in window)
    )
      return;

    const setTilt = (rx: number, ry: number, s: number) => {
      el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale3d(${s}, ${s}, 1)`;
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => setTilt(-py * max, px * max, scale));
    };
    const onLeave = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => setTilt(0, 0, 1));
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(raf.current);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [max, scale]);

  return (
    <div ref={ref} className={`tilt ${className}`} style={style}>
      {children}
    </div>
  );
}

/**
 * Scrub3D — scroll-driven 3D motion, fully reversible.
 * The transform is recomputed from the element's live position on every
 * scroll frame, so scrolling DOWN and UP both drive the animation:
 * - below the viewport center: sunk down (+110px), tilted back (rotateX -16°),
 *   shrunk, faded — rises and unfolds as you scroll down
 * - centered in viewport: flat, full size, full opacity
 * - above center: gently lifts away; scroll back up to sink items down again
 * Disabled (no transform) on prefers-reduced-motion.
 * Nest hover Tilt INSIDE Scrub3D — each owns its own element.
 */
export function Scrub3D({
  children,
  intensity = 1,
  rotate = true,
  className = '',
  style,
}: {
  children: ReactNode;
  intensity?: number;
  /** Set false for wide flat panels (e.g. newsletter) where perspective tilt looks broken. */
  rotate?: boolean;
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
      const vh = window.innerHeight || 1;
      const vw = window.innerWidth || 1;
      const c = Math.max(-1.25, Math.min(1.25, (rect.top + rect.height / 2 - vh / 2) / (vh / 2)));
      const entering = Math.min(Math.max(c, 0), 1);
      const leaving = Math.min(Math.max(-c, 0), 1);
      const rx = rotate ? (-entering * 16 - leaving * 5) * intensity : 0;
      const ty = (entering * 110 + leaving * -18) * intensity;
      const s = 1 - (entering * 0.08 + leaving * 0.02) * intensity;
      const opacity = 1 - entering * 0.25 * intensity;
      const ry = rotate ? ((rect.left + rect.width / 2 - vw / 2) / (vw / 2)) * -4 * intensity : 0;
      el.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translate3d(0, ${ty.toFixed(1)}px, 0) scale(${s.toFixed(3)})`;
      el.style.opacity = `${Math.max(0, opacity).toFixed(2)}`;
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
  }, [intensity, rotate]);

  return (
    <div ref={ref} className={`scrub will-change-transform ${className}`} style={style}>
      {children}
    </div>
  );
}

/**
 * HorizontalScroll — horizontal scroll gallery driven by vertical scroll.
 * Pins the section and translates children horizontally.
 * On desktop: section becomes sticky, cards move horizontally during scroll.
 * On mobile: renders as normal grid (handled by CSS).
 */
export function HorizontalScroll({
  children,
  className = '',
  speed = 0.5,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = ref.current;
    const section = sectionRef.current;
    if (!track || !section || prefersReducedMotion()) return;

    // Only run on desktop
    if (window.innerWidth < 1024) return;

    let raf = 0;
    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      // Section pins when top reaches viewport top, unpins when bottom leaves
      const pinStart = 0;
      const pinEnd = rect.height - vh;
      const progress = Math.max(0, Math.min(1, (pinStart - rect.top) / pinEnd));
      const maxScroll = track.scrollWidth - track.clientWidth;
      track.style.transform = `translateX(${-progress * maxScroll * speed}px)`;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        raf = requestAnimationFrame(update);
      }
    };

    // Add pinned class for CSS sticky positioning
    section.classList.add('pinned');

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      section.classList.remove('pinned');
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [speed]);

  return (
    <div ref={sectionRef} className={`horizontal-scroll-section ${className}`}>
      <div ref={ref} className="horizontal-scroll-track">
        {children}
      </div>
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