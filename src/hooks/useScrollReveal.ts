import { useEffect } from 'react';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function initRevealElements(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-reveal]:not(.reveal-ready)').forEach((el) => {
    const variant = el.getAttribute('data-reveal') ?? 'fade-up';
    el.classList.add('reveal', `reveal--${variant}`, 'reveal-ready');

    const delay = el.getAttribute('data-reveal-delay');
    if (delay) el.style.setProperty('--reveal-delay', delay);

    if (el.hasAttribute('data-reveal-immediate')) {
      requestAnimationFrame(() => el.classList.add('reveal-visible'));
    }
  });
}

/**
 * Observes [data-reveal] elements and toggles .reveal-visible on scroll.
 * Re-runs when `deps` change (e.g. route tab) so new panels animate in.
 */
export function useScrollReveal(deps: unknown[] = []) {
  useEffect(() => {
    const reduced = window.matchMedia(REDUCED_MOTION).matches;
    initRevealElements();

    if (reduced) {
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        el.classList.add('reveal-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.classList.add('reveal-visible');
          if (el.getAttribute('data-reveal-once') !== 'false') {
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -4% 0px' }
    );

    document.querySelectorAll<HTMLElement>('[data-reveal]:not(.reveal-visible)').forEach((el) => {
      if (!el.hasAttribute('data-reveal-immediate')) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
