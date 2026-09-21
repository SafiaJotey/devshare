import { Home, LucideProps } from "lucide-react";

export const HomeIcon = ({ className, size = 18, ...props }: LucideProps) => {
  return <Home className={className} size={size} strokeWidth={2} {...props} />;
};

export default HomeIcon;