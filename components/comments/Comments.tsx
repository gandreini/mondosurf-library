// Client
'use client';

import useAuthGetFetch from 'mondosurf-library/api/useAuthGetFetch';
import CommentThread from 'mondosurf-library/components/comments/CommentThread';
import CommentsForm from 'mondosurf-library/components/comments/CommentsForm';
import SkeletonLoader from 'mondosurf-library/components/SkeletonLoader';
import { scrollToCommentFromHash } from 'mondosurf-library/helpers/scrollToComment.helpers';
import { IComment } from 'mondosurf-library/model/iComment';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { useEffect, useState } from 'react';

interface IComments {
    resourceId: string;
    resourceName: string;
    shortText?: boolean;
}

const Comments: React.FC<IComments> = (props) => {
    const [commentsQuery, setCommentsQuery] = useState('');
    const [numberOfComments, setNumberOfComments] = useState(3);
    const [focusedCommentId, setFocusedCommentId] = useState<number | null>(null);
    // Tracks which thread's reply form is currently open. Only ONE reply form
    // can be open at a time across the whole list — clicking Reply on another
    // comment closes the previous one. Stored as the parent comment id, or
    // null when no form is open. State lives here (not in each CommentThread)
    // so the constraint is enforced globally.
    const [openReplyCommentId, setOpenReplyCommentId] = useState<number | null>(null);
    // Auth-aware GET: sends the token when logged in (so the backend can return
    // per-user `user_has_liked`), falls back to anonymous otherwise.
    const fetchedComments = useAuthGetFetch(commentsQuery, {}, false);

    // Read URL hash on mount to determine which comment to focus.
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const hash = window.location.hash;
        const match = hash.match(/^#comment-(\d+)$/);
        if (match) setFocusedCommentId(parseInt(match[1], 10));
    }, []);

    // Fetch comments
    useEffect(() => {
        setCommentsQuery('comments/' + props.resourceId);
    }, [props.resourceId]);

    // Updates the number of comments used by the loader.
    useEffect(() => {
        if (fetchedComments.status === 'loaded') setNumberOfComments(fetchedComments.payload.length);
    }, [fetchedComments]);

    // Scroll to the focused comment once the list is in the DOM + briefly highlight it.
    useEffect(() => {
        if (focusedCommentId && fetchedComments.status === 'loaded') {
            // Defer one tick so React has flushed the rendered comments into the DOM.
            const timeout = window.setTimeout(() => scrollToCommentFromHash(), 0);
            return () => window.clearTimeout(timeout);
        }
    }, [focusedCommentId, fetchedComments.status]);

    // Refresh comments
    const refreshComments = () => {
        setCommentsQuery('comments/' + props.resourceId + '?timestamp=' + new Date().getTime());
    };

    const hasComments = fetchedComments.status === 'loaded' && fetchedComments.payload.length > 0;

    return (
        <ul className="ms-comments">
            {fetchedComments.status === 'loaded' && fetchedComments.payload.length === 0 && (
                <p className="ms-comments__first-comment ms-body-text">
                    {mondoTranslate('comments.be_the_first', { resource_name: props.resourceName })}
                </p>
            )}

            {/* Guide text only shown when no comments exist */}
            {!hasComments && fetchedComments.status === 'loaded' && (
                <p className="ms-small-text">
                    {mondoTranslate(
                        props.shortText ? 'comments.spot_comment_guide_short' : 'comments.spot_comment_guide',
                        { resource_name: props.resourceName }
                    )}
                </p>
            )}

            {/* Show form at top when no comments */}
            {!hasComments && fetchedComments.status === 'loaded' && (
                <CommentsForm
                    resourceId={props.resourceId}
                    resourceName={props.resourceName}
                    callback={refreshComments}
                    autoFocus={true}
                />
            )}

            {/* Loading */}
            {fetchedComments.status !== 'loaded' && (
                <>
                    {Array.from({ length: numberOfComments }).map((_, key) => (
                        <div className="ms-comments__skeleton" key={key}>
                            <SkeletonLoader height="20px" width="180px" marginBottom="12px" />
                            <SkeletonLoader height="26px" />
                        </div>
                    ))}
                </>
            )}

            {/* Loaded — threaded shape: top-level Comments with their replies */}
            {fetchedComments.status === 'loaded' &&
                fetchedComments.payload.map((comment: IComment) => (
                    <CommentThread
                        key={comment.ID}
                        comment={comment}
                        resourceId={Number(props.resourceId)}
                        refreshComments={refreshComments}
                        focusedCommentId={focusedCommentId}
                        openReplyCommentId={openReplyCommentId}
                        setOpenReplyCommentId={setOpenReplyCommentId}
                    />
                ))}

            {/* Show form at bottom when there are comments */}
            {hasComments && fetchedComments.status === 'loaded' && (
                <CommentsForm
                    resourceId={props.resourceId}
                    resourceName={props.resourceName}
                    callback={refreshComments}
                    autoFocus={false}
                />
            )}
        </ul>
    );
};
export default Comments;
