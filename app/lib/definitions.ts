export interface PostType {
    title: string | null;
    thread: number | null;
    content: string;
    postNum: number;
    date: Date;
    OP: boolean;
    board: string;
    imageUrl: string;
    replyPostNums: Array<number>;
    replies: PostType[];
    replyTo: Array<number>;
    admin: boolean;
};

export type NewPostType = {
    title: string;
    thread: number | null;
    content: string;
    date: Date;
    OP: boolean;
    IP: string;
    board: string;
    replies: Array<number>
    imageUrl?: string
    image?: File
};

// Board catalog OP type
export interface CatalogOPType extends Omit<PostType, 'replies' | 'replyTo' | 'OP'> {
    repliesCount: number;
};

export type ErrorWithStatusCode = {
    message: string;
    status: number
};

export interface CounterDocument {
    _id: string;
    seq_value: number;
}