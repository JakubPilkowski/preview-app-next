import React from 'react';
import { ISection4Child } from '@preview-workspace/preview-lib';
import { useElementPreviewDraggable } from '../../../hooks/utils/use-element-preview-draggable';

interface Section4ChildProps {
  child: ISection4Child;
  parentId: string;
  isPreview?: boolean;
  style?: React.CSSProperties;
}

export const Section4Child: React.FC<Section4ChildProps> = ({
  child,
  parentId,
  isPreview = false,
  style,
}) => {
  const { dataAttributes } = useElementPreviewDraggable({
    isPreview,
    id: child.id,
    parent: parentId,
    isDraggable: true,
    isHoverTarget: true,
  });

  return (
    <div
      {...dataAttributes}
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
        border: '1px solid #e5e7eb',
        width: '100%',
        flexShrink: 0,
        ...style,
      }}
    >
      <h4 style={{ fontSize: '1.1rem', color: '#374151' }}>{child.title}</h4>
    </div>
  );
};
