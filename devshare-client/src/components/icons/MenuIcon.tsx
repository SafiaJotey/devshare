import { Menu, LucideProps } from "lucide-react";

export const MenuIcon = ({ className, size = 18, ...props }: LucideProps) => {
  return <Menu className={className} size={size} strokeWidth={2} {...props} />;
};

export default MenuIcon;