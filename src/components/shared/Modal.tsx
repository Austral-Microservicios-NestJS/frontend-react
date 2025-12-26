import type { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
}

export const Modal = ({ children }: ModalProps) => {
  return (
    <div className="flex flex-col gap-4 p-6 h-auto max-h-[85vh] rounded-3xl overflow-y-auto bg-gray-50">
      {children}
    </div>
  );
};

interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

export const ModalBody = ({ children, className = "" }: ModalBodyProps) => {
  return <div className={`space-y-4 ${className}`}>{children}</div>;
};

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

export const ModalFooter = ({ children, className = "" }: ModalFooterProps) => {
  return (
    <div
      className={`flex items-center justify-end mt-4 gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg ${className}`}
    >
      {children}
    </div>
  );
};