export interface IComment {
    ID: number;
    comment_text: string | null;
    comment_author_id: number;
    comment_author_name: string | null;
    comment_date: string;
    commented_resource_id: number;
    commented_spot_name?: string;
    commented_spot_slug?: string;
    allow_editing?: boolean;
    callback?: () => void;
    expandable?: boolean;
    initialExpanded?: boolean;
    // Likes (Phase A)
    likes_count?: number;
    user_has_liked?: boolean;
    // Replies (Phase B)
    parent_id?: number;
    is_deleted?: boolean;
    replies?: IComment[];
    reply_count?: number;
}
