import { createContext } from "react";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
// Sound
import popSound from "../assets/sound/pop_sound.mp3";
import errorSound from "../assets/sound/error.mp3";

interface ToastProviderProps {
  children: React.ReactNode;
};

interface Toast {
  title: string;
  message: string;
  variant: string;
};

export interface ToastContextType {
  addToast: (toast: Toast) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export { ToastContext };

const notyf = new Notyf({
  duration: 10000,
  position: { x: "right", y: "bottom" },
  dismissible: true,
  ripple: false,
  types: [
    {
      type: 'success',
      background: '#141026',
      icon: {
        color: '#24DB24',
        className: 'notyf__icon--success',
        tagName: 'span',
      }
    },
    {
      type: 'error',
      background: '#141026',
      icon: {
        color: '#FF0000',
        className: 'notyf__icon--error',
        tagName: 'span',
      }
    },
    {
      type: 'warning',
      background: '#141026',
      icon: {
        color: '#F59E0B',
        className: 'notyf__icon--warning',
        tagName: 'span',
      }
    },
    {
      type: 'info',
      background: '#141026',
      icon: {
        color: '#3B82F6',
        className: 'notyf__icon--info',
        tagName: 'span',
      }
    }
  ]
});

const playSound = (type: string) => {
  try {
    let audioFile;
    switch (type) {
      case 'error':
        audioFile = errorSound;
        break;
      case 'warning':
        audioFile = errorSound;
        break;
      case 'success':
        audioFile = popSound;
        break;
      case 'info':
        audioFile = popSound;
        break;
      default:
        audioFile = popSound;
        break;
    }

    const audio = new Audio(audioFile);
    audio.volume = 1;
    audio.play().catch(err => {
      console.log("Error al reproducir el audio:", err);
    });
  } catch (error) {
    console.log("Error al cargar el audio:", error);
  }
};

export function ToastProvider({ children }: ToastProviderProps) {
  const addToast = ({ title, message, variant = "default" }: Toast) => {
    let notyfType = 'success';
    switch (variant) {
      case 'destructive':
        notyfType = 'error';
        break;
      case 'success':
        notyfType = 'success';
        break;
      case 'warning':
        notyfType = 'warning';
        break;
      case 'info':
        notyfType = 'info';
        break;
      default:
        notyfType = 'success';
        break;
    }
    playSound(notyfType);

    const fullMessage = title + (message ? `<br><small>${message}</small>` : '');

    notyf.open({
      type: notyfType,
      message: fullMessage,
    });
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
    </ToastContext.Provider>
  );
}