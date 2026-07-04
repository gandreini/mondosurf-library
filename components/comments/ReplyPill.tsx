'use client';

import Icon from 'mondosurf-library/components/Icon';
import MondoLink from 'proxies/MondoLink';
import { mondoTranslate } from 'proxies/mondoTranslate';

interface IReplyPill {
    /**
     * If provided, the pill renders as an interactive <button> showing the
     * `Reply` label (spot-page variant): opens the inline ReplyForm.
     */
    onClick?: () => void;
    /** For the aria-expanded attribute on the interactive button. */
    replyFormOpen?: boolean;
    /** Reply count. Shown by the link and static variants; hidden if 0. */
    count?: number;
    /**
     * Homepage variant: when set (and no onClick), the pill is a link to the
     * spot's comments page carrying the "open reply" intent (?reply=1). The
     * comments page opens and focuses that comment's reply form on arrival, so
     * the user can reply straight from the homepage.
     */
    href?: string;
}

/**
 * Action-pill for the comment "reply" action. Three flavours from one
 * component:
 *
 *  - Spot page (onClick): button with icon + "Reply" label; opens the inline
 *    ReplyForm. No count — replies are already visible inline.
 *  - Homepage card (href): link with icon + count; navigates to the comments
 *    page with reply intent, so the user lands with the reply field focused.
 *    Always rendered (even at 0 replies) so reply is actionable from home.
 *  - Fallback (neither): static informational span with icon + count, hidden
 *    when there are no replies.
 */
const ReplyPill: React.FC<IReplyPill> = ({ onClick, replyFormOpen, count, href }) => {
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
    if (href) {
        return (
            <MondoLink href={href} className="ms-comment__reply-btn" dataTest="comment-reply-link">
                <Icon icon="reply" />
                {(count ?? 0) > 0 && <span className="ms-comment__reply-count-text">{count}</span>}
            </MondoLink>
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
