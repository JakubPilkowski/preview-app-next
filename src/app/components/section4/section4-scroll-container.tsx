import React, { forwardRef } from 'react';

interface Section4ScrollContainerProps {
  children: React.ReactNode;
  droppableAttributes?: any;
  className?: string;
  style?: React.CSSProperties;
}

export const Section4ScrollContainer = forwardRef<
  HTMLDivElement,
  Section4ScrollContainerProps
>(({ children, droppableAttributes, className, style }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        overflowX: 'auto',
        overflowY: 'hidden',
        borderRadius: '8px',
        scrollbarWidth: 'none' /* Firefox */,
        msOverflowStyle: 'none' /* IE and Edge */,
        display: 'flex',
        ...style,
      }}
      className={`hide-scrollbar ${className || ''}`}
      {...droppableAttributes}
    >
      {children}
    </div>
  );
});

Section4ScrollContainer.displayName = 'Section4ScrollContainer';
