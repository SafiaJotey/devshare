import { BookOpen, LucideProps } from "lucide-react";

export const BlogIcon = ({ className, size = 18, ...props }: LucideProps) => {
  return <BookOpen className={className} size={size} strokeWidth={2} {...props} />;
};

export default BlogIcon;