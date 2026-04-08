import React from 'react';

const Card = ({ children, className = "", innerRef }) => (
    <section ref={innerRef} className={`bg-fl-card p-5 rounded-sm shadow-[2px_2px_0px_0px_rgba(139,115,85,0.15)] border border-fl-paper ${className}`}>
        {children}
    </section>
);

export default Card;
