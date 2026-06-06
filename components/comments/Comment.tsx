'use client';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { deleteApiAuthCall } from 'mondosurf-library/api/api';
import Icon from 'mondosurf-library/components/Icon';
import { relativeDate } from 'mondosurf-library/helpers/date.helpers';
import { truncateTextAfterNCharacters } from 'mondosurf-library/helpers/strings.helpers';
import { IComment } from 'mondosurf-library/model/iComment';
import { RootState } from 'mondosurf-library/redux/store';
import modalService from 'mondosurf-library/services/modalService';
import toastService from 'mondosurf-library/services/toastService';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { useSelector } from 'react-redux';

import ExpandableText from '../ExpandableText';
import LikeButton from './LikeButton';

interface ICommentProps extends IComment {
    // Whether to render the Reply button (top-level comments only; Phase B).
    onReplyClick?: () => void;
    // Whether the inline ReplyForm is currently open below this comment.
    replyFormOpen?: boolean;
}

const Comment: React.FC<ICommentProps> = (props) => {
    dayjs.extend(utc);
    dayjs.extend(timezone);

    const login = useSelector((state: RootState) => state.user.logged);
    const userIdRedux = useSelector((state: RootState) => state.user.userId);
    const accessToken = useSelector((state: RootState) => state.user.accessToken);

    const isDeleted = props.is_deleted === true;
    const isReply = props.parent_id !== undefined && props.parent_id !== null && props.parent_id !== -1;

    // Delete comment
    const onDeleteComment = () => {
        modalService.openModal({
            title: mondoTranslate('comments.delete_modal_title'),
            text: mondoTranslate('comments.delete_modal_text', {
                comment_text: truncateTextAfterNCharacters(props.comment_text ?? '', 100, true)
            }),
            classes: 'ms-modal-login',
            buttonText: mondoTranslate('comments.delete_modal_button'),
            buttonFunction: () => {
                deleteApiAuthCall('comments/' + props.ID, accessToken, {})
                    .then(() => {
                        toastService.success(
                            mondoTranslate('comments.toast_deletion_successful'),
                            'data-test-toast-comment-deleted'
                        );
                        modalService.closeModal();
                        if (props.callback) props.callback();
                    })
                    .catch(() => {
                        toastService.success(mondoTranslate('comments.toast_deletion_error'));
                        modalService.closeModal();
                    });
            },
            closeButtonText: 'Cancel'
        });
    };

    const canDelete = props.allow_editing
        && login === 'yes'
        && !!props.ID
        && userIdRedux === props.comment_author_id
        && !isDeleted;

    return (
        <li
            id={`comment-${props.ID}`}
            className={`ms-comment${isDeleted ? ' is-deleted' : ''}${isReply ? ' is-reply' : ''}`}
            data-test="comment"
            data-comment-id={props.ID}>
            <div className="ms-comment__header">
                <div className="ms-comment__header-left">
                    {props.commented_spot_name && (
                        <>
                            <p className="ms-comment__spot-name ms-small-text">{props.commented_spot_name}</p>
                            <p className="ms-small-text"> • </p>
                        </>
                    )}
                    <p className="ms-small-text"> by </p>
                    <p className="ms-comment__author ms-small-text">
                        {isDeleted || !props.comment_author_name
                            ? mondoTranslate('comments.deleted_placeholder')
                            : props.comment_author_name.split(' ')[0]}
                    </p>
                    <p className="ms-small-text"> • </p>
                    <p
                        className="ms-comment__date ms-small-text"
                        title={dayjs(props.comment_date).format('DD MMM YYYY HH:mm')}>
                        {relativeDate(props.comment_date)}
                    </p>
                </div>
                {canDelete && (
                    <div className="ms-comment__header-right">
                        <button className="ms-comment__delete" onClick={onDeleteComment} data-test="comment-delete">
                            <Icon icon="trash" />
                        </button>
                    </div>
                )}
            </div>
            <div className="ms-comment__content">
                <p className="ms-comment__text ms-body-text">
                    {isDeleted ? (
                        <span className="ms-comment__deleted-placeholder">
                            {mondoTranslate('comments.deleted_placeholder')}
                        </span>
                    ) : (
                        <ExpandableText
                            text={props.comment_text ?? ''}
                            expandable={props.expandable}
                            initialExpanded={props.initialExpanded}
                        />
                    )}
                </p>
            </div>
            {!isDeleted && (
                <div className="ms-comment__actions">
                    <LikeButton
                        commentId={props.ID}
                        likesCount={props.likes_count ?? 0}
                        userHasLiked={props.user_has_liked ?? false}
                    />
                    {/* Reply pill, top-level only. Two flavors:
                        - Spot page (onReplyClick provided): button that opens the
                          inline ReplyForm. Shows "Reply" + count when there are replies.
                        - Homepage card (no onReplyClick): purely informational, only
                          rendered when there are replies. The whole card is wrapped
                          in a link so clicking still works. */}
                    {!isReply && props.onReplyClick && (
                        <button
                            type="button"
                            className="ms-comment__reply-btn"
                            onClick={props.onReplyClick}
                            aria-expanded={props.replyFormOpen ?? false}
                            data-test="comment-reply-btn">
                            <Icon icon="reply" />
                            <span>{mondoTranslate('comments.reply')}</span>
                        </button>
                    )}
                    {!isReply && !props.onReplyClick && (props.reply_count ?? 0) > 0 && (
                        <span
                            className="ms-comment__reply-btn is-static"
                            data-test="comment-reply-count">
                            <Icon icon="reply" />
                            <span className="ms-comment__reply-count-text">{props.reply_count}</span>
                        </span>
                    )}
                </div>
            )}
        </li>
    );
};
export default Comment;
