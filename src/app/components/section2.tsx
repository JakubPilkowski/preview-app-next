import React, { forwardRef } from 'react';
import type {
  Section2 as Section2Type,
  ISection2Child,
} from '@preview-workspace/preview-lib';
import { useElementPreviewDraggable } from '../../hooks/utils/use-element-preview-draggable';
import { useElementPreviewDroppable } from '@/hooks/utils/use-element-preview-droppable';

interface Section2ChildProps {
  child: ISection2Child;
  parentId: string;
  isPreview?: boolean;
}

const Section2Child: React.FC<Section2ChildProps> = ({
  child,
  parentId,
  isPreview = false,
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
        width: '300px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
      }}
    >
      <h3>{child.name}</h3>
    </div>
  );
};

interface Section2Props {
  section2: Section2Type;
  isPreview?: boolean;
}

export const Section2 = forwardRef<HTMLDivElement, Section2Props>(
  ({ section2, isPreview = false }, ref) => {
    const { dataAttributes } = useElementPreviewDraggable({
      isPreview,
      id: section2.id,
      parent: 'root',
      isDraggable: true,
      isHoverTarget: true,
    });

    const { dataAttributes: droppableAttributes } = useElementPreviewDroppable({
      isPreview,
      isDroppable: true,
      droppableId: `section2-${section2.id}`,
    });

    // Sort children by order
    const sortedChildren = [...section2.children].sort(
      (a, b) => a.order - b.order
    );

    return (
      <div
        ref={ref}
        {...dataAttributes}
        style={{
          height: '50vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#e9ecef',
          padding: '20px',
        }}
      >
        <h1 style={{ marginBottom: '20px' }}>{section2.title}</h1>

        <div
          {...droppableAttributes}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, 300px)',
            gap: '20px',
            width: '100%',
            maxWidth: '1200px',
            justifyContent: 'center',
          }}
        >
          {sortedChildren.map((child) => (
            <Section2Child
              key={`${child.name}-${child.order}`}
              child={child}
              parentId={`section2-${section2.id}`}
              isPreview={isPreview}
            />
          ))}
        </div>
      </div>
    );
  }
);

Section2.displayName = 'Section2';

export default Section2;
