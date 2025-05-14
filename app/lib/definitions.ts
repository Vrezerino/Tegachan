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
  country_name: string;
  country_code: string;
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
  admin: boolean;
  country_name: string;
  country_code: string;
};

// Board catalog OP type
export interface CatalogOPType extends PostType {
  latest_reply_created_at: Date;
  num_replies: number;
  op_created_at: Date;
  parent_post_nums: number[];
  repliesCount: number;
};

export type ErrorWithStatusCode = {
  message: string;
  status: number
};

export type NewsItem = {
  title?: string;
  creator?: string;
  link?: string;
  pubDate?: string;
  contentSnippet?: string;
};