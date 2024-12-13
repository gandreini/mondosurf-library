export interface IComment {
    ID: number;
    comment_text: string;
    comment_author_id: number;
    comment_author_name: string;
    comment_date: string;
    commented_resource_id: number;
    commented_spot_name?: string;
    commented_spot_slug?: string;
    allow_editing?: boolean;
    callback?: () => void;
}