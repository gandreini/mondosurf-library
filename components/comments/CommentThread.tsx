'use client';

import Comment from 'mondosurf-library/components/comments/Comment';
import ReplyForm from 'mondosurf-library/components/comments/ReplyForm';
import { IComment } from 'mondosurf-library/model/iComment';
import { openLoginModal } from 'features/modal/modal.helpers';
import { RootState } from 'mondosurf-library/redux/store';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { useState } from 'react';
import { useSelector } from 'react-redux';

interface ICommentThread {
    comment: IComment;
    resourceId: number;
    refreshComments: () => void;
    focusedCommentId?: number | null;
}

const CommentThread: React.FC<ICommentThread> = ({ comment, resourceId, refreshComments, focusedCommentId }) => {
    const login = useSelector((state: RootState) => state.user.logged);
    const [replyFormOpen, setReplyFormOpen] = useState<boolean>(false);

    const onReplyClick = () => {
        if (login !== 'yes') {
            openLoginModal('replyButton', undefined, mondoTranslate('comments.login_modal_text_reply'), () => {
                setReplyFormOpen(true);
            });
            return;
        }
        setReplyFormOpen((open) => !open);
    };

    const onCancelReply = () => {
        setReplyFormOpen(false);
    };

    const onReplyPosted = () => {
        setReplyFormOpen(false);
        refreshComments();
    };

    const replies = comment.replies ?? [];

    return (
        <>
            <Comment
                {...comment}
                commented_resource_id={resourceId}
                callback={refreshComments}
                allow_editing={true}
                initialExpanded={focusedCommentId === comment.ID}
                onReplyClick={onReplyClick}
                replyFormOpen={replyFormOpen}
            />
            {replyFormOpen && (
                <ReplyForm
                    parentCommentId={comment.ID}
                    spotId={resourceId}
                    onCancel={onCancelReply}
                    onReplyPosted={onReplyPosted}
                />
            )}
            {replies.map((reply) => (
                <Comment
                    key={reply.ID}
                    {...reply}
                    commented_resource_id={resourceId}
                    callback={refreshComments}
                    allow_editing={true}
                    initialExpanded={focusedCommentId === reply.ID}
                />
            ))}
        </>
    );
};
export default CommentThread;
