import React, { createContext, useContext, useState, useEffect } from "react";
import { cva } from "class-variance-authority";
import IconWarning from "@/icons/IconWarning";
import IconClose from "@/icons/IconClose";
import IconCheckMark from "@/icons/IconCheckMark";

const ToastContext = createContext();

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center gap-2 overflow-hidden rounded-[15px] px-4 py-4 pr-5 shadow-lg transition-all text-white bg-[#232531]",
  {
    variants: {
      variant: {
        default: "bg-[#232531]", // Normal
        destructive: "  -red-700", // Error
        success: "  -green-700", // Éxito
        warning: " -yellow-700", // Advertencia
        info: " -blue-700", // Información
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const [visible, setVisible] = useState(false);
  let toastTimer = null;

  const addToast = ({ title, message, variant = "default" }) => {
    setToast({ title, message, variant });
    setVisible(true);

    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => setToast(null), 300);
    }, 30000);
  };

  useEffect(() => {
    return () => {
      if (toastTimer) clearTimeout(toastTimer);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[9999] max-w-[300px] min-w-[250px]">
          <div
            className={`${toastVariants({ variant: toast.variant })} ${
              visible ? "error-visible" : "error-hidden"
            } error-login`}
          >
            {/* 🔥 Aquí cambia el icono según el tipo de Toast */}
            {toast.variant === "destructive" && (
              <IconWarning className="text-red-500 w-6 h-6" />
            )}
            {toast.variant === "success" && (
              <IconCheckMark className="text-green-500 w-6 h-6" />
            )}
            {toast.variant === "warning" && (
              <IconWarning className="text-yellow-500 w-6 h-6" />
            )}
            <div className="grid gap-0.5 ">
              <h4 className="text-xs font-medium">
                {toast.title || "Notificación"}
              </h4>
              {toast.message && (
                <p className="text-[11px] text-gray-400 leading-3 ">
                  {toast.message}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
