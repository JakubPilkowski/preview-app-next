'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  ATTRIBUTE_HOVER_TARGET,
  ATTRIBUTE_ID,
} from '../../hooks/utils/use-element-preview-draggable';

type TargetInfo = {
  el: HTMLElement;
  rect: DOMRect;
  id: string;
};

interface HoverOverlayManagerProps {
  onEdit: (id: string) => void;
}

export default function HoverOverlayManager({
  onEdit,
}: HoverOverlayManagerProps) {
  const [target, setTarget] = useState<TargetInfo | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mousePositionRef = useRef<{ x: number; y: number } | null>(null);
  const allTargetsRef = useRef<HTMLElement[]>([]);
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to set reference for hover target elements
  const setHoverTargetsRef = useCallback(() => {
    const selector = `[${ATTRIBUTE_HOVER_TARGET}]`;
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(selector)
    );
    allTargetsRef.current = targets;
    return targets;
  }, []);

  // Function to update target position
  const updateTargetPosition = useCallback((el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const id = el.getAttribute(ATTRIBUTE_ID) || '';

    // Account for any potential offset by using Math.round
    const adjustedRect = {
      top: Math.round(rect.top),
      left: Math.round(rect.left),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      right: Math.round(rect.right),
      bottom: Math.round(rect.bottom),
      x: Math.round(rect.x),
      y: Math.round(rect.y),
    };

    setTarget({ el, rect: adjustedRect as DOMRect, id });
  }, []);

  // Function to check if mouse is over an element
  const checkMouseOverElement = useCallback((el: HTMLElement) => {
    if (!mousePositionRef.current) return false;

    const rect = el.getBoundingClientRect();
    const { x, y } = mousePositionRef.current;

    return (
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    );
  }, []);

  // Function to find element under mouse cursor
  const findElementUnderMouse = useCallback(() => {
    if (!mousePositionRef.current) return null;

    // Check if we have targets in ref, if not populate it
    let targets = allTargetsRef.current;
    if (!targets.length) {
      targets = setHoverTargetsRef();
    }

    // Check elements in reverse order (top to bottom) to handle overlapping
    for (let i = targets.length - 1; i >= 0; i--) {
      const el = targets[i];
      if (checkMouseOverElement(el)) {
        return el;
      }
    }
    return null;
  }, [checkMouseOverElement, setHoverTargetsRef]);

  // Function to update hover state based on current mouse position
  const updateHoverState = useCallback(() => {
    const elementUnderMouse = findElementUnderMouse();

    if (elementUnderMouse) {
      // Mouse is over an element
      if (!target || target.el !== elementUnderMouse) {
        // New element or different element
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        updateTargetPosition(elementUnderMouse);
      }
    } else {
      // Mouse is not over any element
      if (target) {
        // Check if mouse is over the overlay
        if (overlayRef.current && checkMouseOverElement(overlayRef.current)) {
          return; // Don't hide if mouse is over overlay
        }

        // Hide overlay after delay
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = setTimeout(() => {
          setTarget(null);
        }, 200);
      }
    }
  }, [
    findElementUnderMouse,
    target,
    updateTargetPosition,
    checkMouseOverElement,
  ]);

  // Throttled mouse move handler
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };

      throttleTimeoutRef.current = setTimeout(() => {
        updateHoverState();
        throttleTimeoutRef.current = null;
      }, 16); // ~60fps
    },
    [updateHoverState]
  );

  // Track mouse position and update hover state
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);

    // Initial check for mouse position when component mounts
    const checkInitialPosition = () => {
      if (mousePositionRef.current) {
        updateHoverState();
      }
    };

    // Small delay to ensure DOM is ready
    const initialCheckTimeout = setTimeout(checkInitialPosition, 100);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(initialCheckTimeout);
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
      }
    };
  }, [handleMouseMove, updateHoverState]);

  // Initialize targets and set up intersection observer for scroll detection
  useEffect(() => {
    const targets = setHoverTargetsRef();

    if (!targets.length) return;

    // Create intersection observer to detect when elements enter/exit viewport
    const observer = new IntersectionObserver(
      () => {
        // Update hover state when viewport changes (scroll, resize, etc.)
        if (mousePositionRef.current) {
          updateHoverState();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '10px',
      }
    );

    // Observe all target elements
    targets.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [updateHoverState, setHoverTargetsRef]);

  // Observe current target for position updates
  useEffect(() => {
    if (!target) return;

    // Create intersection observer specifically for the current target
    const targetObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === target.el) {
            // Update target position when it changes
            updateTargetPosition(target.el);
          }
        });
      },
      {
        threshold: [0, 0.1, 0.5, 1], // Multiple thresholds for better detection
        rootMargin: '0px',
      }
    );

    // Observe the current target element
    targetObserver.observe(target.el);

    return () => {
      targetObserver.disconnect();
    };
  }, [target, updateTargetPosition]);

  const handleEdit = () => {
    if (target) {
      onEdit(target.id);
    }
  };

  if (!target) return null;

  return ReactDOM.createPortal(
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        top: target.rect.top,
        left: target.rect.left,
        width: target.rect.width,
        height: target.rect.height,
        pointerEvents: 'none',
        zIndex: 10000,
        border: '2px dashed #3b82f6',
        borderRadius: 4,
        background: 'rgba(59, 130, 246, 0.05)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          display: 'flex',
          gap: 6,
          background: 'white',
          padding: '4px 6px',
          borderRadius: 6,
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          border: '1px solid #e5e7eb',
          pointerEvents: 'auto', // Enable pointer events for the button container
        }}
      >
        <button
          onClick={handleEdit}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            fontSize: '16px',
          }}
          title="Edit"
        >
          ✏️
        </button>
      </div>
    </div>,
    document.body
  );
}
