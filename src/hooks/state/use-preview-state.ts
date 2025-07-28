import { useCallback, useMemo } from 'react';
import { IState, ISection2Child } from '@preview-workspace/preview-lib';
import { useUndo } from './use-undo';
import { produce } from 'immer';

interface UsePreviewStateProps {
  initialState: IState;
  onStateChange?: (newState: IState) => void;
}

interface UsePreviewStateReturn {
  currentState: IState | null;
  setCurrentState: (state: IState) => void;
  updateObject: (id: string, properties: any) => void;
  updateOrder: (itemId: string, newIndex: number, parentId: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const usePreviewState = ({
  initialState,
  onStateChange,
}: UsePreviewStateProps): UsePreviewStateReturn => {
  // Use our custom undo/redo with immer for state management
  const { state, setState, undo, redo, canUndo, canRedo } =
    useUndo<IState>(initialState);

  // Get current state from the undo state
  const currentState = state.present;

  // Custom undo that only works if there are more than 1 element in past
  const customUndo = useCallback(() => {
    if (state.past.length > 1) {
      undo();
    }
  }, [state.past.length, undo]);

  // Custom canUndo that checks if there are more than 1 element in past
  const customCanUndo = useMemo(() => {
    return state.past.length > 1;
  }, [state.past.length]);

  // Set current state
  const setCurrentState = useCallback(
    (newState: IState) => {
      setState(newState);
      onStateChange?.(newState);
    },
    [setState, onStateChange]
  );

  // Update object properties
  const updateObject = useCallback(
    (id: string, properties: any) => {
      setState((currentState) => {
        const newState = produce(currentState, (draft: IState) => {
          // Find the section by ID
          const sectionIndex = draft.findIndex((section) => section.id === id);

          if (sectionIndex !== -1) {
            // Update section properties
            Object.assign(draft[sectionIndex], properties);
            draft[sectionIndex].isUpdated = true;
          } else {
            // Check if it's a section2 child
            const section2 = draft.find(
              (section) => section.key === 'section2'
            );

            if (section2 && section2.key === 'section2') {
              const childIndex = section2.children.findIndex(
                (child: ISection2Child) => child.id === id
              );
              if (childIndex !== -1) {
                Object.assign(section2.children[childIndex], properties);
                section2.children[childIndex].isUpdated = true;
                section2.isUpdated = true;
                return;
              }
            }

            // Check if it's a section4 child
            const section4 = draft.find(
              (section) => section.key === 'section4'
            );

            if (section4 && section4.key === 'section4') {
              const childIndex = section4.children.findIndex(
                (child) => child.id === id
              );
              if (childIndex !== -1) {
                Object.assign(section4.children[childIndex], properties);
                section4.children[childIndex].isUpdated = true;
                section4.isUpdated = true;
              }
            }
          }
        });

        // Call onStateChange with the updated state
        onStateChange?.(newState);
        return newState;
      });
    },
    [setState, onStateChange]
  );

  // Update order
  const updateOrder = useCallback(
    (itemId: string, newIndex: number, parentId: string) => {
      setState((currentState) => {
        const newState = produce(currentState, (draft: IState) => {
          if (parentId === 'root') {
            // Reordering sections
            const itemIndex = draft.findIndex(
              (section) => section.id === itemId
            );

            if (itemIndex !== -1) {
              const [movedSection] = draft.splice(itemIndex, 1);
              draft.splice(newIndex, 0, movedSection);

              // Update order based on new positions
              draft.forEach((section, index) => {
                section.order = index;
                section.isUpdated = true;
              });
            }
          } else {
            // Reordering children within a section
            if (parentId.startsWith('section2-')) {
              // Reordering section2 children
              const sectionId = parentId.replace('section2-', '');
              const section2 = draft.find(
                (section) =>
                  section.id === sectionId && section.key === 'section2'
              );

              if (section2 && section2.key === 'section2') {
                const children = [...section2.children];
                const itemIndex = children.findIndex(
                  (child) => child.id === itemId
                );

                if (itemIndex !== -1) {
                  const [movedChild] = children.splice(itemIndex, 1);
                  children.splice(newIndex, 0, movedChild);

                  // Update order based on new positions
                  children.forEach((child, index) => {
                    child.order = index;
                    child.isUpdated = true;
                  });

                  section2.children = children;
                  section2.isUpdated = true;
                }
              }
            } else if (parentId.startsWith('section4-')) {
              // Reordering section4 children
              const sectionId = parentId.replace('section4-', '');
              const section4 = draft.find(
                (section) =>
                  section.id === sectionId && section.key === 'section4'
              );

              if (section4 && section4.key === 'section4') {
                const children = [...section4.children];
                const itemIndex = children.findIndex(
                  (child) => child.id === itemId
                );

                if (itemIndex !== -1) {
                  const [movedChild] = children.splice(itemIndex, 1);
                  children.splice(newIndex, 0, movedChild);

                  // Update order based on new positions
                  children.forEach((child, index) => {
                    child.order = index;
                    child.isUpdated = true;
                  });

                  section4.children = children;
                  section4.isUpdated = true;
                }
              }
            }
          }
        });

        // Call onStateChange with the updated state
        onStateChange?.(newState);
        return newState;
      });
    },
    [setState, onStateChange]
  );

  return {
    currentState,
    setCurrentState,
    updateObject,
    updateOrder,
    undo: customUndo,
    redo,
    canUndo: customCanUndo,
    canRedo,
  };
};
