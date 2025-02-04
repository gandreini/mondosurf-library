'use client';

import useGetFetch from 'mondosurf-library/api/useGetFetch';
import Comment from 'mondosurf-library/components/comments/Comment';
import { IComment } from 'mondosurf-library/model/iComment';
import MondoLink from 'proxies/MondoLink';
import { useEffect } from 'react';
import { useState } from 'react';

import List from '../List';
import SkeletonLoader from '../SkeletonLoader';

const LatestComments: React.FC = (props) => {
    const [commentsQuery, setCommentsQuery] = useState('');
    const fetchedComments = useGetFetch(commentsQuery, {});

    // Fetch comments
    useEffect(() => {
        setCommentsQuery('comments?timestamp=' + new Date().getTime());
    }, []);

    return (
        <div className="ms-latest-comments">
            <div className="ms-desktop-max-width ms-side-spacing">
                <h2 className="ms-latest-comments__title ms-h2-title">Latest comments</h2>

                {/* Loading */}
                {fetchedComments.status !== 'loaded' && (
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

                {/* Loaded */}
                {fetchedComments.status === 'loaded' && (
                    <ul className="ms-latest-comments__list ms-grid-1-1" data-test="latest-comments">
                        <List
                            pageSize={4}
                            components={fetchedComments.payload.map((comment: IComment, index: number) => (
                                <MondoLink
                                    key={index}
                                    href={`surf-spot/${comment.commented_spot_slug}/comments/${comment.commented_resource_id}`}>
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
