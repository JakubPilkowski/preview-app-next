import React from 'react';
import { useElementPreviewDraggable } from '../hooks/utils/use-element-preview-draggable';

interface Section2Props {
  section2: {
    title: string;
    order: number;
  };
  isPreview?: boolean;
}

export const Section2: React.FC<Section2Props> = ({
  section2,
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
        backgroundColor: '#e9ecef',
      }}
    >
      <div>
        <h1>{section2.title}</h1>
        <p>Order: {section2.order}</p>
      </div>
    </div>
  );
};

export default Section2;
