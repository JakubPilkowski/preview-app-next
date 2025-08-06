import React, { forwardRef } from 'react';

interface Section4ContainerProps {
  children: React.ReactNode;
  draggableAttributes?: any;
  style?: React.CSSProperties;
}

export const Section4Container = forwardRef<
  HTMLDivElement,
  Section4ContainerProps
>(({ children, draggableAttributes, style }, ref) => {
  return (
    <div
      ref={ref}
      {...draggableAttributes}
      style={{
        minHeight: '40vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
        ...style,
      }}
    >
      {children}
    </div>
  );
});

Section4Container.displayName = 'Section4Container';
