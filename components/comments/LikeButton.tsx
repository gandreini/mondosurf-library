'use client';

import { openLoginModal } from 'features/modal/modal.helpers';
import Icon from 'mondosurf-library/components/Icon';
import { likeComment, unlikeComment } from 'mondosurf-library/helpers/comments.helpers';
import { RootState } from 'mondosurf-library/redux/store';
import toastService from 'mondosurf-library/services/toastService';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { useState } from 'react';
import { useSelector } from 'react-redux';

interface ILikeButton {
    commentId: number;
    likesCount: number;
    userHasLiked: boolean;
    onToggle?: (newCount: number, newUserHasLiked: boolean) => void;
}

const LikeButton: React.FC<ILikeButton> = (props) => {
    const login = useSelector((state: RootState) => state.user.logged);

    const [likesCount, setLikesCount] = useState<number>(props.likesCount ?? 0);
    const [userHasLiked, setUserHasLiked] = useState<boolean>(props.userHasLiked ?? false);
    const [pending, setPending] = useState<boolean>(false);

    const callApi = () => {
        // Snapshot for revert.
        const prevCount = likesCount;
        const prevLiked = userHasLiked;

        const nextLiked = !prevLiked;
        const nextCount = prevCount + (nextLiked ? 1 : -1);

        // Optimistic.
        setUserHasLiked(nextLiked);
        setLikesCount(nextCount);
        setPending(true);

        // Keep the button disabled for at least this long so a fast double-tap
        // doesn't blow past the backend's 2-second per-(user, comment) rate
        // limit. Backend currently rejects with HTTP 429 / code=rate_limited
        // when re-toggled within 2s.
        const LIKE_COOLDOWN_MS = 2000;
        const startedAt = Date.now();
        const releaseAfterCooldown = () => {
            const elapsed = Date.now() - startedAt;
            const remaining = Math.max(0, LIKE_COOLDOWN_MS - elapsed);
            window.setTimeout(() => setPending(false), remaining);
        };

        const request = nextLiked ? likeComment(props.commentId) : unlikeComment(props.commentId);

        request
            .then((response) => {
                setLikesCount(response.likes_count);
                setUserHasLiked(response.user_has_liked);
                if (props.onToggle) props.onToggle(response.likes_count, response.user_has_liked);
                releaseAfterCooldown();
            })
            .catch((error: any) => {
                // Revert optimistic update.
                setUserHasLiked(prevLiked);
                setLikesCount(prevCount);
                // Suppress the toast for rate-limit specifically — the client
                // cooldown above is the user-facing guard, this is just a
                // safety net for edge cases (clock skew, multi-tab). Show
                // the toast for any other failure (network down, 5xx, etc.).
                if (error?.code !== 'rate_limited') {
                    toastService.error(mondoTranslate('comments.toast_like_error'));
                }
                releaseAfterCooldown();
            });
    };

    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        // Stop the click from bubbling up — the comment card on the homepage
        // (LatestComments) wraps each Comment in an <a> that navigates to the
        // comment's deep-link. We don't want liking to also navigate.
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
            className={`ms-comment__like-btn ms-small-text${userHasLiked ? ' is-liked' : ''}`}
            onClick={onClick}
            disabled={pending}
            data-test="comment-like-btn"
            aria-pressed={userHasLiked}
            aria-label={mondoTranslate(userHasLiked ? 'comments.unlike_aria_label' : 'comments.like_aria_label')}>
            <Icon icon={userHasLiked ? 'upvote-fill' : 'upvote'} />
            {likesCount > 0 && <span className="ms-comment__like-count">{likesCount}</span>}
        </button>
    );
};
export default LikeButton;
