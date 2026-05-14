"use client";
import React, { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  type?: "success" | "error" | "info";
  duration?: number;
}

const PopupNotification: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  title,
  children,
  type = "info",
  duration = 3000,
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, duration]);

  if (!isOpen) return null;

  const typeClasses = {
    success: "bg-green-100 border-green-500 text-green-800",
    error: "bg-red-100 border-red-500 text-red-800",
    info: "bg-blue-100 border-blue-500 text-blue-800",
  };

  return (
    <div className={`fixed top-5 right-5 z-50 border-l-4 p-4 shadow-lg rounded-md w-[300px] ${typeClasses[type]}`}>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold">{title}</h4>
        <button onClick={onClose}><X size={16} /></button>
      </div>
      <div className="text-sm">{children}</div>
    </div>
  );
};

export default PopupNotification;
