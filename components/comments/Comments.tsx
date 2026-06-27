// Client
'use client';

import useAuthGetFetch from 'mondosurf-library/api/useAuthGetFetch';
import CommentThread from 'mondosurf-library/components/comments/CommentThread';
import CommentsForm from 'mondosurf-library/components/comments/CommentsForm';
import SkeletonLoader from 'mondosurf-library/components/SkeletonLoader';
import { scrollToCommentFromHash } from 'mondosurf-library/helpers/scrollToComment.helpers';
import { IComment } from 'mondosurf-library/model/iComment';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { useEffect, useRef, useState } from 'react';

interface IComments {
    resourceId: string;
    resourceName: string;
    shortText?: boolean;
}

const Comments: React.FC<IComments> = (props) => {
    const [commentsQuery, setCommentsQuery] = useState('');
    const [numberOfComments, setNumberOfComments] = useState(3);
    const [focusedCommentId, setFocusedCommentId] = useState<number | null>(null);
    // Only one reply form open at a time — parent owns the state so the rule
    // is enforced globally across threads.
    const [openReplyCommentId, setOpenReplyCommentId] = useState<number | null>(null);
    // Auth-aware GET. The hook preserves the previous payload during a
    // refresh (stale-while-revalidate), so refreshComments() doesn't blank
    // the list mid-flight.
    const fetchedComments = useAuthGetFetch(commentsQuery, {}, false);

    // One-shot flag for first successful load — used to know whether to show
    // skeletons. After first load, refreshes keep showing the stale payload.
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
    useEffect(() => {
        if (fetchedComments.status === 'loaded') setHasLoadedOnce(true);
    }, [fetchedComments.status]);

    // Read URL hash on mount to determine which comment to focus.
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const match = window.location.hash.match(/^#comment-(\d+)$/);
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

    // Scroll to the focused comment once, the first time the list lands in the
    // DOM. The ref guard keeps the scroll a one-shot — subsequent refetches
    // (e.g. after posting a reply) shouldn't re-snap the viewport.
    const hasScrolledToHashRef = useRef<boolean>(false);
    useEffect(() => {
        if (hasScrolledToHashRef.current) return;
        if (!focusedCommentId || fetchedComments.status !== 'loaded') return;
        // Defer to the next animation frame so the comments React just queued
        // are committed to the DOM before we look them up by id.
        const handle = window.requestAnimationFrame(() => {
            scrollToCommentFromHash();
            hasScrolledToHashRef.current = true;
        });
        return () => window.cancelAnimationFrame(handle);
    }, [focusedCommentId, fetchedComments.status]);

    const refreshComments = () => {
        setCommentsQuery('comments/' + props.resourceId + '?timestamp=' + new Date().getTime());
    };

    const comments = fetchedComments.payload as IComment[];
    const hasComments = hasLoadedOnce && comments.length > 0;

    return (
        <ul className="ms-comments">
            {hasLoadedOnce && comments.length === 0 && (
                <p className="ms-comments__first-comment ms-body-text">
                    {mondoTranslate('comments.be_the_first', { resource_name: props.resourceName })}
                </p>
            )}

            {/* Guide text only shown when no comments exist */}
            {hasLoadedOnce && !hasComments && (
                <p className="ms-small-text">
                    {mondoTranslate(
                        props.shortText ? 'comments.spot_comment_guide_short' : 'comments.spot_comment_guide',
                        { resource_name: props.resourceName }
                    )}
                </p>
            )}

            {/* Show form at top when no comments */}
            {hasLoadedOnce && !hasComments && (
                <CommentsForm
                    resourceId={props.resourceId}
                    resourceName={props.resourceName}
                    callback={refreshComments}
                    autoFocus={true}
                />
            )}

            {/* Skeleton loaders — only on the very first load. After that the
                hook keeps the previous payload during refreshes, so the list
                stays visible. */}
            {!hasLoadedOnce && (
                <>
                    {Array.from({ length: numberOfComments }).map((_, key) => (
                        <div className="ms-comments__skeleton" key={key}>
                            <SkeletonLoader height="20px" width="180px" marginBottom="12px" />
                            <SkeletonLoader height="26px" />
                        </div>
                    ))}
                </>
            )}

            {/* Loaded — threaded shape: top-level Comments with their replies. */}
            {hasLoadedOnce &&
                comments.map((comment) => (
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
            {hasComments && (
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
