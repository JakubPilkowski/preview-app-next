import React, { forwardRef } from 'react';
import { useElementPreviewDraggable } from '../../hooks/utils/use-element-preview-draggable';
import type { Section3 as Section3Type } from '@preview-workspace/preview-lib';

interface Section3Props {
  section3: Section3Type;
  isPreview?: boolean;
}

export const Section3 = forwardRef<HTMLDivElement, Section3Props>(
  ({ section3, isPreview = false }, ref) => {
    const { dataAttributes, linkAttributes } = useElementPreviewDraggable({
      isPreview,
      id: section3.id,
      parent: 'root',
      isDraggable: true,
      isHoverTarget: true,
    });

    return (
      <div
        ref={ref}
        {...dataAttributes}
        style={{
          minHeight: '40vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#e3f2fd',
          borderBottom: '1px solid #dee2e6',
          position: 'relative',
          padding: '2rem',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          <h2
            style={{
              fontSize: '2.5rem',
              marginBottom: '1rem',
              color: '#1976d2',
              fontWeight: 'bold',
            }}
          >
            {section3.title}
          </h2>
          <p
            style={{
              fontSize: '1.2rem',
              lineHeight: '1.6',
              color: '#424242',
              margin: '0 0 2rem 0',
            }}
          >
            {section3.subtitle}
          </p>
          {section3.cta && (
            <a
              href={section3.cta.link}
              target="_blank"
              rel="noopener noreferrer"
              {...linkAttributes}
              style={{
                display: 'inline-block',
                backgroundColor: '#1976d2',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: '600',
                transition: 'background-color 0.2s ease',
                cursor: 'pointer',
              }}
            >
              {section3.cta.title}
            </a>
          )}
        </div>
      </div>
    );
  }
);

Section3.displayName = 'Section3';

export default Section3;
