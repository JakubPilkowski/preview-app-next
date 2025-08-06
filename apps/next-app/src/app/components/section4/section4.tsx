import React, { forwardRef, Suspense, lazy } from 'react';
import type { Section4 as Section4Type } from '@preview-workspace/preview-lib';
import { Section4Normal } from './section4-normal';

// Lazy load the preview version
const Section4Preview = lazy(() =>
  import('./section4-preview').then((module) => ({
    default: module.Section4Preview,
  }))
);

interface Section4Props {
  section4: Section4Type;
  isPreview?: boolean;
}

// Loading fallback component
const Section4PreviewFallback: React.FC<{ section4: Section4Type }> = ({
  section4,
}) => (
  <div
    style={{
      minHeight: '40vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
    }}
  >
    <div>Loading preview...</div>
  </div>
);

export const Section4 = forwardRef<HTMLDivElement, Section4Props>(
  ({ section4, isPreview = false }, ref) => {
    if (isPreview) {
      return (
        <Suspense fallback={<Section4PreviewFallback section4={section4} />}>
          <Section4Preview
            section4={section4}
            isPreview={isPreview}
            ref={ref}
          />
        </Suspense>
      );
    }

    return (
      <Section4Normal section4={section4} isPreview={isPreview} ref={ref} />
    );
  }
);

Section4.displayName = 'Section4';

export default Section4;
