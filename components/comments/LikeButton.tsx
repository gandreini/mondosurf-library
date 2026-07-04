'use client';

import Odometer from 'mondosurf-library/components/Odometer';
import Icon from 'mondosurf-library/components/Icon';
import { withLoginGate } from 'mondosurf-library/helpers/auth.helpers';
import { likeComment, unlikeComment } from 'mondosurf-library/helpers/comments.helpers';
import toastService from 'mondosurf-library/services/toastService';
import { TrackingEvent } from 'mondosurf-library/constants/trackingEvent';
import { Tracker } from 'mondosurf-library/tracker/tracker';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { useEffect, useRef, useState } from 'react';

interface ILikeButton {
    commentId: number;
    likesCount: number;
    userHasLiked: boolean;
    // Spot the comment belongs to — used only for analytics context.
    spotId?: number;
    onToggle?: (newCount: number, newUserHasLiked: boolean) => void;
}

// Keep in sync with the backend's per-(user, comment) rate-limit window.
const LIKE_COOLDOWN_MS = 2000;
// Brief scale-pulse on the icon whenever the user toggles the like state.
const ICON_PULSE_MS = 380;

const LikeButton: React.FC<ILikeButton> = (props) => {
    const [likesCount, setLikesCount] = useState<number>(props.likesCount ?? 0);
    const [userHasLiked, setUserHasLiked] = useState<boolean>(props.userHasLiked ?? false);
    const [pending, setPending] = useState<boolean>(false);
    const [iconPulsing, setIconPulsing] = useState<boolean>(false);
    const pulseTimeoutRef = useRef<number | undefined>(undefined);

    // Re-sync from props when they change after mount. The key case: an
    // anonymous user taps the heart, logs in via the gate, and the parent
    // refetches the comments — at which point the server reports the
    // freshly-recorded like. Because the count/liked state is seeded into
    // useState (which only reads props on mount), without this effect the heart
    // would stay empty until a full page refresh. Skip while a local toggle is
    // in flight so we never clobber the optimistic update with stale props.
    useEffect(() => {
        if (pending) return;
        setLikesCount(props.likesCount ?? 0);
        setUserHasLiked(props.userHasLiked ?? false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.commentId, props.likesCount, props.userHasLiked]);

    const triggerIconPulse = () => {
        if (pulseTimeoutRef.current !== undefined) window.clearTimeout(pulseTimeoutRef.current);
        setIconPulsing(true);
        pulseTimeoutRef.current = window.setTimeout(() => setIconPulsing(false), ICON_PULSE_MS);
    };

    const callApi = () => {
        const prevLiked = userHasLiked;
        const prevCount = likesCount;
        const nextLiked = !prevLiked;
        const optimisticCount = Math.max(0, prevCount + (nextLiked ? 1 : -1));

        // Optimistic update: the icon AND the count move immediately, so the
        // click is unmistakably acknowledged (users watch the number, not the
        // glyph — a count that doesn't budge reads as "nothing happened"). The
        // server response reconciles the exact value below; a failure reverts
        // both. The re-click cooldown is kept, but decoupled from the count.
        setUserHasLiked(nextLiked);
        setLikesCount(optimisticCount);
        triggerIconPulse();
        setPending(true);

        const startedAt = Date.now();
        const request = nextLiked ? likeComment(props.commentId) : unlikeComment(props.commentId);

        request
            .then((response) => {
                // Analytics (Mixpanel): the toggle is now recorded server-side.
                Tracker.trackEvent(
                    ['mp'],
                    nextLiked ? TrackingEvent.CommentLikeAddedApi : TrackingEvent.CommentLikeRemovedApi,
                    { spot_id: props.spotId, comment_id: props.commentId }
                );
                // Reconcile the optimistic guess with the authoritative server
                // values (covers drift from a simultaneous toggle in another
                // tab). Applied immediately — the user already saw the change.
                setLikesCount(response.likes_count);
                setUserHasLiked(response.user_has_liked);
                if (props.onToggle) props.onToggle(response.likes_count, response.user_has_liked);
                // Honour the cooldown for re-clicking (matches the backend
                // per-(user, comment) rate-limit window).
                const elapsed = Date.now() - startedAt;
                const remaining = Math.max(0, LIKE_COOLDOWN_MS - elapsed);
                window.setTimeout(() => setPending(false), remaining);
            })
            .catch((error: any) => {
                // Revert the optimistic update — both icon and count — so the UI
                // reflects reality when the request is rejected.
                setUserHasLiked(prevLiked);
                setLikesCount(prevCount);
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
            });
    };

    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        // Prevent the click bubbling to the outer card link on the homepage.
        e.stopPropagation();
        e.preventDefault();
        if (pending) return;
        withLoginGate('likeButton', 'comments.login_modal_text_like', callApi);
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
                <Icon icon={userHasLiked ? 'thumbs-up-fill' : 'thumbs-up'} />
            </span>
            {/* Wrapper is always mounted so the 0 ↔ 1 boundary can animate
                (expand/collapse). The CSS `.is-empty` class collapses the
                width and fades out when there's no count to show. Inside,
                the Odometer keeps tracking the value so when we transition
                back through 0 → 1 the digit rolls into view as the wrapper
                opens. */}
            <span className={`ms-comment__like-count${likesCount === 0 ? ' is-empty' : ''}`}>
                <Odometer value={Math.max(1, likesCount)} />
            </span>
        </button>
    );
};
export default LikeButton;
