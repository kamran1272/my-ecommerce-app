import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const ToastContext = createContext(null);

const MAX_TOASTS = 4;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timeoutsRef = useRef(new Map());

  const removeToast = useCallback((id) => {
    const timeoutId = timeoutsRef.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutsRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'info', duration = 3000) => {
      const id = Date.now() + Math.random();

      setToasts((prev) => [...prev, { id, message, type, duration }].slice(-MAX_TOASTS));

      const timeoutId = setTimeout(() => removeToast(id), duration);
      timeoutsRef.current.set(id, timeoutId);
    },
    [removeToast]
  );

  useEffect(
    () => () => {
      timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutsRef.current.clear();
    },
    []
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed top-4 right-4 z-50 flex w-80 flex-col gap-3">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onClose }) => (
  <div
    className={`relative animate-slide-in overflow-hidden rounded-xl px-4 py-3 text-white shadow-lg ${
      toast.type === 'success'
        ? 'bg-green-600'
        : toast.type === 'error'
          ? 'bg-red-600'
          : 'bg-blue-600'
    }`}
    role="status"
    aria-live="polite"
  >
    <div className="flex items-center justify-between gap-3">
      <span>{toast.message}</span>
      <button
        onClick={() => onClose(toast.id)}
        className="text-white/80 transition hover:text-white"
        aria-label="Close notification"
      >
        x
      </button>
    </div>
    <div
      className="absolute bottom-0 left-0 h-1 bg-white/40"
      style={{
        width: '100%',
        animation: `shrink ${toast.duration}ms linear forwards`,
      }}
    />
  </div>
);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider.');
  }
  return context;
};

export default ToastProvider;
