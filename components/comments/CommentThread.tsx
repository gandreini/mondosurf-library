'use client';

import Comment from 'mondosurf-library/components/comments/Comment';
import ReplyForm from 'mondosurf-library/components/comments/ReplyForm';
import { withLoginGate } from 'mondosurf-library/helpers/auth.helpers';
import { IComment } from 'mondosurf-library/model/iComment';

interface ICommentThread {
    comment: IComment;
    resourceId: number;
    refreshComments: () => void;
    focusedCommentId?: number | null;
    // Lifted state — parent Comments component owns "which thread has its
    // reply form open" so the rule "only one form at a time" is enforced
    // globally. Each CommentThread derives its own open flag from comparison.
    openReplyCommentId?: number | null;
    setOpenReplyCommentId?: (id: number | null) => void;
}

const CommentThread: React.FC<ICommentThread> = ({
    comment,
    resourceId,
    refreshComments,
    focusedCommentId,
    openReplyCommentId,
    setOpenReplyCommentId
}) => {
    const replyFormOpen = openReplyCommentId === comment.ID;

    const openThisForm = () => setOpenReplyCommentId?.(comment.ID);
    const closeForm = () => setOpenReplyCommentId?.(null);

    const onReplyClick = () => {
        // Toggle behaviour: clicking the Reply button on this comment either
        // opens this thread's form (closing any other) or closes it if it's
        // already open. withLoginGate prompts a login first when needed.
        withLoginGate('replyButton', 'comments.login_modal_text_reply', () => {
            if (replyFormOpen) closeForm();
            else openThisForm();
        });
    };

    const onCancelReply = () => closeForm();

    const onReplyPosted = () => {
        closeForm();
        refreshComments();
    };

    const replies = comment.replies ?? [];

    // Thread layout (conversation model):
    //   1. Parent comment
    //   2. Existing replies, oldest → newest (backend already sorts ASC)
    //   3. Reply form (only when open)
    //
    // Form-at-end + ASC reply order means the new reply lands right where
    // the form was — no visual jump after posting. Reads like a growing
    // conversation rather than a reverse-chronological feed.
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
            {replyFormOpen && (
                <ReplyForm
                    parentCommentId={comment.ID}
                    spotId={resourceId}
                    onCancel={onCancelReply}
                    onReplyPosted={onReplyPosted}
                />
            )}
        </>
    );
};
export default CommentThread;
