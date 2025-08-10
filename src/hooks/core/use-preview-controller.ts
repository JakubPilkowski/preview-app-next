import { useCallback, useEffect } from 'react';
import { usePreviewState } from '../state/use-preview-state';
import { usePreviewConnection } from './use-preview-connection';
import { useDragDrop } from '../utils/use-drag-drop';
import type {
  IState,
  EventListenerData,
  PreviewMessage,
} from '@preview-workspace/preview-lib';
import { MESSAGE_TYPES } from '@preview-workspace/preview-lib';

interface UsePreviewControllerProps {
  sessionId: string;
  initialState: IState;
}

interface UsePreviewControllerReturn {
  state: IState | null;
  isLoading: boolean;
  isConnected: boolean;
  onItemClick: (id: string) => void;
  sendMessage: (message: PreviewMessage) => void;
  destroy: () => void;
  setRef: (node: HTMLDivElement | null) => void;
}

export const usePreviewController = ({
  sessionId,
  initialState,
}: UsePreviewControllerProps): UsePreviewControllerReturn => {
  // Connection management
  const {
    isLoading,
    isConnected,
    destroy,
    sendMessage,
    addEventListener,
    removeEventListener,
  } = usePreviewConnection({ sessionId });

  // Send state change to parent window
  const sendStateChange = useCallback(
    (newState: IState | null) => {
      if (newState) {
        sendMessage({
          type: MESSAGE_TYPES.STATE_CHANGE,
          data: { state: newState },
        });
      }
    },
    [sendMessage]
  );

  // State management
  const {
    currentState,
    setCurrentState,
    updateObject,
    updateOrder,
    undo,
    redo,
    canUndo,
    canRedo,
  } = usePreviewState({
    initialState,
    onStateChange: sendStateChange,
  });

  // Command handlers
  const handleObjectEdit = useCallback(
    (data: EventListenerData<typeof MESSAGE_TYPES.OBJECT_EDIT>) => {
      const { id, properties } = data;
      updateObject(id, properties);
    },
    [updateObject]
  );

  const handleOrderChange = useCallback(
    (itemId: string, newIndex: number, parentId: string) => {
      updateOrder(itemId, newIndex, parentId);
    },
    [updateOrder]
  );

  const handleUndo = useCallback(() => {
    if (canUndo) {
      undo();
    }
  }, [undo, canUndo]);

  const handleRedo = useCallback(() => {
    if (canRedo) {
      redo();
    }
  }, [redo, canRedo]);

  // Initialize drag and drop functionality inside the controller
  const { setRef } = useDragDrop({
    onOrderChange: handleOrderChange,
    isActive: isConnected,
  });

  // Event listeners management - this can change without affecting connection
  useEffect(() => {
    // Listen for state changes from parent window
    const handleStateChange = (data: { state: IState }) => {
      setCurrentState(data.state);
    };

    // Command listeners
    const handleObjectEditCommand = (
      data: EventListenerData<typeof MESSAGE_TYPES.OBJECT_EDIT>
    ) => {
      handleObjectEdit(data);
    };

    const handleOrderChangeCommand = (
      data: EventListenerData<typeof MESSAGE_TYPES.ORDER_CHANGE>
    ) => {
      handleOrderChange(data.itemId, data.newIndex, data.parentId);
    };

    const handleUndoCommand = () => {
      handleUndo();
    };

    const handleRedoCommand = () => {
      handleRedo();
    };

    addEventListener(MESSAGE_TYPES.STATE_CHANGE, handleStateChange);
    addEventListener(MESSAGE_TYPES.OBJECT_EDIT, handleObjectEditCommand);
    addEventListener(MESSAGE_TYPES.ORDER_CHANGE, handleOrderChangeCommand);
    addEventListener(MESSAGE_TYPES.UNDO, handleUndoCommand);
    addEventListener(MESSAGE_TYPES.REDO, handleRedoCommand);

    return () => {
      removeEventListener(MESSAGE_TYPES.STATE_CHANGE);
      removeEventListener(MESSAGE_TYPES.OBJECT_EDIT);
      removeEventListener(MESSAGE_TYPES.ORDER_CHANGE);
      removeEventListener(MESSAGE_TYPES.UNDO);
      removeEventListener(MESSAGE_TYPES.REDO);
    };
  }, [
    addEventListener,
    removeEventListener,
    setCurrentState,
    handleObjectEdit,
    handleOrderChange,
    handleUndo,
    handleRedo,
    currentState,
    sendMessage,
    destroy,
  ]);

  // Handle item click for editing
  const onItemClick = useCallback(
    (id: string) => {
      // Send item click event to parent window
      sendMessage({
        type: MESSAGE_TYPES.ITEM_CLICK,
        data: { id },
      });
    },
    [sendMessage]
  );

  return {
    state: currentState,
    isLoading,
    isConnected,
    onItemClick,
    sendMessage,
    destroy,
    setRef,
  };
};
