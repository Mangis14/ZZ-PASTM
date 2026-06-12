import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

const TYPES = {
    success: { icon: CheckCircle, iconClass: 'text-green-500', live: 'polite' },
    info: { icon: Info, iconClass: 'text-fl-primary', live: 'polite' },
    error: { icon: AlertTriangle, iconClass: 'text-red-400', live: 'assertive' }
};

const Toast = ({ message, type = 'success', action = null }) => {
    const { icon: Icon, iconClass, live } = TYPES[type] || TYPES.success;

    return (
        <div
            role="status"
            aria-live={live}
            className="toast-safe-bottom fixed left-1/2 z-[10001] flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-3 rounded-xl border border-fl-primary/60 bg-fl-nav py-2 pl-5 pr-2 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
            <Icon size={20} className={`shrink-0 ${iconClass}`} aria-hidden="true" />
            <span className="min-w-0 py-1.5 text-sm font-bold tracking-wide">{message}</span>
            {action ? (
                <button
                    type="button"
                    onClick={action.onAction}
                    className="min-h-11 shrink-0 rounded-lg px-3 text-sm font-bold uppercase tracking-wide text-fl-primary transition-colors hover:bg-white/10 active:bg-white/15"
                >
                    {action.label}
                </button>
            ) : (
                <span className="w-2" aria-hidden="true" />
            )}
        </div>
    );
};

export default Toast;
