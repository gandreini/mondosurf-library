// Client
'use client';

import useGetFetch from 'mondosurf-library/api/useGetFetch';
import Comment from 'mondosurf-library/components/comments/Comment';
import CommentsForm from 'mondosurf-library/components/comments/CommentsForm';
import SkeletonLoader from 'mondosurf-library/components/SkeletonLoader';
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
    const fetchedComments = useGetFetch(commentsQuery);

    // Read URL hash on mount to determine which comment to focus
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hash = window.location.hash; // e.g., "#comment-123"
            const match = hash.match(/^#comment-(\d+)$/);
            if (match) {
                setFocusedCommentId(parseInt(match[1], 10));
            }
        }
    }, []);

    // Fetch comments
    useEffect(() => {
        setCommentsQuery('comments/' + props.resourceId);
    }, [props.resourceId]);

    // Updates the number of comments used by the loader
    useEffect(() => {
        if (fetchedComments.status === 'loaded') setNumberOfComments(fetchedComments.payload.length);
    }, [fetchedComments]);

    // Scroll to focused comment when comments are loaded
    useEffect(() => {
        if (focusedCommentId && fetchedComments.status === 'loaded') {
            const element = document.querySelector(`[data-comment-id="${focusedCommentId}"]`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
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

            {/* Loaded */}
            {fetchedComments.status === 'loaded' &&
                fetchedComments.payload.map((comment: IComment, key: number) => (
                    <Comment
                        key={key}
                        ID={comment.ID}
                        comment_text={comment.comment_text}
                        comment_author_name={
                            comment.comment_author_name ? comment.comment_author_name.split(' ')[0] : ''
                        }
                        comment_author_id={comment.comment_author_id}
                        comment_date={comment.comment_date}
                        callback={refreshComments}
                        allow_editing={true}
                        commented_resource_id={Number(props.resourceId)}
                        initialExpanded={focusedCommentId === comment.ID}
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
