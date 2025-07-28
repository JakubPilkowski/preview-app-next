import { useEffect, useRef, useCallback, useState } from 'react';
import {
  PreviewMessage,
  MESSAGE_TYPES,
  EventListenerMap,
  MessageType,
} from '@preview-workspace/preview-lib';

interface MessageChannelBrokerOptions {
  destroyMessageName: string;
}

// Connection state enum
type ConnectionState = 'idle' | 'connecting' | 'connected';

interface MessageChannelBrokerReturn {
  sendMessage: (message: PreviewMessage) => void;
  addEventListener: <T extends MessageType>(
    eventName: T,
    callback: EventListenerMap[T]
  ) => void;
  removeEventListener: <T extends MessageType>(eventName: T) => void;
  onConnect: () => void;
  error: string | null;
  destroy: () => void;
  state: ConnectionState;
}

export const useMessageChannelBroker = (
  options: MessageChannelBrokerOptions
): MessageChannelBrokerReturn => {
  const port1Ref = useRef<MessagePort | null>(null);
  const eventListenersRef = useRef<
    Map<MessageType, Set<EventListenerMap[MessageType]>>
  >(new Map());
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<ConnectionState>('idle');

  const addEventListener = useCallback(
    <T extends MessageType>(eventName: T, callback: EventListenerMap[T]) => {
      if (!eventListenersRef.current.has(eventName)) {
        eventListenersRef.current.set(eventName, new Set());
      }
      const listeners = eventListenersRef.current.get(eventName);
      if (listeners) {
        listeners.add(callback as EventListenerMap[MessageType]);
      }
    },
    []
  );

  const removeEventListener = useCallback(
    <T extends MessageType>(eventName: T) => {
      eventListenersRef.current.delete(eventName);
    },
    []
  );

  const sendMessage = useCallback((message: PreviewMessage) => {
    if (port1Ref.current) {
      port1Ref.current.postMessage(message);
    }
  }, []);

  const sendDestroyMessage = useCallback(() => {
    if (port1Ref.current) {
      port1Ref.current.postMessage({
        type: options.destroyMessageName as MessageType,
      });
    }
  }, [options.destroyMessageName]);

  const onConnect = useCallback(() => {
    // Only connect if we're in idle state
    if (state !== 'idle') {
      return;
    }

    try {
      setError(null); // Clear any previous errors
      setState('connecting');

      // Determine the origin with proper protocol
      const getOrigin = () => {
        const controller = process.env.PREVIEW_CONTROLLER;
        if (!controller) return 'http://localhost:4200';

        // Add protocol if missing
        if (
          controller.startsWith('http://') ||
          controller.startsWith('https://')
        ) {
          return controller;
        }

        // Default to http for domains without protocol
        return `http://${controller}`;
      };

      // Send ready signal to parent
      window.parent.postMessage(
        { type: MESSAGE_TYPES.NEXT_JS_READY },
        getOrigin()
      );

      // Listen for the port transfer from parent (React app)
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === MESSAGE_TYPES.INIT_MESSAGE_CHANNEL) {
          // Remove the listener since we only need it once
          window.removeEventListener('message', handleMessage);

          // Get the transferred port from parent
          const port = event.ports[0];
          if (!port) {
            throw new Error('No port received from parent');
          }

          // Store the received port (this is our communication channel)
          port1Ref.current = port;

          // Set up message handling on the received port
          port1Ref.current.onmessage = (event) => {
            const { type, data } = event.data;
            const listeners = eventListenersRef.current.get(type);
            if (listeners) {
              listeners.forEach((callback) => callback(data));
            }
          };

          // Start the message channel
          port1Ref.current.start();

          // Send a connection confirmation back to parent
          port1Ref.current.postMessage({
            type: MESSAGE_TYPES.CONNECT,
            data: { connected: true },
          });

          setState('connected');
        }
      };

      // Listen for the initial message from parent
      window.addEventListener('message', handleMessage);
    } catch (err) {
      const errorMessage = `Failed to initialize MessageChannel: ${err}`;
      setError(errorMessage);
      setState('idle');
      console.error(errorMessage);
    }
  }, [state]);

  const destroy = useCallback(() => {
    try {
      // Send destroy message before closing
      sendDestroyMessage();

      // Close the message channel
      if (port1Ref.current) {
        port1Ref.current.close();
        port1Ref.current = null;
      }

      // Clear all event listeners
      eventListenersRef.current.clear();

      // Clear error state and reset connection state
      setError(null);
      setState('idle');
    } catch (err) {
      console.error('Error destroying MessageChannel:', err);
    }
  }, [sendDestroyMessage]);

  // Store callbacks in refs to avoid dependency issues
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      destroy();
    };
  }, [destroy]);

  return {
    sendMessage,
    addEventListener,
    removeEventListener,
    onConnect,
    error,
    destroy,
    state,
  };
};
