export type NewPost = {
    author_name: string;
    title: string;
    body: string;
}

export type Post = {
    id: string
    author_name: string;
    title: string;
    body: string;
    created_at: string;
    deleted_at: string | null;
}