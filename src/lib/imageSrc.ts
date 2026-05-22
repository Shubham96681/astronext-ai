import type { StaticImageData } from 'next/image';

/** Vintage zodiac wheel — dark fills for light/pink backgrounds */
export const ZODIAC_WHEEL_SRC = '/zodiac-wheel.svg?v=2';

/** Light gold fills for dark sections (e.g. kundali basic band) */
export const ZODIAC_WHEEL_LIGHT_SRC = '/zodiac-wheel-light.svg?v=1';

export function imageSrc(src: string | StaticImageData): string {
  return typeof src === 'string' ? src : src.src;
}
