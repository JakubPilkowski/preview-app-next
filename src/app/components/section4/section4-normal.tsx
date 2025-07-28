'use client';
import React, { forwardRef, useState, useCallback, useEffect } from 'react';
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

    // Embla carousel setup with more explicit configuration
    const [emblaRef, emblaApi] = useEmblaCarousel({
      align: 'start',
      containScroll: 'trimSnaps',
      loop: true,
      skipSnaps: false,
      dragFree: false,
    });

    // Track current slide index
    const [currentIndex, setCurrentIndex] = useState(0);

    // Update current index when carousel slides
    const onSelect = useCallback(() => {
      if (!emblaApi) return;
      setCurrentIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
      if (!emblaApi) return;

      onSelect();
      emblaApi.on('select', onSelect);

      return () => {
        emblaApi.off('select', onSelect);
      };
    }, [emblaApi, onSelect]);

    // Navigation functions
    const scrollTo = useCallback(
      (index: number) => emblaApi && emblaApi.scrollTo(index),
      [emblaApi]
    );

    const scrollPrev = useCallback(
      () => emblaApi && emblaApi.scrollPrev(),
      [emblaApi]
    );

    const scrollNext = useCallback(
      () => emblaApi && emblaApi.scrollNext(),
      [emblaApi]
    );

    return (
      <Section4Container ref={ref} draggableAttributes={draggableAttributes}>
        <h3>{section4.title}</h3>
        <div
          style={{
            width: '100%',
            position: 'relative',
          }}
        >
          {/* Navigation arrows */}
          <button
            onClick={scrollPrev}
            style={{
              position: 'absolute',
              left: '40px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            ←
          </button>
          <button
            onClick={scrollNext}
            style={{
              position: 'absolute',
              right: '40px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            →
          </button>

          {/* Carousel container */}
          <div
            ref={emblaRef}
            style={{
              overflow: 'hidden',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                width: '100%',
              }}
              {...droppableAttributes}
            >
              {section4.children.map((child) => (
                <div
                  key={`${child.title}-${child.order}`}
                  style={{
                    flex: '0 0 100%',
                    minWidth: '100%',
                    width: '100%',
                  }}
                >
                  <Section4Child
                    child={child}
                    parentId={`section4-${section4.id}`}
                    isPreview={isPreview}
                    style={{
                      width: '100%',
                      padding: '20px',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Dots indicator */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '16px',
            }}
          >
            {section4.children.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  border: 'none',
                  background: index === currentIndex ? '#3b82f6' : '#d1d5db',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        </div>
      </Section4Container>
    );
  }
);

Section4Normal.displayName = 'Section4Normal';
