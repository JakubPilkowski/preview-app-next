import React from 'react';
import { useElementPreviewDraggable } from '../hooks/utils/use-element-preview-draggable';

interface Section1Props {
  section1: {
    title: string;
    order: number;
  };
  isPreview?: boolean;
}

export const Section1: React.FC<Section1Props> = ({
  section1,
  isPreview = false,
}) => {
  const { dataAttributes } = useElementPreviewDraggable({
    isPreview,
    isHoverTarget: false,
    isDraggable: false,
  });

  return (
    <div
      {...dataAttributes}
      style={{
        height: '50vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #dee2e6',
      }}
    >
      <div>
        <h1>{section1.title}</h1>
        <p>Order: {section1.order}</p>
      </div>
    </div>
  );
};

export default Section1;
