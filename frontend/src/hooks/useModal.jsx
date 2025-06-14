import { useState, useCallback } from 'react';

/**
 * Custom hook for managing modal state
 * @param {boolean} initialIsOpen - Initial open state of the modal
 * @returns {Object} Modal state and control functions
 */
const useModal = (initialIsOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [modalData, setModalData] = useState(null);

  /**
   * Open the modal with optional data
   * @param {*} data - Data to pass to the modal
   */
  const openModal = useCallback((data = null) => {
    setModalData(data);
    setIsOpen(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }, []);

  /**
   * Close the modal and optionally clear the data
   * @param {boolean} clearData - Whether to clear the modal data on close
   */
  const closeModal = useCallback((clearData = true) => {
    setIsOpen(false);
    // Re-enable body scroll
    document.body.style.overflow = 'auto';
    
    // Use a small timeout to allow the modal close animation to complete
    // before clearing the data (if needed)
    if (clearData) {
      setTimeout(() => {
        setModalData(null);
      }, 300);
    }
  }, []);

  /**
   * Toggle the modal's open state
   */
  const toggleModal = useCallback(() => {
    setIsOpen(prev => {
      const newState = !prev;
      document.body.style.overflow = newState ? 'hidden' : 'auto';
      return newState;
    });
  }, []);

  /**
   * Update the modal data
   * @param {*} data - New data to merge with existing modal data
   */
  const updateModalData = useCallback((data) => {
    setModalData(prev => ({
      ...prev,
      ...data,
    }));
  }, []);

  return {
    isOpen,
    modalData,
    openModal,
    closeModal,
    toggleModal,
    updateModalData,
  };
};

export default useModal;
