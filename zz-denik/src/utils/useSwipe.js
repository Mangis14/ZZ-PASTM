import { useState } from 'react';

export const useSwipe = ({ onSwipedLeft, onSwipedRight }) => {
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    
    // Minimum distance (in pixels) to register as a swipe
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        
        if (isLeftSwipe && onSwipedLeft) onSwipedLeft();
        if (isRightSwipe && onSwipedRight) onSwipedRight();
    };

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };
};
