import React, { forwardRef } from 'react';
import type { Section1 as Section1Type } from '@preview-workspace/preview-lib';
import { useElementPreviewDraggable } from '../../hooks/utils/use-element-preview-draggable';
import { BlobImage } from '../../components/blob-image';

interface Section1Props {
  section1: Section1Type;
  isPreview?: boolean;
}

export const Section1 = forwardRef<HTMLDivElement, Section1Props>(
  ({ section1, isPreview = false }, ref) => {
    const { dataAttributes } = useElementPreviewDraggable({
      isPreview,
      id: section1.id,
      parent: 'root',
      isDraggable: true,
      isHoverTarget: true,
    });

    return (
      <div
        ref={ref}
        {...dataAttributes}
        style={{
          height: '50vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #dee2e6',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {section1.image && (
          <BlobImage
            src={section1.image}
            alt={section1.title}
            fill
            style={{
              objectFit: 'cover',
              zIndex: 1,
            }}
            priority
          />
        )}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            color: section1.image ? 'white' : 'inherit',
            textShadow: section1.image ? '2px 2px 4px rgba(0,0,0,0.7)' : 'none',
          }}
        >
          <h1>{section1.title}</h1>
        </div>
      </div>
    );
  }
);

Section1.displayName = 'Section1';

export default Section1;
