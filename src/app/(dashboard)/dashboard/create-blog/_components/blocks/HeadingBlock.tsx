/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleAutoResize } from "../../helper";

export const HeadingBlock = ({ content, onUpdate }: any) => (
  <textarea
    rows={1}
    className="text-3xl font-bold w-full bg-transparent border-none outline-none placeholder:text-foreground/10 resize-none overflow-hidden leading-tight"
    value={content}
    onChange={(e) => onUpdate(e.target.value)}
    onInput={handleAutoResize}
    placeholder="Section Heading"
  />
);