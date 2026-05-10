import { handleAutoResize } from "../../helper";

interface HeadingBlockProps {
  content: string;
  // Use the "?" to make metadata optional so you can call onUpdate with 1 argument
  onUpdate: (content: string, metadata?: string) => void;
}

export const HeadingBlock = ({ content, onUpdate }: HeadingBlockProps) => (
  <textarea
    rows={1}
    className="text-3xl font-bold w-full bg-transparent border-none outline-none placeholder:text-foreground/10 resize-none overflow-hidden leading-tight"
    value={content}
    // Now this works because metadata is optional in the interface
    onChange={(e) => onUpdate(e.target.value)} 
    onInput={handleAutoResize}
    placeholder="Section Heading"
  />
);