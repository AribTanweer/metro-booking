import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import './Toast.css';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timersRef = useRef({});

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
        clearTimeout(timersRef.current[id]);
        delete timersRef.current[id];
    }, []);

    const addToast = useCallback(({ message, type = 'info', duration = 4000 }) => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, message, type, exiting: false }]);
        timersRef.current[id] = setTimeout(() => {
            // Trigger exit animation
            setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
            // Remove after animation
            setTimeout(() => removeToast(id), 300);
        }, duration);
        return id;
    }, [removeToast]);

    const toast = useCallback({
        success: (message, duration) => addToast({ message, type: 'success', duration }),
        error: (message, duration) => addToast({ message, type: 'error', duration }),
        info: (message, duration) => addToast({ message, type: 'info', duration }),
    }, [addToast]);

    // Workaround: expose methods directly
    const api = useRef({ success: null, error: null, info: null });
    api.current.success = (msg, dur) => addToast({ message: msg, type: 'success', duration: dur });
    api.current.error = (msg, dur) => addToast({ message: msg, type: 'error', duration: dur });
    api.current.info = (msg, dur) => addToast({ message: msg, type: 'info', duration: dur });

    const ICONS = {
        success: <CheckCircle size={18} />,
        error: <AlertCircle size={18} />,
        info: <Info size={18} />,
    };

    return (
        <ToastContext.Provider value={api.current}>
            {children}
            <div className="toast-container" role="alert" aria-live="polite">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className={`toast toast-${t.type} ${t.exiting ? 'toast-exit' : 'toast-enter'}`}
                    >
                        <span className="toast-icon">{ICONS[t.type]}</span>
                        <span className="toast-message">{t.message}</span>
                        <button
                            className="toast-close"
                            onClick={() => {
                                setToasts(prev => prev.map(x => x.id === t.id ? { ...x, exiting: true } : x));
                                setTimeout(() => removeToast(t.id), 300);
                            }}
                            aria-label="Close"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}
