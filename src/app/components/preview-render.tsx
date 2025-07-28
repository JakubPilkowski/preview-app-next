'use client';
import React, { Suspense, forwardRef } from 'react';
import type { IState } from '@preview-workspace/preview-lib';
import { useElementPreviewDroppable } from '../../hooks/utils/use-element-preview-droppable';

// Lazy load section components
const Section1 = React.lazy(() => import('./section1'));
const Section2 = React.lazy(() => import('./section2'));
const Section3 = React.lazy(() => import('./section3'));
const Section4 = React.lazy(() => import('./section4/section4'));

interface PreviewRenderProps {
  state: IState;
  isPreview?: boolean;
  setRef?: (node: HTMLDivElement | null) => void;
}

export const PreviewRender = forwardRef<HTMLDivElement, PreviewRenderProps>(
  ({ state, isPreview = false, setRef }, ref) => {
    const { dataAttributes: droppableAttributes } = useElementPreviewDroppable({
      isPreview,
      isDroppable: true,
      droppableId: 'root',
    });

    const renderSection = (section: IState[0]) => {
      switch (section.key) {
        case 'section1':
          return (
            <Section1
              key={section.id}
              section1={section}
              isPreview={isPreview}
            />
          );
        case 'section2':
          return (
            <Section2
              key={section.id}
              section2={section}
              isPreview={isPreview}
            />
          );
        case 'section3':
          return (
            <Section3
              key={section.id}
              section3={section}
              isPreview={isPreview}
            />
          );
        case 'section4':
          return (
            <Section4
              key={section.id}
              section4={section}
              isPreview={isPreview}
            />
          );
        default:
          return null;
      }
    };

    return (
      <div
        ref={(node) => {
          // Handle both forwardRef and setRef
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          // Call setRef for drag-and-drop
          setRef?.(node);
        }}
        {...droppableAttributes}
      >
        {state.map((section) => (
          <Suspense
            key={section.id}
            fallback={
              <div
                style={{
                  padding: '20px',
                  textAlign: 'center',
                  backgroundColor: '#f8f9fa',
                }}
              >
                Loading section...
              </div>
            }
          >
            {renderSection(section)}
          </Suspense>
        ))}
      </div>
    );
  }
);

PreviewRender.displayName = 'PreviewRender';

export default PreviewRender;
