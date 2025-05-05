export interface PostType {
  title: string | null;
  name: string | null;
  thread: number | null;
  content: string;
  post_num: number;
  parent_post_nums: number[];
  created_at: Date;
  is_op: boolean;
  board: string;
  image_url: string;
  admin: boolean;
};

export type NewPostType = {
  title: string | null;
  name: string | null;
  thread: number | null;
  content: string;
  created_at: Date;
  is_op: boolean;
  ip: string;
  board: string;
  recipients: Array<number> | null;
  image_url?: string
  image?: File
  admin: boolean
};

// Board catalog OP type
export interface CatalogOPType extends Omit<PostType, 'is_op'> {
  repliesCount: number;
};

export type ErrorWithStatusCode = {
  message: string;
  status: number
};