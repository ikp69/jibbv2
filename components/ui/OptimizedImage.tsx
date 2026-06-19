'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

/**
 * OptimizedImage Component
 * 
 * Provides automatic image optimization with:
 * - Lazy loading (default) for below-the-fold images
 * - WebP/AVIF format conversion
 * - Responsive image sizing
 * - Blur placeholder support
 * - LCP optimization for above-the-fold images (priority prop)
 * 
 * Usage:
 * ```tsx
 * // Below-the-fold image (lazy loaded)
 * <OptimizedImage src="/images/photo.jpg" alt="Photo" />
 * 
 * // Above-the-fold image (eager loaded, no lazy)
 * <OptimizedImage src="/images/hero.jpg" alt="Hero" priority />
 * ```
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  loading = 'lazy',
  placeholder = 'empty',
  blurDataURL,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  // For local images (unsplash URLs)
  if (src.startsWith('http')) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        width={width}
        height={height}
      />
    );
  }

  // For static images with Next.js Image optimization
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      loading={loading === 'eager' ? 'eager' : 'lazy'}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      className={className}
      onLoadingComplete={() => setIsLoading(false)}
      // Responsive sizes
      sizes={
        width && height
          ? undefined
          : '(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px'
      }
    />
  );
}
