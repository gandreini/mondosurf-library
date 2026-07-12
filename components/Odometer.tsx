'use client';

interface IOdometer {
    value: number;
    /** Per-digit roll duration in ms. Default 700ms. */
    duration?: number;
}

const ALL_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * Odometer — mechanical-counter style integer display.
 *
 * Each digit lives in its own column rendered as a vertical strip 0-9
 * with overflow hidden. The strip translates so the active digit lands
 * in the visible window. When the value changes, the CSS transition on
 * `transform` smoothly rolls every changed digit to its new value.
 *
 * Keying the columns by their position from the right means digit
 * count changes (e.g. 9 → 10) keep the units column stable — only the
 * tens column is new and mounts in place. Pure CSS, no library dep.
 *
 *   <Odometer value={42} />
 *   <Odometer value={42} duration={500} />
 *
 * Notes:
 *   - Only handles non-negative integers (negative values get a leading
 *     minus sign rendered outside the rolling columns).
 *   - `tabular-nums` is enforced so the column width stays constant
 *     regardless of which digit is showing (kills jitter on 1 ↔ 0).
 */
const Odometer: React.FC<IOdometer> = ({ value, duration = 700 }) => {
    const safe = Math.floor(value);
    const isNegative = safe < 0;
    const digits = String(Math.abs(safe)).split('').map(Number);

    return (
        <span className="ms-odometer" aria-label={String(safe)}>
            {isNegative && (
                <span className="ms-odometer__sign" aria-hidden="true">
                    −
                </span>
            )}
            {digits.map((digit, i) => (
                // Key by position from the right, so each column survives
                // across digit-count changes and animates in place.
                <span key={digits.length - i} className="ms-odometer__col" aria-hidden="true">
                    <span
                        className="ms-odometer__track"
                        style={{
                            transform: `translateY(-${digit * 10}%)`,
                            transitionDuration: `${duration}ms`
                        }}>
                        {ALL_DIGITS.map((d) => (
                            <span key={d} className="ms-odometer__cell">
                                {d}
                            </span>
                        ))}
                    </span>
                </span>
            ))}
        </span>
    );
};
export default Odometer;
