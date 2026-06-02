import React from 'react';
import { CheckCircle } from 'lucide-react';

const Toast = ({ message }) => (
    <div className="toast-safe-bottom fixed left-1/2 -translate-x-1/2 bg-fl-nav text-white px-6 py-3 rounded-lg shadow-2xl z-[60] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 border border-fl-primary">
        <CheckCircle size={20} className="text-green-500" />
        <span className="text-sm font-bold tracking-wide">{message}</span>
    </div>
);

export default Toast;
