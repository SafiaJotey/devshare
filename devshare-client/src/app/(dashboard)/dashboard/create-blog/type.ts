export type Category = "Frontend" | "Backend" | "DevOps" | "AI & Data" | "Security";


export type BlockType =
  | "p"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "ul"
  | "ol"
  | "code"
  | "quote"
  | "image"
    | "layout";

export interface ColumnItem {
  id: string;
  type: BlockType;
  content: string;
  metadata?: string;
}

export interface ColumnData {
  id: string;
  blocks: ColumnItem[];
}

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  metadata?: string;
}

export type OnUpdateFn = (content: string, metadata?: string) => void;