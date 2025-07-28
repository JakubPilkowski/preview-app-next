import { useState, useCallback, useMemo } from 'react';

interface UndoState<T> {
  past: T[];
  present: T;
  future: T[];
}

type SetStateAction<T> = T | ((prevState: T) => T);

interface UseUndoReturn<T> {
  state: UndoState<T>;
  setState: (action: SetStateAction<T>) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const useUndo = <T>(initialState: T): UseUndoReturn<T> => {
  const [state, setUndoState] = useState<UndoState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const setState = useCallback((action: SetStateAction<T>) => {
    setUndoState((currentState) => {
      // Determine the new state value
      const newValue =
        typeof action === 'function'
          ? (action as (prevState: T) => T)(currentState.present)
          : action;

      return {
        past: [...currentState.past, currentState.present],
        present: newValue,
        future: [],
      };
    });
  }, []);

  const undo = useCallback(() => {
    setUndoState((currentState) => {
      if (currentState.past.length === 0) return currentState;

      const previous = currentState.past[currentState.past.length - 1];
      const newPast = currentState.past.slice(0, -1);

      return {
        past: newPast,
        present: previous,
        future: [currentState.present, ...currentState.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setUndoState((currentState) => {
      if (currentState.future.length === 0) return currentState;

      const next = currentState.future[0];
      const newFuture = currentState.future.slice(1);

      return {
        past: [...currentState.past, currentState.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const canUndo = useMemo(() => state.past.length > 0, [state.past.length]);
  const canRedo = useMemo(() => state.future.length > 0, [state.future.length]);

  return {
    state,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};
