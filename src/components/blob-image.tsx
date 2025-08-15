import Image from 'next/image';
import { ComponentProps } from 'react';

interface BlobImageProps
  extends Omit<ComponentProps<typeof Image>, 'unoptimized'> {
  src: string;
  alt: string;
}

export function BlobImage({ src, alt, ...props }: BlobImageProps) {
  // Check if the src is a blob URL
  const isBlobUrl = src.startsWith('blob:');

  if (isBlobUrl) {
    // For blob URLs, use unoptimized image to avoid server-side optimization issues
    return <Image {...props} src={src} alt={alt} unoptimized={true} />;
  }

  // For regular URLs, use normal optimization
  return <Image {...props} src={src} alt={alt} />;
}
