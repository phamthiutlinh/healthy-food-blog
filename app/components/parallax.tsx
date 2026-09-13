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
 * @param max maximum absolute translation in px (clamp to preserve calm feel).
 * Uses rAF + translate3d only (GPU-friendly), disabled on prefers-reduced-motion.
 */
export function Parallax({
  children,
  speed = 0.15,
  max = 28,
  className = '',
  style,
}: {
  children: ReactNode;
  speed?: number;
  /** Clamp travel so the effect stays subtle (hero 30–50, banner 20–30, cards 10–18). */
  max?: number;
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
      const raw = -offset * speed;
      const y = Math.max(-max, Math.min(max, raw));
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
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
  }, [speed, max]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`} style={style}>
      {children}
    </div>
  );
}

/**
 * Reveal — calm editorial fade/slide with optional 3D exit.
 * variant "up" = flat fade-up (default for text).
 * 3D variants: "zoom" (scale, for newsletter), "flip"/"flip-up",
 * "left"/"right" (slide + rotateY, for split reveals & cards).
 *
 * Set `once` to false to get a subtle exit animation when the element
 * leaves the viewport (translate + rotateY + scale). A 0.18 threshold and
 * -8% rootMargin keep the exit intentional — small scrolls don't hide content.
 */
export type RevealVariant = 'up' | 'zoom' | 'flip' | 'flip-up' | 'left' | 'right';

export function Reveal({
  children,
  delay = 0,
  y = 32,
  variant = 'up',
  once = true,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  variant?: RevealVariant;
  /** When false, toggles is-visible / is-exiting-up / is-exiting-down on scroll. */
  once?: boolean;
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
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            target.classList.add('is-visible');
            target.classList.remove('is-exiting-up', 'is-exiting-down');
            if (once) io.unobserve(target);
          } else if (!once) {
            target.classList.remove('is-visible');
            // Leaving upward (scrolled past) vs downward (not reached yet).
            if (entry.boundingClientRect.top < 0) {
              target.classList.add('is-exiting-up');
              target.classList.remove('is-exiting-down');
            } else {
              target.classList.add('is-exiting-down');
              target.classList.remove('is-exiting-up');
            }
          }
        }
      },
      { threshold: 0.18, rootMargin: '-8% 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

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
 * RecipeReveal — staggered horizontal 3D card reveal.
 * Each card arrives from its own horizontal direction with a slight
 * rotateY (5–8deg), then settles flat. Reversible: leaving applies the
 * mirrored exit (translateX + rotateY + scale).
 * Wraps its own element, so nest hover Tilt INSIDE it.
 */
export function RecipeReveal({
  children,
  direction = 'left',
  delay = 0,
  className = '',
  style,
}: {
  children: ReactNode;
  direction?: 'left' | 'center' | 'right';
  delay?: number;
  className?: string;
  style?: CSSProperties;
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
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            target.classList.add('is-visible');
            target.classList.remove('is-exiting-left', 'is-exiting-right');
          } else {
            target.classList.remove('is-visible');
            // Exit toward the side it came from (mirrored, intentional).
            if (direction === 'left') {
              target.classList.add('is-exiting-left');
              target.classList.remove('is-exiting-right');
            } else if (direction === 'right') {
              target.classList.add('is-exiting-right');
              target.classList.remove('is-exiting-left');
            } else {
              if (entry.boundingClientRect.top < 0) {
                target.classList.add('is-exiting-left');
                target.classList.remove('is-exiting-right');
              } else {
                target.classList.add('is-exiting-right');
                target.classList.remove('is-exiting-left');
              }
            }
          }
        }
      },
      { threshold: 0.18, rootMargin: '-8% 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [direction]);

  const vars =
    direction === 'left'
      ? ({ '--x': '-90px', '--rotate': '-8deg' } as CSSProperties)
      : direction === 'right'
        ? ({ '--x': '90px', '--rotate': '8deg' } as CSSProperties)
        : ({ '--x': '0px', '--rotate': '5deg' } as CSSProperties);

  return (
    <div
      ref={ref}
      className={`recipe-card ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...vars, ...style }}
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

    const onEnter = () => {
      // While the pointer drives the transform every frame, any CSS
      // transition on transform would lag behind and flicker — follow
      // the pointer directly instead.
      el.style.transition = 'none';
    };
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => setTilt(-py * max, px * max, scale));
    };
    const onLeave = () => {
      cancelAnimationFrame(raf.current);
      // Smooth, single eased return — no fight with pointer updates.
      el.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
      raf.current = requestAnimationFrame(() => setTilt(0, 0, 1));
    };

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf.current);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
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
      // Vertical journey: >1 below viewport, 0 centered, <-1 above.
      // Asymmetric curve: dramatic rise-from-bottom entrance, calm exit on top
      // so scrolling reads as "items appear / move from bottom to up".
      const c = Math.max(-1.25, Math.min(1.25, (rect.top + rect.height / 2 - vh / 2) / (vh / 2)));
      const entering = Math.min(Math.max(c, 0), 1); // 1 = far below → 0 = centered
      const leaving = Math.min(Math.max(-c, 0), 1); // 0 = centered → 1 = far above
      const rx = rotate ? (-entering * 16 - leaving * 5) * intensity : 0;
      const ty = (entering * 110 + leaving * -18) * intensity;
      const s = 1 - (entering * 0.08 + leaving * 0.02) * intensity;
      const opacity = 1 - entering * 0.25 * intensity;
      // Horizontal depth: outer columns lean slightly toward center
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
      // Clamped: hero bg drifts 30–50px max to preserve the calm feel.
      const bgY = Math.min(48, y * 0.18);
      const contentY = Math.min(32, y * 0.1);
      if (bg) bg.style.transform = `translate3d(0, ${bgY.toFixed(1)}px, 0) scale(1.15)`;
      if (content) {
        content.style.transform = `translate3d(0, ${contentY.toFixed(1)}px, 0)`;
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
