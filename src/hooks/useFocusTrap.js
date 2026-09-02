import { useRef, useEffect } from 'react';

/**
 * Custom hook to trap focus within a modal dialog
 * Implements keyboard navigation (Tab/Shift+Tab cycling) and Escape key handling
 * Ensures focus stays within modal for accessibility
 * 
 * @param {boolean} isActive - Whether the focus trap should be active
 * @returns {React.RefObject} - Ref to attach to the modal container element
 */
function useFocusTrap(isActive) {
  const elementRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isActive || !elementRef.current) return;

    const element = elementRef.current;
    
    // Store the element that had focus before modal opened
    previousFocusRef.current = document.activeElement;

    // Query all focusable elements within the modal
    const focusableSelector = 
      'a[href], button:not([disabled]), textarea:not([disabled]), ' +
      'input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    
    const focusableElements = element.querySelectorAll(focusableSelector);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the first element when modal opens
    if (firstElement) {
      firstElement.focus();
    }

    // Handle Tab key for focus cycling
    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift+Tab at first element -> cycle to last element
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab at last element -> cycle to first element
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Handle Escape key to close modal
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        // Dispatch custom event that parent component can listen to
        element.dispatchEvent(new CustomEvent('escapeKeyPressed'));
      }
    };

    element.addEventListener('keydown', handleTabKey);
    element.addEventListener('keydown', handleEscapeKey);

    // Cleanup: remove event listeners and restore focus
    return () => {
      element.removeEventListener('keydown', handleTabKey);
      element.removeEventListener('keydown', handleEscapeKey);
      
      // Restore focus to element that was focused before modal opened
      if (previousFocusRef.current && previousFocusRef.current.focus) {
        previousFocusRef.current.focus();
      }
    };
  }, [isActive]);

  return elementRef;
}

export default useFocusTrap;
