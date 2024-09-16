// Client
'use client';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import useGetFetch from 'mondosurf-library/api/useGetFetch';
import Comment from 'mondosurf-library/components/comments/Comment';
import CommentsForm from 'mondosurf-library/components/comments/CommentsForm';
import { ISurfSpotComment } from 'mondosurf-library/model/iSurfSpotComment';
import { useEffect, useState } from 'react';

import SkeletonLoader from '../SkeletonLoader';
import { mondoTranslate } from 'proxies/mondoTranslate';

interface IComments {
    resourceId: string;
    resourceName: string;
}

const Comments: React.FC<IComments> = (props) => {
    // Dayjs plugins.
    dayjs.extend(utc);
    dayjs.extend(timezone);

    const [commentsQuery, setCommentsQuery] = useState('');
    const [numberOfComments, setNumberOfComments] = useState(4);
    const fetchedComments = useGetFetch(commentsQuery, {});

    // Fetch comments
    useEffect(() => {
        setCommentsQuery('comments/' + props.resourceId);
    }, [props.resourceId]);

    // Refresh comments
    const refreshComments = () => {
        setCommentsQuery('comments/' + props.resourceId + '?timestamp=' + new Date().getTime());
    };

    // Updates the number of comments used by the loader
    useEffect(() => {
        setNumberOfComments(fetchedComments.payload.length);
    }, [fetchedComments]);

    return (
        <ul className="ms-comments">
            {fetchedComments.status === 'loaded' && fetchedComments.payload.length === 0 && (
                <p className="ms-large-text">
                    {mondoTranslate('comments.be_the_first', { resource_name: props.resourceName })}
                </p>
            )}
            <p className="ms-small-text">
                {mondoTranslate('comments.spot_comment_guide', { resource_name: props.resourceName })}
            </p>
            <CommentsForm resourceId={props.resourceId} resourceName={props.resourceName} callback={refreshComments} />

            {/* Loading */}
            {fetchedComments.status !== 'loaded' && (
                <>
                    {Array.from({ length: numberOfComments }).map((item, key) => (
                        <div className="ms-comments__skeleton" key={key}>
                            <SkeletonLoader height="20px" width="180px" />
                            <SkeletonLoader height="26px" />
                        </div>
                    ))}
                </>
            )}

            {/* Loaded */}
            {fetchedComments.status === 'loaded' &&
                fetchedComments.payload.map((comment: ISurfSpotComment, key: number) => (
                    <Comment
                        key={key}
                        commentId={comment.ID}
                        commentText={comment.comment_text}
                        commentAuthorName={comment.comment_author_name}
                        commentAuthorId={comment.comment_author_id}
                        commentDate={dayjs(comment.comment_date).format('DD-MM-YYYY HH:mm')}
                        callback={refreshComments}
                    />
                ))}
        </ul>
    );
};
export default Comments;
