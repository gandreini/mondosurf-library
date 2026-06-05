'use client';

import { useEffect, useRef, useState } from 'react';

interface IAnimatedNumber {
    value: number;
    /** Animation duration in ms. Default 380ms. */
    duration?: number;
}

const DEFAULT_DURATION = 380;

/**
 * AnimatedNumber — slot/odometer transition for an integer value.
 *
 * When `value` changes, the previous digit slides out and the new one
 * slides in — from below if the value increased, from above if it
 * decreased. Pure CSS animation (no library). Reusable anywhere a
 * fast, polished count change feels nicer than a raw text swap.
 *
 *   <AnimatedNumber value={likes} />
 *
 * Tip: the wrapper is `inline-block` with `overflow: hidden`, so the
 * surrounding text doesn't reflow during the slide. Parent should size
 * the surrounding line accordingly.
 */
const AnimatedNumber: React.FC<IAnimatedNumber> = ({ value, duration = DEFAULT_DURATION }) => {
    const [current, setCurrent] = useState<number>(value);
    const [previous, setPrevious] = useState<number | null>(null);
    const [direction, setDirection] = useState<'up' | 'down' | null>(null);
    const timeoutRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (value === current) return;

        setPrevious(current);
        setDirection(value > current ? 'up' : 'down');
        setCurrent(value);

        if (timeoutRef.current !== undefined) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
            setPrevious(null);
            setDirection(null);
        }, duration + 40); // small buffer past animation end

        return () => {
            if (timeoutRef.current !== undefined) window.clearTimeout(timeoutRef.current);
        };
    }, [value, current, duration]);

    return (
        <span
            className={`ms-animated-number ms-animated-number--${direction ?? 'idle'}`}
            style={{ ['--ms-animated-number-duration' as any]: `${duration}ms` }}>
            <span className="ms-animated-number__current" aria-live="polite">
                {current}
            </span>
            {previous !== null && (
                <span className="ms-animated-number__prev" aria-hidden="true">
                    {previous}
                </span>
            )}
        </span>
    );
};
export default AnimatedNumber;
