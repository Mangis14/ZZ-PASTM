import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import useDialog from '../../hooks/useDialog';

/* Náhrada za window.confirm: rovnaká „opýtaj sa a počkaj" sémantika
   (`await confirmAction(...)` vráti true/false), ale v dizajne aplikácie
   a so správaním natívneho dialógu (Späť/Escape = zrušiť). */

let activeListener = null;

export function confirmAction({ title, message, confirmLabel = 'Potvrdit', cancelLabel = 'Zrušit', danger = false }) {
    if (!activeListener) return Promise.resolve(window.confirm(message || title));
    return new Promise((resolve) => {
        activeListener({ title, message, confirmLabel, cancelLabel, danger, resolve });
    });
}

const ConfirmDialog = ({ request }) => {
    const close = (result) => request.resolve(result);
    const panelRef = useDialog(() => close(false));

    return (
        <div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => close(false)}
        >
            <div
                ref={panelRef}
                tabIndex={-1}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="fl-confirm-title"
                aria-describedby={request.message ? 'fl-confirm-message' : undefined}
                className="w-full max-w-sm rounded-2xl border border-fl-border bg-fl-card p-6 shadow-2xl outline-none animate-in fade-in zoom-in-95 duration-200"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-start gap-3">
                    {request.danger && (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-900/15 text-red-700 dark:text-red-400">
                            <AlertTriangle size={20} />
                        </div>
                    )}
                    <div className="min-w-0">
                        <h2 id="fl-confirm-title" className="font-serif text-xl font-bold leading-tight text-fl-surface">
                            {request.title}
                        </h2>
                        {request.message && (
                            <p id="fl-confirm-message" className="mt-2 text-sm leading-relaxed text-fl-text-muted">
                                {request.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => close(false)}
                        className="min-h-12 rounded-full px-5 text-sm font-bold uppercase tracking-wide text-fl-primary transition-colors hover:bg-fl-primary/10 active:bg-fl-primary/20"
                    >
                        {request.cancelLabel}
                    </button>
                    <button
                        type="button"
                        autoFocus
                        onClick={() => close(true)}
                        className={`min-h-12 rounded-full px-5 text-sm font-bold uppercase tracking-wide text-white shadow-sm transition-all active:scale-[0.97] ${
                            request.danger
                                ? 'bg-red-800 hover:bg-red-700'
                                : 'bg-fl-primary hover:bg-fl-primary-hover'
                        }`}
                    >
                        {request.confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

/** Jediný hostiteľ dialógov — vykresľuje ho App, volá sa cez confirmAction(). */
export function ConfirmHost() {
    const [request, setRequest] = useState(null);

    useEffect(() => {
        activeListener = (next) => {
            setRequest({
                ...next,
                resolve: (result) => {
                    setRequest(null);
                    next.resolve(result);
                }
            });
        };
        return () => {
            activeListener = null;
        };
    }, []);

    if (!request) return null;
    return <ConfirmDialog request={request} />;
}

export default ConfirmDialog;
