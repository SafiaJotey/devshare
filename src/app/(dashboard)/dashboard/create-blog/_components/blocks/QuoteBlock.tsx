import { handleAutoResize } from "../../helper";

export const QuoteBlock = ({ content, onUpdate }: any) => (
  <div className="border-l-4 border-accent pl-8 py-4 my-6 bg-accent/5 rounded-r-2xl">
    <textarea
      rows={1}
      value={content}
      onChange={(e) => onUpdate(e.target.value)}
      placeholder="Insightful engineering quote..."
      className="w-full italic text-2xl font-serif border-none bg-transparent px-0 focus:outline-none resize-none text-foreground/80 placeholder:text-foreground/10 overflow-hidden leading-relaxed"
      onInput={handleAutoResize}
    />
  </div>
);