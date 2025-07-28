'use client';

import React, {
  forwardRef,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import type { Section4 as Section4Type } from '@preview-workspace/preview-lib';
import { useElementPreviewDraggable } from '../../../hooks/utils/use-element-preview-draggable';
import { useElementPreviewDroppable } from '../../../hooks/utils/use-element-preview-droppable';
import { Section4Container } from './section4-container';
import { Section4ScrollContainer } from './section4-scroll-container';
import { Section4Child } from './section4-child';

interface Section4PreviewProps {
  section4: Section4Type;
  isPreview?: boolean;
}

export const Section4Preview = forwardRef<HTMLDivElement, Section4PreviewProps>(
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

    // Preview mode: manual navigation state
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const goToPrevious = useCallback(() => {
      const newIndex =
        currentIndex > 0 ? currentIndex - 1 : section4.children.length - 1;
      setCurrentIndex(newIndex);

      // Scroll to the previous item with smooth behavior
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        containerRef.current.scrollTo({
          left: newIndex * containerWidth,
          behavior: 'smooth',
        });
      }
    }, [currentIndex, section4.children.length]);

    const goToNext = useCallback(() => {
      const newIndex =
        currentIndex < section4.children.length - 1 ? currentIndex + 1 : 0;
      setCurrentIndex(newIndex);

      // Scroll to the next item with smooth behavior
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        containerRef.current.scrollTo({
          left: newIndex * containerWidth,
          behavior: 'smooth',
        });
      }
    }, [currentIndex, section4.children.length]);

    // Handle scroll events in preview mode to update currentIndex
    useEffect(() => {
      if (!isPreview || !containerRef.current) return;

      const handleScroll = () => {
        if (!containerRef.current) return;
        const scrollLeft = containerRef.current.scrollLeft;
        const containerWidth = containerRef.current.offsetWidth;
        // Use Math.round for better snap detection
        const newIndex = Math.round(scrollLeft / containerWidth);
        // Ensure index is within bounds
        const clampedIndex = Math.max(
          0,
          Math.min(newIndex, section4.children.length - 1)
        );
        setCurrentIndex(clampedIndex);
      };

      const container = containerRef.current;
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }, [isPreview, section4.children.length]);

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
            onClick={goToPrevious}
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
            onClick={goToNext}
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

          {/* Content container */}
          <Section4ScrollContainer
            ref={containerRef}
            droppableAttributes={droppableAttributes}
            // style={{
            //   scrollSnapType: 'x mandatory',
            //   scrollBehavior: 'smooth',
            // }}
          >
            {section4.children.map((child) => (
              <Section4Child
                key={`${child.title}-${child.order}`}
                child={child}
                parentId={`section4-${section4.id}`}
                isPreview={isPreview}
                style={{
                  width: '100%',
                  flexShrink: 0,
                  scrollSnapAlign: 'start',
                }}
              />
            ))}
          </Section4ScrollContainer>

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
                onClick={() => {
                  setCurrentIndex(index);
                  // Scroll to the item with smooth behavior
                  if (containerRef.current) {
                    const containerWidth = containerRef.current.offsetWidth;
                    containerRef.current.scrollTo({
                      left: index * containerWidth,
                      behavior: 'smooth',
                    });
                  }
                }}
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

Section4Preview.displayName = 'Section4Preview';
