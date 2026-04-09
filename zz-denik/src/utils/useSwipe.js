import { useState, useRef, useCallback } from 'react';

export const useSwipe = ({ onSwipedLeft, onSwipedRight, disabled = false }) => {
    const [swipeOffset, setSwipeOffset] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [slideDirection, setSlideDirection] = useState(null); // 'left' | 'right' | null
    const gestureStartRef = useRef(null);
    const gestureLastRef = useRef(null);
    const gestureIntentRef = useRef(null);

    // Require a clearly horizontal gesture before switching sections.
    const minSwipeDistance = 96;
    const minHorizontalIntent = 24;
    const maxVerticalDrift = 18;
    const maxDrag = 120;

    const onTouchStart = useCallback((e) => {
        if (disabled || isTransitioning) return;
        const touch = e.targetTouches[0];
        gestureStartRef.current = { x: touch.clientX, y: touch.clientY };
        gestureLastRef.current = { x: touch.clientX, y: touch.clientY };
        gestureIntentRef.current = null;
        setSwipeOffset(0);
    }, [disabled, isTransitioning]);

    const onTouchMove = useCallback((e) => {
        if (disabled || isTransitioning || !gestureStartRef.current) return;

        const touch = e.targetTouches[0];
        const deltaX = touch.clientX - gestureStartRef.current.x;
        const deltaY = touch.clientY - gestureStartRef.current.y;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        gestureLastRef.current = { x: touch.clientX, y: touch.clientY };

        if (!gestureIntentRef.current) {
            if (absY > maxVerticalDrift && absY > absX) {
                gestureIntentRef.current = 'scroll';
                setSwipeOffset(0);
                return;
            }

            if (absX > minHorizontalIntent && absX > absY * 2) {
                gestureIntentRef.current = 'swipe';
            } else {
                return;
            }
        }

        if (gestureIntentRef.current !== 'swipe') return;

        const capped = Math.sign(deltaX) * Math.min(absX, maxDrag);
        setSwipeOffset(capped * 0.35);
    }, [disabled, isTransitioning]);

    const onTouchEnd = useCallback(() => {
        if (disabled || isTransitioning || !gestureStartRef.current || !gestureLastRef.current) return;

        const deltaX = gestureLastRef.current.x - gestureStartRef.current.x;
        const deltaY = gestureLastRef.current.y - gestureStartRef.current.y;
        const intent = gestureIntentRef.current;

        gestureStartRef.current = null;
        gestureLastRef.current = null;
        gestureIntentRef.current = null;

        if (intent !== 'swipe') {
            setSwipeOffset(0);
            return;
        }

        if (Math.abs(deltaY) > maxVerticalDrift * 2) {
            setSwipeOffset(0);
            return;
        }

        const distance = -deltaX;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe || isRightSwipe) {
            setSlideDirection(isLeftSwipe ? 'left' : 'right');
            setIsTransitioning(true);
            setSwipeOffset(0);

            setTimeout(() => {
                if (isLeftSwipe && onSwipedLeft) onSwipedLeft();
                if (isRightSwipe && onSwipedRight) onSwipedRight();

                setTimeout(() => {
                    setIsTransitioning(false);
                    setSlideDirection(null);
                }, 250);
            }, 50);
        } else {
            setSwipeOffset(0);
        }
    }, [disabled, isTransitioning, onSwipedLeft, onSwipedRight]);

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        swipeOffset,
        isTransitioning,
        slideDirection,
    };
};
