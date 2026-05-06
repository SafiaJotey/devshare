export type Category = "Frontend" | "Backend" | "DevOps" | "AI & Data" | "Security";


export type BlockType = "h2" | "p" | "code" | "quote" | "image";

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  metadata?: string;
}