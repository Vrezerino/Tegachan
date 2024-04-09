export interface PostType {
    title: string | null;
    content: string;
    postNum: number;
    date: Date;
    OP: boolean;
    board: string;
    imageUrl: string;
    replies: PostType[]
    replyTo: PostType[]
}

// Board catalog OP type
export interface CatalogOPType extends Omit<PostType, 'replies' | 'replyTo' | 'OP'> {
    repliesCount: number;
}

export type ErrorWithStatusCode = {
    message: string;
    status: number
}