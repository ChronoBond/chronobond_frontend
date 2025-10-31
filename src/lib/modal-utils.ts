/**
 * Utility functions for managing modal state and backdrop blur
 * Ensures consistent modal behavior across all modals
 */

export const modalUtils = {
  /**
   * Enable modal state - disables body scroll and adds modal-open class
   */
  enableModal: () => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("modal-open");
  },

  /**
   * Disable modal state - enables body scroll and removes modal-open class
   */
  disableModal: () => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = "unset";
    document.documentElement.classList.remove("modal-open");
  },

  /**
   * Create cleanup function for modal useEffect
   * Usage: return createModalCleanup()
   */
  createModalCleanup: () => {
    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.classList.remove("modal-open");
    };
  },
};
