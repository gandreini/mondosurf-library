'use client';

import { useState, useRef, useLayoutEffect } from 'react';

interface IExpandableTextProps {
    /** The text content to display */
    text: string;
    /** Label for the expand action (default: "Read more") */
    label?: string;
    /** Number of lines to show when collapsed (default: 3) */
    lines?: number;
    /** Additional CSS class name */
    className?: string;
    /** Label shown when text is expanded (default: "Show less") */
    collapseLabel?: string;
    /** Whether to show the expand/collapse button. If false, text is just truncated (default: true) */
    expandable?: boolean;
    /** Whether to start in expanded state (default: false) */
    initialExpanded?: boolean;
}

/**
 * ExpandableText - A component for displaying truncated text with expand/collapse functionality
 *
 * SEO-friendly: Full text is always in the DOM for search engines to index.
 * 'use client' components are still server-side rendered in Next.js 14.
 * When collapsed, text is visually truncated with CSS line-clamp.
 */
const ExpandableText: React.FC<IExpandableTextProps> = ({
    text,
    label = 'Read more',
    lines = 4,
    className = '',
    collapseLabel = 'Show less',
    expandable = true,
    initialExpanded = false
}) => {
    const [isExpanded, setIsExpanded] = useState(initialExpanded);
    const [needsTruncation, setNeedsTruncation] = useState(false);
    const textRef = useRef<HTMLDivElement>(null);

    // Check if text actually needs truncation based on scroll height vs visible height
    // Uses useLayoutEffect to measure synchronously before paint
    useLayoutEffect(() => {
        if (!textRef.current || !expandable) return;

        const element = textRef.current;

        if (isExpanded) {
            // When expanded, temporarily apply collapsed styles to measure
            const originalStyle = element.style.cssText;
            element.classList.add('ms-expandable-text__content--collapsed');
            element.style.webkitLineClamp = String(lines);

            const { scrollHeight, clientHeight } = element;
            setNeedsTruncation(scrollHeight > clientHeight);

            // Restore expanded state
            element.classList.remove('ms-expandable-text__content--collapsed');
            element.style.cssText = originalStyle;
        } else {
            // When collapsed, measure directly
            const { scrollHeight, clientHeight } = element;
            setNeedsTruncation(scrollHeight > clientHeight);
        }
    }, [text, lines, expandable, isExpanded]);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    // When not expandable, always show truncated
    const showCollapsed = !expandable || !isExpanded;

    return (
        <div className={`ms-expandable-text ${className}`.trim()}>
            {/* Text content - CSS line-clamp handles truncation when collapsed */}
            <div
                ref={textRef}
                className={`ms-expandable-text__content ${
                    showCollapsed ? 'ms-expandable-text__content--collapsed' : ''
                }`}
                style={showCollapsed ? { WebkitLineClamp: lines } : undefined}>
                {text}
            </div>

            {/* Expand/collapse button - only shown if expandable and text needs truncation */}
            {expandable && needsTruncation && (
                <div className="ms-expandable-text__action">
                    <button type="button" onClick={handleToggle} className="ms-expandable-text__button">
                        {isExpanded ? collapseLabel : label}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExpandableText;
