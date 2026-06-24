'use client';

import useAuthGetFetch from 'mondosurf-library/api/useAuthGetFetch';
import Comment from 'mondosurf-library/components/comments/Comment';
import { IComment } from 'mondosurf-library/model/iComment';
import MondoLink from 'proxies/MondoLink';
import { useEffect } from 'react';
import { useState } from 'react';

import List from '../List';
import SkeletonLoader from '../SkeletonLoader';

const LatestComments: React.FC = (props) => {
    const [commentsQuery, setCommentsQuery] = useState('');
    // useAuthGetFetch with needsAuth=false sends the access token when the user
    // is logged in, falls back to anonymous when not. Required for the backend
    // to return the per-user `user_has_liked` flag on each comment.
    const fetchedComments = useAuthGetFetch(commentsQuery, {}, false);

    // Stale-while-revalidate guard (mirrors Comments.tsx). useAuthGetFetch
    // re-runs on login (userLogged is one of its deps) and flips status to
    // 'loading' first. If the list were gated purely on status === 'loaded',
    // that transition would UNMOUNT the whole list (and every LikeButton) and
    // then remount it from the refetch — discarding the optimistic like a user
    // just made through the login gate, and re-seeding from the stale,
    // pre-commit user_has_liked=false. Keeping the list mounted after the first
    // successful load preserves those instances so the optimistic state holds.
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
    useEffect(() => {
        if (fetchedComments.status === 'loaded') setHasLoadedOnce(true);
    }, [fetchedComments.status]);

    // Fetch comments
    useEffect(() => {
        setCommentsQuery('comments?timestamp=' + new Date().getTime());
    }, []);

    return (
        <div className="ms-latest-comments">
            <div className="ms-desktop-max-width ms-side-spacing">
                <h2 className="ms-latest-comments__title ms-h2-title">Latest comments</h2>

                {/* First load only — skeletons. Subsequent refetches keep the
                    list visible (stale-while-revalidate) so it doesn't unmount. */}
                {!hasLoadedOnce && (
                    <ul className="ms-latest-comments__list ms-grid-1-1">
                        <SkeletonLoader height="53px" marginBottom="4px" />
                        <SkeletonLoader height="1px" marginBottom="4px" />
                        <SkeletonLoader height="53px" marginBottom="4px" />
                        <SkeletonLoader height="1px" marginBottom="4px" />
                        <SkeletonLoader height="53px" marginBottom="4px" />
                        <SkeletonLoader height="1px" marginBottom="4px" />
                        <SkeletonLoader height="53px" marginBottom="4px" />
                    </ul>
                )}

                {/* Loaded (stays mounted across refetches) */}
                {hasLoadedOnce && (
                    <ul className="ms-latest-comments__list ms-grid-1-1" data-test="latest-comments">
                        <List
                            pageSize={4}
                            components={fetchedComments.payload.map((comment: IComment) => (
                                <MondoLink
                                    key={comment.ID}
                                    href={`surf-spot/${comment.commented_spot_slug}/comments/${comment.commented_resource_id}#comment-${comment.ID}`}>
                                    <Comment
                                        comment_text={comment.comment_text}
                                        comment_author_name={
                                            comment.comment_author_name ? comment.comment_author_name.split(' ')[0] : ''
                                        }
                                        comment_author_id={comment.comment_author_id}
                                        comment_date={comment.comment_date}
                                        commented_resource_id={comment.commented_resource_id}
                                        commented_spot_name={comment.commented_spot_name}
                                        commented_spot_slug={comment.commented_spot_slug}
                                        ID={comment.ID}
                                        expandable={false}
                                        likes_count={comment.likes_count}
                                        user_has_liked={comment.user_has_liked}
                                        is_deleted={comment.is_deleted}
                                        reply_count={comment.reply_count}
                                    />
                                </MondoLink>
                            ))}
                        />
                    </ul>
                )}
            </div>
        </div>
    );
};
export default LatestComments;
