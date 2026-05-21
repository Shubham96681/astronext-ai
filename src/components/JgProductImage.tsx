import { useState } from 'react';

type JgProductImageProps = {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
};

export default function JgProductImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  fetchPriority,
}: JgProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`jg-product-img-fallback ${className}`.trim()} role="img" aria-label={alt}>
        <span className="jg-product-img-fallback__icon" aria-hidden>
          ॐ
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      {...(fetchPriority ? { fetchPriority } : {})}
      onError={() => setFailed(true)}
    />
  );
}
