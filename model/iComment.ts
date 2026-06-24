export interface IComment {
    // Core
    ID: number;
    comment_text: string | null;
    comment_author_id: number;
    comment_author_name: string | null;
    comment_date: string;
    commented_resource_id: number;

    // Spot context (only set when the comment is rendered outside its spot
    // page, e.g. on the homepage's "Latest comments" feed).
    commented_spot_name?: string;
    commented_spot_slug?: string;

    // UI hints
    allow_editing?: boolean;
    expandable?: boolean;
    initialExpanded?: boolean;
    callback?: () => void;

    // Likes
    likes_count?: number;
    user_has_liked?: boolean;

    // Replies / threading
    parent_id?: number;
    replies?: IComment[];
    reply_count?: number;

    // Moderation
    is_deleted?: boolean;
}
