import { callApiAuth } from 'mondosurf-library/api/api';

export interface LikeResponse {
    likes_count: number;
    user_has_liked: boolean;
}

export const likeComment = (commentId: number): Promise<LikeResponse> => {
    return callApiAuth(`comments/${commentId}/like`, 'POST');
};

export const unlikeComment = (commentId: number): Promise<LikeResponse> => {
    return callApiAuth(`comments/${commentId}/like`, 'DELETE');
};

export const postReply = (parentCommentId: number, spotId: number, text: string): Promise<{ success: boolean }> => {
    return callApiAuth('comments', 'POST', {
        parent_comment_id: parentCommentId,
        spot_id: spotId,
        comment_text: text
    });
};
