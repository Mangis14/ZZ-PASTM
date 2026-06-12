import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

const TYPES = {
    success: { icon: CheckCircle, iconClass: 'text-green-500', live: 'polite' },
    info: { icon: Info, iconClass: 'text-fl-primary', live: 'polite' },
    error: { icon: AlertTriangle, iconClass: 'text-red-400', live: 'assertive' }
};

const Toast = ({ message, type = 'success' }) => {
    const { icon: Icon, iconClass, live } = TYPES[type] || TYPES.success;

    return (
        <div
            role="status"
            aria-live={live}
            className="toast-safe-bottom fixed left-1/2 z-[10001] flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-3 rounded-xl border border-fl-primary/60 bg-fl-nav px-5 py-3.5 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
            <Icon size={20} className={`shrink-0 ${iconClass}`} aria-hidden="true" />
            <span className="min-w-0 text-sm font-bold tracking-wide">{message}</span>
        </div>
    );
};

export default Toast;
