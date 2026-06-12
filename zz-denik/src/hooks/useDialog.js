import { useEffect, useRef } from 'react';
import { registerBackHandler } from '../native/platform';

let scrollLocks = 0;

/**
 * Spoločné správanie každej modálnej vrstvy:
 *  – systémové Späť / Escape ju zatvorí (LIFO — vždy len najvrchnejšiu),
 *  – pozadie sa nedá skrolovať,
 *  – po zatvorení sa fokus vráti na pôvodný prvok.
 *
 * Vracia ref pre panel dialógu; panel by mal mať `tabIndex={-1}`,
 * aby naň po otvorení mohol prejsť fokus (čítačky, klávesnica).
 */
export default function useDialog(onClose) {
    const closeRef = useRef(onClose);
    const panelRef = useRef(null);

    useEffect(() => {
        closeRef.current = onClose;
    });

    useEffect(() => registerBackHandler(() => {
        closeRef.current?.();
    }), []);

    useEffect(() => {
        const previouslyFocused = document.activeElement;

        scrollLocks += 1;
        document.body.classList.add('fl-scroll-lock');
        panelRef.current?.focus?.({ preventScroll: true });

        return () => {
            scrollLocks -= 1;
            if (scrollLocks === 0) document.body.classList.remove('fl-scroll-lock');
            if (previouslyFocused instanceof HTMLElement) {
                previouslyFocused.focus?.({ preventScroll: true });
            }
        };
    }, []);

    return panelRef;
}
