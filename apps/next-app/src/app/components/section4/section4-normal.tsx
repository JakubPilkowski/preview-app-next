'use client';
import React, { forwardRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { Section4 as Section4Type } from '@preview-workspace/preview-lib';
import { useElementPreviewDraggable } from '../../../hooks/utils/use-element-preview-draggable';
import { useElementPreviewDroppable } from '../../../hooks/utils/use-element-preview-droppable';
import { Section4Container } from './section4-container';
import { Section4ScrollContainer } from './section4-scroll-container';
import { Section4Child } from './section4-child';

interface Section4NormalProps {
  section4: Section4Type;
  isPreview?: boolean;
}

export const Section4Normal = forwardRef<HTMLDivElement, Section4NormalProps>(
  ({ section4, isPreview = false }, ref) => {
    const { dataAttributes: draggableAttributes } = useElementPreviewDraggable({
      isPreview,
      id: section4.id,
      parent: 'root',
      isDraggable: true,
      isHoverTarget: true,
    });

    const { dataAttributes: droppableAttributes } = useElementPreviewDroppable({
      isPreview,
      isDroppable: true,
      droppableId: `section4-${section4.id}`,
    });

    // Non-preview mode: Embla carousel
    const [emblaRef, emblaApi] = useEmblaCarousel({
      align: 'start',
      containScroll: 'trimSnaps',
      loop: true,
    });

    return (
      <Section4Container ref={ref} draggableAttributes={draggableAttributes}>
        <div
          style={{
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <div ref={emblaRef} style={{ overflow: 'hidden' }}>
            <Section4ScrollContainer droppableAttributes={droppableAttributes}>
              {section4.children.map((child) => (
                <Section4Child
                  key={`${child.title}-${child.order}`}
                  child={child}
                  parentId={`section4-${section4.id}`}
                  isPreview={isPreview}
                  style={{
                    flex: '0 0 100%',
                    margin: '0 10px',
                  }}
                />
              ))}
            </Section4ScrollContainer>
          </div>
        </div>
      </Section4Container>
    );
  }
);

Section4Normal.displayName = 'Section4Normal';
