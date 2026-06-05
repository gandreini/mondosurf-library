'use client';

import { openLoginModal } from 'features/modal/modal.helpers';
import Odometer from 'mondosurf-library/components/Odometer';
import Icon from 'mondosurf-library/components/Icon';
import { likeComment, unlikeComment } from 'mondosurf-library/helpers/comments.helpers';
import { RootState } from 'mondosurf-library/redux/store';
import toastService from 'mondosurf-library/services/toastService';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

interface ILikeButton {
    commentId: number;
    likesCount: number;
    userHasLiked: boolean;
    onToggle?: (newCount: number, newUserHasLiked: boolean) => void;
}

// Keep in sync with the backend's per-(user, comment) rate-limit window.
const LIKE_COOLDOWN_MS = 2000;
// Brief scale-pulse on the icon whenever the user toggles the like state.
const ICON_PULSE_MS = 380;

const LikeButton: React.FC<ILikeButton> = (props) => {
    const login = useSelector((state: RootState) => state.user.logged);

    const [likesCount, setLikesCount] = useState<number>(props.likesCount ?? 0);
    const [userHasLiked, setUserHasLiked] = useState<boolean>(props.userHasLiked ?? false);
    const [pending, setPending] = useState<boolean>(false);
    const [iconPulsing, setIconPulsing] = useState<boolean>(false);
    const pulseTimeoutRef = useRef<number | undefined>(undefined);

    const triggerIconPulse = () => {
        if (pulseTimeoutRef.current !== undefined) window.clearTimeout(pulseTimeoutRef.current);
        setIconPulsing(true);
        pulseTimeoutRef.current = window.setTimeout(() => setIconPulsing(false), ICON_PULSE_MS);
    };

    const callApi = () => {
        const prevLiked = userHasLiked;
        const prevCount = likesCount;
        const nextLiked = !prevLiked;

        // Icon flips immediately — instant visual acknowledgement of the click.
        // The COUNT update is held back: the AnimatedNumber slot animation
        // reveals it at the end of the cooldown window for a satisfying beat.
        setUserHasLiked(nextLiked);
        triggerIconPulse();
        setPending(true);

        const startedAt = Date.now();
        const request = nextLiked ? likeComment(props.commentId) : unlikeComment(props.commentId);

        request
            .then((response) => {
                // Reveal the new count when the cooldown releases (a 2s beat
                // counted from the click). Until then likesCount stays at its
                // previous value and the AnimatedNumber sits idle.
                const elapsed = Date.now() - startedAt;
                const remaining = Math.max(0, LIKE_COOLDOWN_MS - elapsed);
                window.setTimeout(() => {
                    setLikesCount(response.likes_count);
                    // Re-sync in case the server's idea of liked-state drifted
                    // (e.g. simultaneous toggle from another tab).
                    setUserHasLiked(response.user_has_liked);
                    setPending(false);
                    if (props.onToggle) props.onToggle(response.likes_count, response.user_has_liked);
                }, remaining);
            })
            .catch((error: any) => {
                // Revert the icon immediately on failure — don't make the user
                // wait the full cooldown to find out their click was rejected.
                setUserHasLiked(prevLiked);
                triggerIconPulse();
                // Suppress the toast for rate-limit (the cooldown is the
                // user-facing guard; 429 is just an edge-case safety net).
                if (error?.code !== 'rate_limited') {
                    toastService.error(mondoTranslate('comments.toast_like_error'));
                }
                // Still honour the cooldown for re-clicking.
                const elapsed = Date.now() - startedAt;
                const remaining = Math.max(0, LIKE_COOLDOWN_MS - elapsed);
                window.setTimeout(() => setPending(false), remaining);
                // Keep prevCount referenced to silence the unused-var linter
                // and document the intent: we deliberately never touched
                // likesCount, so there's nothing to revert here.
                void prevCount;
            });
    };

    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        // Prevent the click bubbling to the outer card link on the homepage.
        e.stopPropagation();
        e.preventDefault();

        if (pending) return;
        if (login !== 'yes') {
            openLoginModal('likeButton', undefined, mondoTranslate('comments.login_modal_text_like'), () => {
                callApi();
            });
            return;
        }
        callApi();
    };

    return (
        <button
            type="button"
            className={`ms-comment__like-btn ${userHasLiked ? ' is-liked' : ''}`}
            onClick={onClick}
            disabled={pending}
            data-test="comment-like-btn"
            aria-pressed={userHasLiked}
            aria-label={mondoTranslate(userHasLiked ? 'comments.unlike_aria_label' : 'comments.like_aria_label')}>
            <span className={`ms-comment__like-icon${iconPulsing ? ' is-popping' : ''}`}>
                <Icon icon={userHasLiked ? 'upvote-fill' : 'upvote'} />
            </span>
            {likesCount > 0 && (
                <span className="ms-comment__like-count">
                    <Odometer value={likesCount} />
                </span>
            )}
        </button>
    );
};
export default LikeButton;
