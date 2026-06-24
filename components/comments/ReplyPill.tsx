'use client';

import Icon from 'mondosurf-library/components/Icon';
import { mondoTranslate } from 'proxies/mondoTranslate';

interface IReplyPill {
    /**
     * If provided, the pill renders as an interactive <button> showing the
     * `Reply` label (spot-page variant). Without it, the pill renders as a
     * static <span> showing only the reply count (homepage card variant).
     */
    onClick?: () => void;
    /** For the aria-expanded attribute on the interactive button. */
    replyFormOpen?: boolean;
    /** Used by the static variant. Hidden if 0 or undefined. */
    count?: number;
}

/**
 * Action-pill for the comment "reply" action. Two flavours from one
 * component:
 *
 *  - Spot page (onClick provided): button with icon + "Reply" label; opens
 *    the inline ReplyForm. No count — replies are already visible inline.
 *  - Homepage card (no onClick): static span with icon + count; purely
 *    informational. Wrapping <MondoLink> handles navigation on tap.
 */
const ReplyPill: React.FC<IReplyPill> = ({ onClick, replyFormOpen, count }) => {
    if (onClick) {
        return (
            <button
                type="button"
                className="ms-comment__reply-btn"
                onClick={onClick}
                aria-expanded={replyFormOpen ?? false}
                data-test="comment-reply-btn">
                <Icon icon="reply" />
                <span>{mondoTranslate('comments.reply')}</span>
            </button>
        );
    }
    if ((count ?? 0) === 0) return null;
    return (
        <span className="ms-comment__reply-btn is-static" data-test="comment-reply-count">
            <Icon icon="reply" />
            <span className="ms-comment__reply-count-text">{count}</span>
        </span>
    );
};
export default ReplyPill;
