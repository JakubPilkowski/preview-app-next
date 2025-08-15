import { useRef, useCallback, useEffect } from 'react';
import Sortable from 'sortablejs';
import {
  ATTRIBUTE_ID,
  ATTRIBUTE_DRAGGABLE,
} from './use-element-preview-draggable';
import { ATTRIBUTE_DROPPABLE } from './use-element-preview-droppable';

interface UseDragDropProps {
  onOrderChange: (itemId: string, newIndex: number, parentId: string) => void;
  isActive?: boolean;
}

export function useDragDrop({
  onOrderChange,
  isActive = false,
}: UseDragDropProps) {
  const sortableInstances = useRef<Sortable[]>([]);
  const mutationObserver = useRef<MutationObserver | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Initialize sortable instances
  const initializeSortables = useCallback(() => {
    // Clean up existing instances
    sortableInstances.current.forEach((instance) => {
      instance.destroy();
    });
    sortableInstances.current = [];

    // Initialize drag and drop for sections (root level)
    const sectionsContainer = document.querySelector(
      `[${ATTRIBUTE_DROPPABLE}="root"]`
    );
    if (sectionsContainer) {
      const sectionsSortable = Sortable.create(
        sectionsContainer as HTMLElement,
        {
          group: 'sections',
          animation: 150,
          ghostClass: 'sortable-ghost',
          chosenClass: 'sortable-chosen',
          dragClass: 'sortable-drag',
          draggable: `[${ATTRIBUTE_DRAGGABLE}="true"]`, // Only draggable elements
          bubbleScroll: true,
          scroll: true,
          scrollSensitivity: 200, // px, how near the mouse must be to an edge to start scrolling
          scrollSpeed: 200, // px per frame
          forceAutoScrollFallback: true,
          onEnd: (evt) => {
            const itemId = evt.item.getAttribute(ATTRIBUTE_ID);
            const newIndex = evt.newIndex;
            if (itemId && newIndex !== undefined) {
              onOrderChange(itemId, newIndex, 'root');
            }
          },
        }
      );
      sortableInstances.current.push(sectionsSortable);
    }

    // Initialize drag and drop for children within each section
    const childContainers = document.querySelectorAll(
      `[${ATTRIBUTE_DROPPABLE}^="section"]`
    );
    childContainers.forEach((container) => {
      const parentId = container.getAttribute(ATTRIBUTE_DROPPABLE);
      if (parentId) {
        const childrenSortable = Sortable.create(container as HTMLElement, {
          group: {
            name: `children-${parentId}`,
            pull: false, // Children can't be moved to other sections
            put: false, // Other items can't be put in children containers
          },
          animation: 150,
          ghostClass: 'sortable-ghost',
          chosenClass: 'sortable-chosen',
          dragClass: 'sortable-drag',
          draggable: `[${ATTRIBUTE_DRAGGABLE}="true"]`, // Only draggable elements
          bubbleScroll: true,
          scroll: true,
          scrollSensitivity: 100, // px, how near the mouse must be to an edge to start scrolling
          scrollSpeed: 50, // px per frame
          forceAutoScrollFallback: true,
          onEnd: (evt) => {
            const itemId = evt.item.getAttribute(ATTRIBUTE_ID);
            const newIndex = evt.newIndex;
            if (itemId && newIndex !== undefined) {
              onOrderChange(itemId, newIndex, parentId);
            }
          },
        });
        sortableInstances.current.push(childrenSortable);
      }
    });
  }, [onOrderChange]);

  // Set up mutation observer
  const setupMutationObserver = useCallback(() => {
    if (!containerRef.current || !isActive) return;

    // Disconnect existing observer
    if (mutationObserver.current) {
      mutationObserver.current.disconnect();
    }

    // Create new mutation observer
    mutationObserver.current = new MutationObserver((mutations) => {
      // Check if any sortable instance is currently dragging
      const isAnySortableDragging = Sortable.dragged !== null;

      // Don't revalidate if any sortable is currently dragging
      if (isAnySortableDragging) {
        return;
      }

      let shouldRevalidate = false;

      mutations.forEach((mutation) => {
        // Check if any draggable or droppable elements were added/removed
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (
                element.hasAttribute(ATTRIBUTE_DRAGGABLE) ||
                element.hasAttribute(ATTRIBUTE_DROPPABLE) ||
                element.querySelector(
                  `[${ATTRIBUTE_DRAGGABLE}], [${ATTRIBUTE_DROPPABLE}]`
                )
              ) {
                shouldRevalidate = true;
              }
            }
          });

          mutation.removedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (
                element.hasAttribute(ATTRIBUTE_DRAGGABLE) ||
                element.hasAttribute(ATTRIBUTE_DROPPABLE) ||
                element.querySelector(
                  `[${ATTRIBUTE_DRAGGABLE}], [${ATTRIBUTE_DROPPABLE}]`
                )
              ) {
                shouldRevalidate = true;
              }
            }
          });
        }

        // Check if attributes were changed
        if (mutation.type === 'attributes') {
          const target = mutation.target as Element;
          if (
            target.hasAttribute(ATTRIBUTE_DRAGGABLE) ||
            target.hasAttribute(ATTRIBUTE_DROPPABLE)
          ) {
            shouldRevalidate = true;
          }
        }
      });

      if (shouldRevalidate) {
        // Debounce revalidation to avoid multiple rapid calls
        setTimeout(() => {
          initializeSortables();
        }, 100);
      }
    });

    // Start observing
    mutationObserver.current.observe(containerRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [ATTRIBUTE_DRAGGABLE, ATTRIBUTE_DROPPABLE],
    });
  }, [isActive, initializeSortables]);

  // Clean up function
  const cleanup = useCallback(() => {
    // Destroy sortable instances
    sortableInstances.current.forEach((instance) => {
      instance.destroy();
    });
    sortableInstances.current = [];

    // Disconnect mutation observer
    if (mutationObserver.current) {
      mutationObserver.current.disconnect();
      mutationObserver.current = null;
    }
  }, []);

  // Handle isActive changes after containerRef is set
  useEffect(() => {
    if (containerRef.current) {
      if (isActive) {
        // Initialize sortables and mutation observer when becoming active
        setTimeout(() => {
          initializeSortables();
          setupMutationObserver();
        }, 0);
      } else {
        // Clean up when becoming inactive
        cleanup();
      }
    }
  }, [isActive, initializeSortables, setupMutationObserver, cleanup]);

  // Set ref callback
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;

      if (node && isActive) {
        // Initialize sortables when ref is set and active
        setTimeout(() => {
          initializeSortables();
          setupMutationObserver();
        }, 0);
      } else if (!isActive) {
        // Clean up when not active
        cleanup();
      }
    },
    [isActive, initializeSortables, setupMutationObserver, cleanup]
  );

  // Revalidation method
  const revalidateSortables = useCallback(() => {
    if (isActive) {
      initializeSortables();
    }
  }, [isActive, initializeSortables]);

  return {
    setRef,
    revalidateSortables,
  };
}
