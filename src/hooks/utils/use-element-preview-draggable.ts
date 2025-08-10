import { useMemo } from 'react';

// Export attribute names as constants
export const ATTRIBUTE_PREVIEW_INTERACTIVE = 'data-preview-interactive';
export const ATTRIBUTE_HOVER_TARGET = 'data-preview-hover-target';
export const ATTRIBUTE_ID = 'data-preview-id';
export const ATTRIBUTE_DRAGGABLE = 'data-preview-draggable';
export const ATTRIBUTE_PARENT = 'data-preview-parent';

interface UseElementPreviewDraggableProps {
  isPreview?: boolean;
  id?: string;
  parent?: string;
  isDraggable?: boolean;
  isHoverTarget?: boolean;
}

interface UseElementPreviewDraggableReturn {
  dataAttributes: {
    [ATTRIBUTE_PREVIEW_INTERACTIVE]?: string;
    [ATTRIBUTE_HOVER_TARGET]?: string;
    [ATTRIBUTE_ID]?: string;
    [ATTRIBUTE_DRAGGABLE]?: string;
    [ATTRIBUTE_PARENT]?: string;
  };
  linkAttributes: {
    href?: string;
    rel?: string;
    target?: string;
    onClick?: (e: React.MouseEvent) => void;
  };
}

export const useElementPreviewDraggable = ({
  isPreview = false,
  id,
  parent,
  isDraggable = true,
  isHoverTarget = true,
}: UseElementPreviewDraggableProps): UseElementPreviewDraggableReturn => {
  const dataAttributes = useMemo(() => {
    const attributes: UseElementPreviewDraggableReturn['dataAttributes'] = {};

    // Preview interactive attribute
    if (isPreview) {
      attributes[ATTRIBUTE_PREVIEW_INTERACTIVE] = 'false';
    }

    // Hover target attribute
    if (isHoverTarget) {
      attributes[ATTRIBUTE_HOVER_TARGET] = '';
    }

    // ID attribute
    if (id) {
      attributes[ATTRIBUTE_ID] = id;
    }

    // Draggable attribute
    if (isDraggable) {
      attributes[ATTRIBUTE_DRAGGABLE] = 'true';
    }

    // Parent attribute
    if (parent) {
      attributes[ATTRIBUTE_PARENT] = parent;
    }

    return attributes;
  }, [isPreview, id, parent, isDraggable, isHoverTarget]);

  const linkAttributes = useMemo(() => {
    if (isPreview) {
      return {
        href: undefined,
        rel: '',
        target: '',
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
        },
      };
    }
    return {};
  }, [isPreview]);

  return {
    dataAttributes,
    linkAttributes,
  };
};
