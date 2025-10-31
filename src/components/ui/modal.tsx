"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { modalUtils } from "@/lib/modal-utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  isDisabled?: boolean;
}

/**
 * Reusable Modal Component
 * Renders to body via portal to avoid parent blur inheritance
 * Backdrop is in separate z-layer from modal content
 */
export const Modal = ({ isOpen, onClose, children, isDisabled = false }: ModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      modalUtils.enableModal();
    } else {
      modalUtils.disableModal();
    }

    return modalUtils.createModalCleanup();
  }, [isOpen]);

  if (!isMounted || !isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isDisabled) {
      onClose();
    }
  };

  // Render to body to avoid parent filter inheritance
  return createPortal(
    <>
      {/* Backdrop layer - z-50 with blur */}
      <div
        className="fixed inset-0 bg-semantic-overlay/80 backdrop-blur-lg z-50"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      
      {/* Modal layer - z-[100] without blur */}
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="w-full pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </>,
    document.body
  );
};

export default Modal;
