import { useState, useRef, useCallback } from 'react';

export const useSwipe = ({ onSwipedLeft, onSwipedRight }) => {
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [swipeOffset, setSwipeOffset] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [slideDirection, setSlideDirection] = useState(null); // 'left' | 'right' | null

    // Minimum distance (in pixels) to register as a swipe
    const minSwipeDistance = 50;
    // Maximum visual drag distance
    const maxDrag = 120;

    const onTouchStart = useCallback((e) => {
        if (isTransitioning) return;
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
        setSwipeOffset(0);
    }, [isTransitioning]);

    const onTouchMove = useCallback((e) => {
        if (isTransitioning || touchStart === null) return;
        const currentX = e.targetTouches[0].clientX;
        setTouchEnd(currentX);
        // Calculate drag offset (capped)
        const rawOffset = currentX - touchStart;
        const capped = Math.sign(rawOffset) * Math.min(Math.abs(rawOffset), maxDrag);
        setSwipeOffset(capped * 0.4); // Dampen the visual effect
    }, [isTransitioning, touchStart]);

    const onTouchEnd = useCallback(() => {
        if (!touchStart || !touchEnd || isTransitioning) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe || isRightSwipe) {
            setSlideDirection(isLeftSwipe ? 'left' : 'right');
            setIsTransitioning(true);
            setSwipeOffset(0);

            // Trigger the callback after a short delay for animation
            setTimeout(() => {
                if (isLeftSwipe && onSwipedLeft) onSwipedLeft();
                if (isRightSwipe && onSwipedRight) onSwipedRight();

                // Reset after transition completes
                setTimeout(() => {
                    setIsTransitioning(false);
                    setSlideDirection(null);
                }, 250);
            }, 50);
        } else {
            setSwipeOffset(0);
        }

        setTouchStart(null);
        setTouchEnd(null);
    }, [touchStart, touchEnd, isTransitioning, onSwipedLeft, onSwipedRight]);

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        swipeOffset,
        isTransitioning,
        slideDirection,
    };
};
