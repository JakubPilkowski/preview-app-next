'use client';
import React from 'react';
import { usePreviewController } from '../../hooks/core/use-preview-controller';
import PreviewRender from './preview-render';
import HoverOverlayManager from './hover-overlay-manager';

import './drag-drop-styles.css';

interface PreviewContentProps {
  sessionId: string;
}

// Default initial state
const defaultInitialState = [
  {
    id: 'section1-default',
    title: 'Loading...',
    order: 0,
    image: null,
    isUpdated: false,
    key: 'section1' as const,
  },
  {
    id: 'section2-default',
    title: 'Loading...',
    order: 1,
    children: [],
    isUpdated: false,
    key: 'section2' as const,
  },
  {
    id: 'section3-default',
    title: 'Loading...',
    subtitle: 'Loading...',
    order: 2,
    cta: {
      title: 'Loading...',
      link: '#',
      isUpdated: false,
    },
    isUpdated: false,
    key: 'section3' as const,
  },
];

export const PreviewContent: React.FC<PreviewContentProps> = ({
  sessionId,
}) => {
  const { state, isLoading, onItemClick, setRef } = usePreviewController({
    sessionId,
    initialState: defaultInitialState,
  });

  // Show loading state until state is defined
  if (isLoading || !state) {
    return (
      <div
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
        }}
      >
        <div>
          <h2>Loading preview...</h2>
          <p>Waiting for state to be defined</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <PreviewRender state={state} isPreview={true} setRef={setRef} />
      <HoverOverlayManager onEdit={onItemClick} />
    </div>
  );
};

export default PreviewContent;
