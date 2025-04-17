"use client";

import { toast as toastify } from "react-toastify";

export interface ToastProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
}

// Export toast function that uses react-toastify
export const toast = ({ title, description, variant }: ToastProps) => {
  // Create a custom component to avoid passing closeToast to React.Fragment
  const ToastContent = ({ closeToast, ...props }: any) => (
    <>
      {title && <div className="font-semibold">{title}</div>}
      {description && <div>{description}</div>}
    </>
  );

  if (variant === "destructive") {
    return toastify.error(ToastContent);
  }

  return toastify(ToastContent);
};

// For compatibility with existing code
export function useToast() {
  return {
    toast,
    dismiss: toastify.dismiss,
  };
}
