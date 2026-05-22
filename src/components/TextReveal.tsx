'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

type TextRevealTag = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'blockquote';

export type TextRevealProps = {
  children: string;
  className?: string;
  as?: TextRevealTag;
  /** Play on mount (hero / above-the-fold copy) */
  immediate?: boolean;
  stagger?: number;
};

function wrapLines(el: HTMLElement, lines: HTMLElement[]) {
  lines.forEach((line) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'text-reveal__line-wrapper';
    line.replaceWith(wrapper);
    wrapper.appendChild(line);
  });
}

export default function TextReveal({
  children,
  className = '',
  as: Tag = 'p',
  immediate = false,
  stagger = 0.15,
}: TextRevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let split: SplitType | null = null;

    const ctx = gsap.context(() => {
      split = new SplitType(el, { types: 'lines' });
      const lines = split.lines;
      if (!lines?.length) return;

      wrapLines(el, lines);
      gsap.set(lines, { yPercent: 100 });

      if (immediate) {
        gsap.to(lines, {
          yPercent: 0,
          ease: 'power1.inOut',
          stagger,
          duration: 0.85,
          delay: 0.15,
        });
        return;
      }

      gsap.to(lines, {
        yPercent: 0,
        ease: 'power1.inOut',
        stagger,
        duration: 0.85,
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          toggleActions: 'play reset play reset',
        },
      });
    }, el);

    const onResize = () => ScrollTrigger.refresh();
    const debouncedRefresh = debounce(onResize, 400);
    const ro = new ResizeObserver(debouncedRefresh);
    ro.observe(document.body);

    return () => {
      ro.disconnect();
      split?.revert();
      ctx.revert();
    };
  }, [children, immediate, stagger]);

  return (
    <Tag ref={ref as never} className={`text-reveal ${className}`.trim()}>
      {children}
    </Tag>
  );
}

function debounce<T extends (...args: never[]) => void>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
