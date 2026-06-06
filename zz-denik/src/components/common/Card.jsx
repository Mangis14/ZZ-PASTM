import React from 'react';
import { useSheetTile } from './SheetTile';

const Card = ({ children, className = "", innerRef }) => {
    const embedded = useSheetTile();

    return (
        <section
            ref={innerRef}
            className={embedded
                ? `bg-transparent p-0 border-0 shadow-none ${className}`
                : `bg-fl-card p-5 rounded-sm shadow-[2px_2px_0px_0px_rgba(139,115,85,0.15)] border border-fl-paper ${className}`
            }
        >
            {children}
        </section>
    );
};

export default Card;
