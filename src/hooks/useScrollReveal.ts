import { useEffect } from 'react';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function getPageRoot(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.page-view');
}

function initRevealElements(root: ParentNode) {
  root.querySelectorAll<HTMLElement>('[data-reveal-stagger]:not([data-reveal])').forEach((el) => {
    // Stagger inside an outer [data-reveal] uses `.reveal-visible [data-reveal-stagger] > *`
    const outerReveal = el.parentElement?.closest('[data-reveal]');
    if (outerReveal && outerReveal !== el) return;
    el.setAttribute('data-reveal', 'fade');
  });

  root.querySelectorAll<HTMLElement>('[data-reveal]:not(.reveal-ready)').forEach((el) => {
    const variant = el.getAttribute('data-reveal') ?? 'fade-up';
    el.classList.add('reveal', `reveal--${variant}`, 'reveal-ready');

    const delay = el.getAttribute('data-reveal-delay');
    if (delay) el.style.setProperty('--reveal-delay', delay);

    if (el.hasAttribute('data-reveal-immediate')) {
      el.classList.add('reveal-visible');
    }
  });
}

/** Reveal elements already in the viewport (avoids blank page while waiting for observer). */
function revealInViewport(root: HTMLElement, observer: IntersectionObserver) {
  const viewH = window.innerHeight;
  root.querySelectorAll<HTMLElement>('[data-reveal]:not(.reveal-visible)').forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < viewH * 0.94 && rect.bottom > 0) {
      el.classList.add('reveal-visible');
      observer.unobserve(el);
    }
  });
}

/**
 * Observes [data-reveal] inside `.page-view` and toggles .reveal-visible on scroll.
 * Scoped to page content so the footer does not re-animate on every route change.
 */
export function useScrollReveal(deps: unknown[] = []) {
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let cancelled = false;

    const setup = () => {
      if (cancelled) return;

      const root = getPageRoot();
      if (!root) return;

      const reduced = window.matchMedia(REDUCED_MOTION).matches;
      initRevealElements(root);

      if (reduced) {
        root.querySelectorAll('[data-reveal]').forEach((el) => {
          el.classList.add('reveal-visible');
        });
        return;
      }

      observer?.disconnect();
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            el.classList.add('reveal-visible');
            if (el.getAttribute('data-reveal-once') !== 'false') {
              observer?.unobserve(el);
            }
          });
        },
        { threshold: 0.04, rootMargin: '0px 0px 0px 0px' }
      );

      root.querySelectorAll<HTMLElement>('[data-reveal]:not(.reveal-visible)').forEach((el) => {
        if (!el.hasAttribute('data-reveal-immediate')) {
          observer?.observe(el);
        }
      });

      revealInViewport(root, observer);
    };

    requestAnimationFrame(setup);

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
