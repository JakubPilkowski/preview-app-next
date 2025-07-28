import { useCallback, useEffect, useState } from 'react';
import { useMessageChannelBroker } from '../connection/use-message-channel-broker';
import {
  EventListenerMap,
  MessageType,
  PreviewMessage,
  MESSAGE_TYPES,
} from '@preview-workspace/preview-lib';

interface UsePreviewConnectionProps {
  sessionId: string;
}

interface UsePreviewConnectionReturn {
  // Connection state
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;

  // Connection management
  connect: () => void;
  destroy: () => void;

  // Error handling
  onError: (error: any) => void;

  // Message sending
  sendMessage: (message: PreviewMessage) => void;

  // Event listeners
  addEventListener: <T extends MessageType>(
    eventName: T,
    callback: EventListenerMap[T]
  ) => void;
  removeEventListener: <T extends MessageType>(eventName: T) => void;
}

export const usePreviewConnection = ({
  sessionId,
}: UsePreviewConnectionProps): UsePreviewConnectionReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  // Message channel broker for communication with parent window
  const messageBroker = useMessageChannelBroker({
    destroyMessageName: MESSAGE_TYPES.DISCONNECT,
  });

  // Connection management
  const connect = useCallback(() => {
    if (sessionId && messageBroker.state === 'idle') {
      messageBroker.onConnect();
    }
  }, [sessionId, messageBroker]);

  // Destroy connection
  const destroy = useCallback(() => {
    messageBroker.destroy();
    setIsLoading(false);
    setIsConnected(false);
  }, [messageBroker]);

  // Error handling
  const onError = useCallback(
    (error: any) => {
      messageBroker.destroy();
      setIsLoading(false);
      setIsConnected(false);
    },
    [messageBroker]
  );

  // Wrapper for sendMessage that updates connection state
  const sendMessage = useCallback(
    (message: PreviewMessage) => {
      messageBroker.sendMessage(message);
      setIsLoading(false);
      setIsConnected(true);
    },
    [messageBroker]
  );

  // Wrapper for addEventListener that updates connection state
  const addEventListener = useCallback(
    <T extends MessageType>(eventName: T, callback: EventListenerMap[T]) => {
      const wrappedCallback = ((data: any) => {
        setIsLoading(false);
        setIsConnected(true);
        (callback as any)(data);
      }) as EventListenerMap[T];

      messageBroker.addEventListener(eventName, wrappedCallback);
    },
    [messageBroker]
  );

  // Wrapper for removeEventListener
  const removeEventListener = useCallback(
    <T extends MessageType>(eventName: T) => {
      messageBroker.removeEventListener(eventName);
    },
    [messageBroker]
  );

  // Connection management - separate from event listeners
  useEffect(() => {
    connect();
  }, [connect]);

  // Event listeners management - this can change without affecting connection
  useEffect(() => {
    const handlePing = () => {
      // Respond to ping with pong
      sendMessage({ type: MESSAGE_TYPES.PONG });
    };

    const handleDisconnect = () => {
      destroy();
    };

    messageBroker.addEventListener(MESSAGE_TYPES.PING, handlePing);
    messageBroker.addEventListener(MESSAGE_TYPES.DISCONNECT, handleDisconnect);

    return () => {
      messageBroker.removeEventListener(MESSAGE_TYPES.PING);
      messageBroker.removeEventListener(MESSAGE_TYPES.DISCONNECT);
    };
  }, [messageBroker, sendMessage, destroy]);

  return {
    // Connection state
    isLoading,
    isConnected,
    error: messageBroker.error,

    // Connection management
    connect,
    destroy,

    // Error handling
    onError,

    // Message sending
    sendMessage,

    // Event listeners
    addEventListener,
    removeEventListener,
  };
};
