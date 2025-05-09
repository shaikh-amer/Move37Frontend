"use client";

import React, { createContext, useState, useContext } from "react";
import * as Toast from "@radix-ui/react-toast";
import { FiX } from "react-icons/fi";

type ToastType = "success" | "error" | "info" | "warning";

type ToastContextType = {
  showToast: (message: string, type?: ToastType, title?: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastTitle, setToastTitle] = useState("");
  const [toastType, setToastType] = useState<ToastType>("info");

  const showToast = (
    message: string,
    type: ToastType = "info",
    title?: string,
  ) => {
    setToastMessage(message);
    setToastType(type);

    // Set default titles based on type if title is not provided
    if (!title) {
      switch (type) {
        case "success":
          setToastTitle("Success");
          break;
        case "error":
          setToastTitle("Error");
          break;
        case "warning":
          setToastTitle("Warning");
          break;
        case "info":
          setToastTitle("Info");
          break;
        default:
          setToastTitle("");
      }
    } else {
      setToastTitle(title);
    }

    setToastOpen(true);
  };

  const getToastStyles = () => {
    switch (toastType) {
      case "success":
        return "bg-green-600 text-white border border-green-700";
      case "error":
        return "bg-red-600 text-white border border-red-700";
      case "warning":
        return "bg-yellow-500 text-white border border-yellow-600";
      case "info":
        return "bg-blue-600 text-white border border-blue-700";
      default:
        return "bg-gray-700 text-white border border-gray-800";
    }
  };

  return (
    <Toast.Provider duration={3000} swipeDirection="right">
      <ToastContext.Provider value={{ showToast }}>
        {children}
      </ToastContext.Provider>
      <Toast.Root
        open={toastOpen}
        onOpenChange={setToastOpen}
        className={`flex items-center justify-between px-4 py-3 rounded-lg shadow-lg ${getToastStyles()}`}
      >
        <div>
          <Toast.Title className="text-sm font-semibold">
            {toastTitle}
          </Toast.Title>
          <Toast.Description className="mt-1 text-xs">
            {toastMessage}
          </Toast.Description>
        </div>
        <button
          onClick={() => setToastOpen(false)}
          className="ml-4 text-white hover:text-gray-300"
          aria-label="Close"
        >
          <FiX />
        </button>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-4 right-4 flex flex-col gap-2 w-96 m-0 list-none z-50 outline-none" />
    </Toast.Provider>
  );
}
