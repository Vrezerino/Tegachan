export interface PostType {
    title: string | null;
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
    content: string;
    date: Date;
    OP: boolean;
    IP: string;
    board: string;
    replyTo: Array<number>
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