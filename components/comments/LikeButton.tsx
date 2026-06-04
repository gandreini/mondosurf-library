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

        const request = nextLiked ? likeComment(props.commentId) : unlikeComment(props.commentId);

        request
            .then((response) => {
                setPending(false);
                setLikesCount(response.likes_count);
                setUserHasLiked(response.user_has_liked);
                if (props.onToggle) props.onToggle(response.likes_count, response.user_has_liked);
            })
            .catch(() => {
                // Revert.
                setPending(false);
                setUserHasLiked(prevLiked);
                setLikesCount(prevCount);
                toastService.error(mondoTranslate('comments.toast_like_error'));
            });
    };

    const onClick = () => {
        if (pending) return;
        if (login !== 'yes') {
            openLoginModal('likeButton', undefined, mondoTranslate('comments.login_modal_text'), () => {
                // After login, perform the action.
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
            <Icon icon={userHasLiked ? 'heart' : 'heart-empty'} />
            {likesCount > 0 && <span className="ms-comment__like-count">{likesCount}</span>}
        </button>
    );
};
export default LikeButton;
