import { useMemo } from 'react';

// Export attribute name as constant
export const ATTRIBUTE_DROPPABLE = 'data-preview-droppable';

interface UseElementPreviewDroppableProps {
  isPreview?: boolean;
  isDroppable?: boolean;
  droppableId?: string;
}

interface UseElementPreviewDroppableReturn {
  dataAttributes: {
    [ATTRIBUTE_DROPPABLE]?: string;
  };
}

export const useElementPreviewDroppable = ({
  isPreview = false,
  isDroppable = false,
  droppableId,
}: UseElementPreviewDroppableProps): UseElementPreviewDroppableReturn => {
  const dataAttributes = useMemo(() => {
    const attributes: UseElementPreviewDroppableReturn['dataAttributes'] = {};

    // Only add droppable attribute in preview mode
    if (isPreview && isDroppable) {
      attributes[ATTRIBUTE_DROPPABLE] = droppableId || 'true';
    }

    return attributes;
  }, [isPreview, isDroppable, droppableId]);

  return {
    dataAttributes,
  };
};
