import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useDialog from '../../hooks/useDialog';

/* Malé menu ukotvené u tlačítka (váha, počet kusů, volby). Drží se pod
   tlačítkem, při nedostatku místa se otevře nahoru a nikdy nevyjede mimo
   obrazovku. Zavře se výběrem, klepnutím vedle nebo systémovým Zpět. */
const AnchoredMenu = ({ anchorRect, onClose, label, widthClass = 'w-48', children }) => {
    const panelRef = useDialog(onClose);
    const menuRef = useRef(null);
    const [position, setPosition] = useState({ top: anchorRect.bottom + 6, left: Math.max(12, anchorRect.right - 192) });

    useLayoutEffect(() => {
        const menu = menuRef.current;
        if (!menu) return;
        const { height, width } = menu.getBoundingClientRect();
        const spaceBelow = window.innerHeight - anchorRect.bottom;
        const preferredTop = spaceBelow < height + 96 ? anchorRect.top - height - 6 : anchorRect.bottom + 6;
        const top = Math.min(window.innerHeight - height - 12, Math.max(12, preferredTop));
        const left = Math.min(window.innerWidth - width - 12, Math.max(12, anchorRect.right - width));
        setPosition({ top, left });
    }, [anchorRect]);

    return createPortal(
        <div className="fixed inset-0 z-[9000]" onClick={onClose}>
            <div
                ref={(node) => { menuRef.current = node; panelRef.current = node; }}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-label={label}
                className={`fixed overflow-hidden rounded-xl border border-fl-border bg-fl-card p-1 shadow-2xl outline-none animate-in fade-in zoom-in-95 duration-150 ${widthClass}`}
                style={{ top: position.top, left: position.left }}
                onClick={(event) => event.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body
    );
};

/* Stav otevření menu: `open` se volá z onClick tlačítka, ke kterému se menu ukotví. */
export const useAnchoredMenu = () => {
    const [anchorRect, setAnchorRect] = useState(null);
    return {
        anchorRect,
        isOpen: Boolean(anchorRect),
        open: (event) => setAnchorRect(event.currentTarget.getBoundingClientRect()),
        close: () => setAnchorRect(null)
    };
};

export default AnchoredMenu;
